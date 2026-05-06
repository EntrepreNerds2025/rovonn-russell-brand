import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CRM_URL = 'https://oyjbpxdcazamsdtrrmey.supabase.co';

// Rate limiting: simple in-memory tracker (resets on cold start)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max submissions per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, 1000);
}

type FormType = 'strategy_call' | 'speaking_inquiry' | 'contact_form' | 'tool_signup';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again shortly.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const formType = body.form_type as FormType;

    if (!['strategy_call', 'speaking_inquiry', 'contact_form', 'tool_signup'].includes(formType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid form_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = sanitize(body.email);
    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'A valid email is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const crmKey = Deno.env.get('CRM_SERVICE_ROLE_KEY');
    if (!crmKey) {
      console.error('CRM_SERVICE_ROLE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const crm = createClient(CRM_URL, crmKey);

    // 1. Resolve rovonn_russell entity
    const { data: entity } = await crm
      .from('crm_entities')
      .select('id')
      .eq('slug', 'rovonn_russell')
      .single();

    const entityId = entity?.id || null;

    // 2. Upsert contact (check by email first)
    const name = sanitize(body.name) || sanitize(body.email).split('@')[0];
    const organization = sanitize(body.organization || body.org || '');

    const { data: existingContact } = await crm
      .from('contacts')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    let contactId: string;

    if (existingContact) {
      contactId = existingContact.id;
      await crm.from('contacts').update({
        name: name || undefined,
        notes: organization ? `Organization: ${organization}` : undefined,
        engagement_source: 'rovonnrussell.com',
        last_touchpoint: formType,
        updated_at: new Date().toISOString(),
      }).eq('id', contactId);
    } else {
      const { data: newContact, error: contactErr } = await crm
        .from('contacts')
        .insert({
          name,
          email,
          notes: organization ? `Organization: ${organization}` : null,
          engagement_source: 'rovonnrussell.com',
          last_touchpoint: formType,
          primary_entity_id: entityId,
          brand_entry_point: 'rovonnrussell_website',
          relationship_origin: 'website_form',
        })
        .select('id')
        .single();

      if (contactErr || !newContact) {
        console.error('Contact insert error:', contactErr);
        return new Response(
          JSON.stringify({ error: 'Failed to create contact.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      contactId = newContact.id;

      // Link contact to entity
      if (entityId) {
        await crm.from('contact_entities').insert({
          contact_id: contactId,
          entity_id: entityId,
          brand_entry_point: 'rovonnrussell_website',
          relationship_origin: 'website_form',
          is_primary: true,
        });
      }
    }

    // 3. Create lead
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const { data: newLead } = await crm
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        company_name: organization || null,
        lead_source: 'website',
        lead_status: 'new',
        business_unit: 'rovonn_russell',
        inquiry_type: formType,
        primary_entity_id: entityId,
        notes: buildLeadNotes(formType, body),
        event_date: sanitize(body.event_date) || null,
      })
      .select('id')
      .single();

    // 4. Create lead_activity (use note_added as the closest enum value)
    if (newLead) {
      await crm.from('lead_activities').insert({
        lead_id: newLead.id,
        activity_type: 'note_added',
        title: getActivityTitle(formType),
        description: buildActivityDescription(formType, body),
        metadata: {
          form_type: formType,
          source: 'rovonnrussell.com',
          submitted_at: new Date().toISOString(),
        },
      });
    }

    // 5. Create opportunity (not for tool_signup)
    if (formType !== 'tool_signup') {
      const oppConfig = getOpportunityConfig(formType, name);
      await crm.from('opportunities').insert({
        title: oppConfig.title,
        opportunity_type: oppConfig.type,
        stage: 'identified',
        source_entity_id: entityId,
        originated_from_entity_id: entityId,
        brand_entry_point: 'rovonnrussell_website',
        relationship_origin: 'website_form',
        influence_path: 'website → form submission',
        notes: buildLeadNotes(formType, body),
      });
    }

    // 6. Create agent_task for high-priority forms
    if (formType === 'strategy_call' || formType === 'speaking_inquiry') {
      const taskConfig = getAgentTaskConfig(formType, name, email);
      await crm.from('agent_tasks').insert({
        title: taskConfig.title,
        description: taskConfig.description,
        status: 'pending',
        priority: 'high',
        agent_name: 'system_web_capture',
        tags: ['website_lead', formType, 'rovonn_russell'],
      });
    } else if (formType === 'contact_form') {
      const interest = sanitize(body.interest || body.interest_type || '');
      await crm.from('agent_tasks').insert({
        title: `Follow up: Website contact from ${name}`,
        description: `Interest: ${interest || 'general'}. Email: ${email}. Org: ${organization || 'N/A'}`,
        status: 'pending',
        priority: 'medium',
        agent_name: 'system_web_capture',
        tags: ['website_lead', 'contact_form', 'rovonn_russell'],
      });
    }

    // 7. Fire-and-forget internal notification email via Resend
    sendInternalNotification(formType, name, email, organization, body).catch((e) =>
      console.error('Resend notification failed:', e)
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Submission received successfully.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('submit-website-form error:', message);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendInternalNotification(
  formType: FormType,
  name: string,
  email: string,
  organization: string,
  body: Record<string, unknown>
) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set; skipping notification email');
    return;
  }

  const subjectMap: Record<FormType, string> = {
    strategy_call: '🎯 New Strategy Call Request',
    speaking_inquiry: '🎤 New Speaking Inquiry',
    contact_form: '✉️ New Contact Form Submission',
    tool_signup: '🤖 New AI Tool Signup',
  };

  const lines = [
    `<p><strong>Form:</strong> ${formType}</p>`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
  ];
  if (organization) lines.push(`<p><strong>Organization:</strong> ${escapeHtml(organization)}</p>`);
  if (body.message) lines.push(`<p><strong>Message:</strong><br>${escapeHtml(String(body.message))}</p>`);
  if (body.event_name || body.event) lines.push(`<p><strong>Event:</strong> ${escapeHtml(String(body.event_name || body.event))}</p>`);
  if (body.event_date) lines.push(`<p><strong>Event Date:</strong> ${escapeHtml(String(body.event_date))}</p>`);
  if (body.interest || body.interest_type) lines.push(`<p><strong>Interest:</strong> ${escapeHtml(String(body.interest || body.interest_type))}</p>`);
  if (body.tool_name) lines.push(`<p><strong>Tool:</strong> ${escapeHtml(String(body.tool_name))}</p>`);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;">
      <h2 style="color:#b8860b;margin:0 0 16px;">${subjectMap[formType]}</h2>
      <p style="color:#666;margin:0 0 16px;">A new lead just landed via rovonnrussell.com.</p>
      <div style="background:#faf8f3;padding:16px;border-radius:8px;border-left:3px solid #b8860b;">
        ${lines.join('')}
      </div>
      <p style="color:#999;font-size:12px;margin-top:24px;">Already saved to CRM. Reply directly to contact the lead.</p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Rovonn Russell Website <onboarding@resend.dev>',
      to: ['rovonn@impactloop.ca'],
      reply_to: email,
      subject: `${subjectMap[formType]} – ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Resend API error:', res.status, text);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildLeadNotes(formType: FormType, body: Record<string, unknown>): string {
  const lines: string[] = [`Source: rovonnrussell.com`, `Form: ${formType}`];
  if (body.message) lines.push(`Message: ${sanitize(body.message as string)}`);
  if (body.organization || body.org) lines.push(`Organization: ${sanitize((body.organization || body.org) as string)}`);
  if (body.event_name || body.event) lines.push(`Event: ${sanitize((body.event_name || body.event) as string)}`);
  if (body.event_date) lines.push(`Event Date: ${sanitize(body.event_date as string)}`);
  if (body.interest || body.interest_type) lines.push(`Interest: ${sanitize((body.interest || body.interest_type) as string)}`);
  if (body.tool_name) lines.push(`Tool: ${sanitize(body.tool_name as string)}`);
  return lines.join('\n');
}

function getActivityTitle(formType: FormType): string {
  const titles: Record<FormType, string> = {
    strategy_call: 'Strategy call request via website',
    speaking_inquiry: 'Speaking inquiry via website',
    contact_form: 'Contact form submission via website',
    tool_signup: 'AI tool signup via website',
  };
  return titles[formType];
}

function buildActivityDescription(formType: FormType, body: Record<string, unknown>): string {
  return `${formType} submission from rovonnrussell.com. ${body.message ? `Message: ${sanitize(body.message as string)}` : ''}`;
}

function getOpportunityConfig(formType: FormType, name: string) {
  switch (formType) {
    case 'strategy_call':
      return { title: `Strategy consultation: ${name}`, type: 'strategy_consultation' };
    case 'speaking_inquiry':
      return { title: `Speaking engagement: ${name}`, type: 'speaking_engagement' };
    case 'contact_form':
      return { title: `Website inquiry: ${name}`, type: 'general_inquiry' };
    default:
      return { title: `Website lead: ${name}`, type: 'general_inquiry' };
  }
}

function getAgentTaskConfig(formType: FormType, name: string, email: string) {
  switch (formType) {
    case 'strategy_call':
      return {
        title: `Strategy call follow-up: ${name}`,
        description: `New strategy call request from ${name} (${email}) via rovonnrussell.com. Schedule discovery call.`,
      };
    case 'speaking_inquiry':
      return {
        title: `Speaking inquiry review: ${name}`,
        description: `New speaking inquiry from ${name} (${email}) via rovonnrussell.com. Review event details and respond.`,
      };
    default:
      return {
        title: `Follow up: ${name}`,
        description: `New submission from ${name} (${email}) via rovonnrussell.com.`,
      };
  }
}

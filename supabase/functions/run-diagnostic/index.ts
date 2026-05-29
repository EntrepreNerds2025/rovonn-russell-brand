import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CRM_URL = 'https://oyjbpxdcazamsdtrrmey.supabase.co';

// Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 300_000; // 5 minutes

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
  return val.trim().slice(0, 2000);
}

interface DiagnosticResponse {
  org_type: string;
  problem_solved: string;
  beneficiaries: string;
  communication_channels: string[];
  story_clarity: string;
  proof_of_impact: string[];
  publish_frequency: string;
  biggest_challenge: string;
  desired_outcome: string;
  org_name?: string;
}

interface DiagnosticScores {
  impact_story_score: number;
  story_clarity_score: number;
  visibility_score: number;
}

interface DiagnosticReport {
  scores: DiagnosticScores;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

const SYSTEM_PROMPT = `You are an expert AI Advisor analyzing how effectively an organization communicates its social impact. You evaluate storytelling clarity, proof of impact, and visibility.

You MUST respond by calling the "generate_diagnostic_report" function. Do not respond with plain text.

Scoring guidelines (each 0-100):
- impact_story_score: Overall effectiveness of their impact storytelling. Consider narrative strength, proof, and audience alignment.
- story_clarity_score: How clear and compelling their story is to outsiders. Based on problem clarity, beneficiary definition, and self-assessed clarity.
- visibility_score: How well they share their story. Based on channels used, publishing frequency, and proof diversity.

Be specific, actionable, and constructive. Reference their actual responses. Write as a senior strategist delivering a mini-consultation.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many diagnostic requests. Please try again in a few minutes.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const responses: DiagnosticResponse = body.responses;
    const email = sanitize(body.email);
    const orgName = sanitize(body.org_name || responses?.org_name || '');

    if (!responses || !responses.org_type || !responses.problem_solved) {
      return new Response(
        JSON.stringify({ error: 'Please complete all required questions.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'A valid email is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build user prompt from responses
    const userPrompt = `Analyze this organization's impact storytelling:

Organization type: ${responses.org_type}
Problem they solve: ${sanitize(responses.problem_solved)}
Who benefits: ${sanitize(responses.beneficiaries)}
Communication channels: ${Array.isArray(responses.communication_channels) ? responses.communication_channels.join(', ') : responses.communication_channels}
Self-assessed story clarity: ${responses.story_clarity}
Proof of impact shown: ${Array.isArray(responses.proof_of_impact) ? responses.proof_of_impact.join(', ') : responses.proof_of_impact}
Publishing frequency: ${responses.publish_frequency}
Biggest challenge: ${responses.biggest_challenge}
Desired outcome: ${responses.desired_outcome}
${orgName ? `Organization name: ${orgName}` : ''}`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_diagnostic_report',
              description: 'Generate a structured Impact Story Diagnostic report with scores, insights, and recommendations.',
              parameters: {
                type: 'object',
                properties: {
                  impact_story_score: { type: 'number', description: 'Overall impact story effectiveness score 0-100' },
                  story_clarity_score: { type: 'number', description: 'Story clarity score 0-100' },
                  visibility_score: { type: 'number', description: 'Visibility and reach score 0-100' },
                  summary: { type: 'string', description: 'A 2-3 sentence summary of current storytelling strength.' },
                  strengths: { type: 'array', items: { type: 'string' }, description: '2-4 key storytelling strengths.' },
                  gaps: { type: 'array', items: { type: 'string' }, description: '2-4 key storytelling gaps.' },
                  recommendations: { type: 'array', items: { type: 'string' }, description: '3-5 specific, actionable strategic recommendations.' },
                },
                required: ['impact_story_score', 'story_clarity_score', 'visibility_score', 'summary', 'strengths', 'gaps', 'recommendations'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'generate_diagnostic_report' } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service is busy. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errText = await aiResponse.text();
      console.error('AI gateway error:', status, errText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate analysis.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error('No tool call in AI response:', JSON.stringify(aiData));
      return new Response(
        JSON.stringify({ error: 'Failed to parse analysis.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const report: DiagnosticReport & DiagnosticScores = JSON.parse(toolCall.function.arguments);
    const scores: DiagnosticScores = {
      impact_story_score: Math.min(100, Math.max(0, Math.round(report.impact_story_score))),
      story_clarity_score: Math.min(100, Math.max(0, Math.round(report.story_clarity_score))),
      visibility_score: Math.min(100, Math.max(0, Math.round(report.visibility_score))),
    };

    const diagnosticResult: DiagnosticReport = {
      scores,
      summary: report.summary,
      strengths: report.strengths,
      gaps: report.gaps,
      recommendations: report.recommendations,
    };

    // Write to CRM
    const crmKey = Deno.env.get('CRM_SERVICE_ROLE_KEY');
    if (crmKey) {
      try {
        const crm = createClient(CRM_URL, crmKey);

        // Resolve entity
        const { data: entity } = await crm
          .from('crm_entities')
          .select('id')
          .eq('slug', 'rovonn_russell')
          .single();
        const entityId = entity?.id || null;

        // Upsert contact
        const name = sanitize(body.name) || email.split('@')[0];
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
            notes: orgName ? `Organization: ${orgName}` : undefined,
            engagement_source: 'rovonnrussell.com',
            last_touchpoint: 'impact_story_diagnostic',
            updated_at: new Date().toISOString(),
          }).eq('id', contactId);
        } else {
          const { data: newContact } = await crm
            .from('contacts')
            .insert({
              name,
              email,
              notes: orgName ? `Organization: ${orgName}` : null,
              engagement_source: 'rovonnrussell.com',
              last_touchpoint: 'impact_story_diagnostic',
              primary_entity_id: entityId,
              brand_entry_point: 'rovonnrussell_website',
              relationship_origin: 'diagnostic_tool',
            })
            .select('id')
            .single();
          contactId = newContact?.id || '';

          if (contactId && entityId) {
            await crm.from('contact_entities').insert({
              contact_id: contactId,
              entity_id: entityId,
              brand_entry_point: 'rovonnrussell_website',
              relationship_origin: 'diagnostic_tool',
              is_primary: true,
            });
          }
        }

        // Create lead
        const nameParts = name.split(' ');
        const { data: newLead } = await crm
          .from('leads')
          .insert({
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email,
            company_name: orgName || null,
            lead_source: 'website',
            lead_status: 'new',
            business_unit: 'rovonn_russell',
            inquiry_type: 'impact_story_diagnostic',
            primary_entity_id: entityId,
            notes: `Impact Story Diagnostic completed.\nScores: Impact ${scores.impact_story_score}, Clarity ${scores.story_clarity_score}, Visibility ${scores.visibility_score}\nOrg Type: ${responses.org_type}\nChallenge: ${responses.biggest_challenge}\nDesired Outcome: ${responses.desired_outcome}`,
          })
          .select('id')
          .single();

        // Create lead activity
        if (newLead) {
          await crm.from('lead_activities').insert({
            lead_id: newLead.id,
            activity_type: 'note_added',
            title: 'Impact Story Diagnostic completed',
            description: `Diagnostic completed via rovonnrussell.com. Scores: Impact ${scores.impact_story_score}/100, Clarity ${scores.story_clarity_score}/100, Visibility ${scores.visibility_score}/100.`,
            metadata: {
              form_type: 'impact_story_diagnostic',
              source: 'rovonnrussell.com',
              scores,
              responses,
              report: diagnosticResult,
              submitted_at: new Date().toISOString(),
            },
          });
        }

        // Create opportunity if scores indicate need
        const avgScore = (scores.impact_story_score + scores.story_clarity_score + scores.visibility_score) / 3;
        const highNeed = avgScore < 60 ||
          ['attracting funding', 'attracting partners', 'getting attention'].includes(responses.biggest_challenge);

        if (highNeed) {
          await crm.from('opportunities').insert({
            title: `Storytelling strategy: ${orgName || name}`,
            opportunity_type: 'strategy_consultation',
            stage: 'identified',
            source_entity_id: entityId,
            originated_from_entity_id: entityId,
            brand_entry_point: 'rovonnrussell_website',
            relationship_origin: 'diagnostic_tool',
            influence_path: 'website -> diagnostic tool -> low scores',
            notes: `Diagnostic scores: Impact ${scores.impact_story_score}, Clarity ${scores.story_clarity_score}, Visibility ${scores.visibility_score}. Challenge: ${responses.biggest_challenge}. Goal: ${responses.desired_outcome}.`,
          });

          await crm.from('agent_tasks').insert({
            title: `Diagnostic follow-up: ${orgName || name}`,
            description: `High-need diagnostic lead. Avg score: ${Math.round(avgScore)}/100. Challenge: ${responses.biggest_challenge}. Email: ${email}. Recommend strategy conversation.`,
            status: 'pending',
            priority: avgScore < 40 ? 'high' : 'medium',
            agent_name: 'system_web_capture',
            tags: ['diagnostic_lead', 'rovonn_russell', 'high_need'],
          });
        }
      } catch (crmErr) {
        console.error('CRM write error (non-blocking):', crmErr);
        // Don't fail the diagnostic if CRM write fails
      }
    }

    return new Response(
      JSON.stringify({ success: true, report: diagnosticResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('run-diagnostic error:', message);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

type ListKey = "prompt_codes";

type SubscribeBody = {
  list: ListKey;
  email: string;
  first_name: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const listConfig: Record<ListKey, { table: string; title: string; pdfUrl: string; subject: string }> = {
  prompt_codes: {
    table: "prompt_codes_subscribers",
    title: "The Founder's Prompt Codes",
    pdfUrl: "https://rovonnrussell.com/resources/the-founders-prompt-codes.pdf",
    subject: "Your Founder's Prompt Codes",
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function firstName(value: string) {
  return value.trim();
}

async function sendWelcomeEmail(params: {
  apiKey: string;
  to: string;
  name: string;
  subject: string;
  title: string;
  pdfUrl: string;
}) {
  const html = `
    <p>Hey ${params.name},</p>
    <p>Here is ${params.title}.</p>
    <p><a href="${params.pdfUrl}">Download ${params.title}</a></p>
    <p>Start with the first section before you add another AI tool. It will help you see where AI should actually fit in the business.</p>
    <p>Rovonn</p>
    <p style="color:#6b6259;font-size:13px;">P.S. If you want a personal read on your business, The Edge is here: <a href="https://rovonnrussell.com/the-edge">https://rovonnrussell.com/the-edge</a></p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Rovonn Russell <rovonn@rovonnrussell.com>",
      to: params.to,
      subject: params.subject,
      html,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend failed: ${message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json()) as SubscribeBody;
    const config = listConfig[body.list];

    if (!config) {
      return jsonResponse({ error: "Invalid list" }, 400);
    }

    const email = normalizeEmail(body.email || "");
    const name = firstName(body.first_name || "");

    if (!email || !name) {
      return jsonResponse({ error: "Email and first_name are required" }, 400);
    }

    const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));
    const resendKey = requireEnv("RESEND_API_KEY");

    const record = {
      email,
      first_name: name,
      source: body.source || "site_form",
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
    };

    const { error: upsertError } = await supabase
      .from(config.table)
      .upsert(record, { onConflict: "email" });

    if (upsertError) throw upsertError;

    await sendWelcomeEmail({
      apiKey: resendKey,
      to: email,
      name,
      subject: config.subject,
      title: config.title,
      pdfUrl: config.pdfUrl,
    });

    const { error: updateError } = await supabase
      .from(config.table)
      .update({ pdf_sent_at: new Date().toISOString() })
      .eq("email", email);

    if (updateError) throw updateError;

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("subscribe-to-list failed", error);
    return jsonResponse({ error: "Unable to subscribe right now" }, 500);
  }
});

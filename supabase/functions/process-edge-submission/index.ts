// Supabase Edge Function: process-edge-submission
// Trigger: HTTP POST from the site form OR Supabase webhook on insert
// Generated: 2026-05-23
//
// Required environment variables:
//   ANTHROPIC_API_KEY    Claude API key
//   RESEND_API_KEY       Resend transactional email key
//   FIRECRAWL_API_KEY    Firecrawl scraping key (optional, gracefully skips if absent)
//   SUPABASE_URL         Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY Service role key (NOT anon key)
//   ROVONN_EMAIL         Rovonn's inbox for briefings
//   PLAYBOOK_PDF_URL     Public URL of The ADAPT Playbook PDF
//   BOOKING_URL          Personal brand bookings page (defaults to /book on the live site)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.30.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY") ?? "";
const ROVONN_EMAIL = Deno.env.get("ROVONN_EMAIL") ?? "rovonn@rovonnrussell.com";
const PLAYBOOK_PDF_URL = Deno.env.get("PLAYBOOK_PDF_URL") ?? "https://rovonnrussell.com/resources/the-adapt-playbook.pdf";
const BOOKING_URL = Deno.env.get("BOOKING_URL") ?? "https://rovonnrussell.com/book?type=edge-followup";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

// ============================================
// Helpers
// ============================================

async function sendEmail({ to, from, subject, html, replyTo }: {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
    throw new Error("Email send failed");
  }
  return res.json();
}

async function scrapeBusinessUrl(url: string): Promise<string> {
  if (!url || !FIRECRAWL_API_KEY) return "";
  try {
    const res = await fetch("https://api.firecrawl.dev/v0/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, pageOptions: { onlyMainContent: true } }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return (data?.data?.markdown ?? data?.data?.content ?? "").slice(0, 8000);
  } catch (err) {
    console.error("Firecrawl error:", err);
    return "";
  }
}

const BRIEFING_SYSTEM_PROMPT = `You are a research analyst preparing The Edge briefing for Rovonn Russell, an AI advisor for founders and small business owners. Rovonn is about to write a personal email response recommending the FIRST AI workflow this founder should install. Your job is to give him everything he needs in under 10 minutes.

Brand context:
- Tagline: "Don't just adopt AI. ADAPT it."
- The five outcomes founders want: save time, protect margin, achieve success, stop struggling, unlock work
- The ADAPT framework: Assess, Discover, Apply, Produce, Transform
- Deliverable language: each recommended AI install is framed as a "Virtual Employee" (e.g., Virtual Proposal Writer, Virtual Inbox Manager, Virtual Project Manager)
- Tone: bridge tone. Confident but not bro, warm but not soft

Structure the briefing in exactly these 6 sections:

## 1. SNAPSHOT (2-3 lines)
Business size, industry, who they serve.

## 2. THE BOTTLENECK (1 paragraph)
Based on what they said + the scraped website, what is the specific bottleneck?

## 3. THE WRONG MOVE (1 paragraph)
What generic AI install would EVERYONE recommend that would NOT work for their specific business? Why not?

## 4. THE EDGE (1-2 paragraphs)
The specific Virtual Employee to install. Name it (e.g., "The Virtual Proposal Writer"). Describe how it would work. Name specific tools. Estimate time-to-install and expected outcome.

## 5. THE STALLED PROJECT (1 paragraph)
How does this Virtual Employee unblock the stalled project they mentioned?

## 6. CONVERSATION HOOK (2-3 sentences)
The ONE question Rovonn should ask in the email that would unlock the call.

Keep under 600 words. No em dashes. Don't draft the response. Give Rovonn the intel.`;

// ============================================
// Main handler
// ============================================

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();

    // Insert submission
    const { data: insertData, error: insertError } = await supabase
      .from("edge_submissions")
      .insert({
        business_description: body.business_description,
        time_eater: body.time_eater,
        stalled_project: body.stalled_project,
        ai_status: body.ai_status,
        business_url: body.business_url ?? null,
        first_name: body.first_name,
        email: body.email,
        source: body.source ?? "site_form",
        utm_source: body.utm_source ?? null,
        utm_medium: body.utm_medium ?? null,
        utm_campaign: body.utm_campaign ?? null,
      })
      .select()
      .single();

    if (insertError || !insertData) {
      console.error("Insert error:", insertError);
      return jsonResponse({ error: "Database insert failed" }, 500);
    }

    const submissionId = insertData.id;

    // 1. Send acknowledgment email
    const ackHtml = `
      <p>Hey ${body.first_name},</p>
      <p>I got your Edge request. I'll read up on your business and write back within 24 hours with the specific AI workflow I'd install first.</p>
      <p>In the meantime, here's <strong>The ADAPT Playbook</strong>. It's a 25-page read covering the framework, the five outcomes, and ten Virtual Employees you can install. The one I'm probably going to recommend for you is in there.</p>
      <p><a href="${PLAYBOOK_PDF_URL}">Open the Playbook</a></p>
      <p>Talk soon,<br>Rovonn</p>
      <p style="color:#666;font-size:13px">P.S. If you want to skip the email and book a 20-minute call now, you can grab a time directly: <a href="${BOOKING_URL}">${BOOKING_URL}</a></p>
    `;
    await sendEmail({
      to: body.email,
      from: "Rovonn Russell <rovonn@rovonnrussell.com>",
      subject: "Got it. Your Edge arrives within 24 hours.",
      html: ackHtml,
      replyTo: ROVONN_EMAIL,
    });
    await supabase.from("edge_submissions")
      .update({ acknowledgment_sent_at: new Date().toISOString() })
      .eq("id", submissionId);

    // 2. Scrape business URL
    const scrapedContent = body.business_url ? await scrapeBusinessUrl(body.business_url) : "";

    // 3. Generate briefing via Claude
    const userPrompt = `FOUNDER FORM SUBMISSION:
- Business: ${body.business_description}
- Time eater: ${body.time_eater}
- Stalled project: ${body.stalled_project}
- AI status: ${body.ai_status}
- Website: ${body.business_url ?? "not provided"}
- Name: ${body.first_name}

SCRAPED CONTENT:
${scrapedContent || "(no scraped content available)"}

Generate The Edge briefing now.`;

    const briefingMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      system: BRIEFING_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const briefingText = briefingMsg.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // 4. Email briefing to Rovonn
    const briefingHtml = `
      <p>New Edge request from <strong>${body.first_name}</strong>.</p>
      <p>
        <strong>Business:</strong> ${body.business_description}<br>
        <strong>Time eater:</strong> ${body.time_eater}<br>
        <strong>Stalled project:</strong> ${body.stalled_project}<br>
        <strong>AI status:</strong> ${body.ai_status}<br>
        <strong>Website:</strong> ${body.business_url ?? "Not provided"}<br>
        <strong>Reply to:</strong> <a href="mailto:${body.email}">${body.email}</a>
      </p>
      <hr>
      <h3>THE EDGE BRIEFING</h3>
      <pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px">${briefingText.replace(/</g, "&lt;")}</pre>
      <hr>
      <p>
        <a href="mailto:${body.email}?subject=${encodeURIComponent("Your Edge: " + body.business_description.slice(0, 30))}">Reply directly to ${body.first_name}</a>
      </p>
    `;
    await sendEmail({
      to: ROVONN_EMAIL,
      from: "The Edge <theedge@rovonnrussell.com>",
      subject: `[The Edge] ${body.first_name} | ${body.business_description.slice(0, 50)} | ${body.ai_status}`,
      html: briefingHtml,
    });
    await supabase.from("edge_submissions")
      .update({
        briefing_generated_at: new Date().toISOString(),
        briefing_content: briefingText,
      })
      .eq("id", submissionId);

    return jsonResponse({ success: true, id: submissionId });
  } catch (err) {
    console.error("Handler error:", err);
    return jsonResponse({ error: String(err) }, 500);
  }
});

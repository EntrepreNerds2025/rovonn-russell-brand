// Supabase Edge Function: cancel-booking
// Cancels a booking via the cancel_token.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ROVONN_EMAIL = Deno.env.get("ROVONN_EMAIL") ?? "rovonn@rovonnrussell.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sendEmail(to: string, subject: string, html: string, from = "Rovonn Russell <rovonn@rovonnrussell.com>") {
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const body = await req.json();
    const cancelToken = body.cancel_token as string;
    const reason = (body.reason as string) || null;

    if (!cancelToken) {
      return new Response(JSON.stringify({ error: "cancel_token required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: lead, error: fetchError } = await supabase
      .from("booking_leads")
      .select("*")
      .eq("cancel_token", cancelToken)
      .maybeSingle();

    if (fetchError || !lead) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (lead.status === "cancelled") {
      return new Response(JSON.stringify({ success: true, already_cancelled: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateError } = await supabase
      .from("booking_leads")
      .update({ status: "cancelled", cancel_reason: reason })
      .eq("id", lead.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Could not cancel" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Confirmation emails
    await sendEmail(
      lead.email,
      "Your booking is cancelled.",
      `<p>Hey ${lead.full_name},</p><p>Your booking has been cancelled. If you want to rebook a different time, the link is below.</p><p><a href="https://rovonnrussell.com/book">Book another time</a></p><p>- Rovonn</p>`,
    );

    await sendEmail(
      ROVONN_EMAIL,
      `[Cancellation] ${lead.full_name} | ${lead.call_type}`,
      `<p>${lead.full_name} cancelled their ${lead.call_type} booking.</p><p><strong>Reason:</strong> ${reason || "Not provided"}</p>`,
      "Bookings <bookings@rovonnrussell.com>",
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cancel-booking error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

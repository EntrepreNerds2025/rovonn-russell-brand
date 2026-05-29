// Supabase Edge Function: create-booking
// Confirms the selected slot for a previously-created booking lead.
// Sends a confirmation email + (optionally) creates a Google Calendar event.
//
// Env vars:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   ROVONN_EMAIL
//   MEETING_LINK_BASE  (e.g., "https://meet.google.com/" or your room URL)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ROVONN_EMAIL = Deno.env.get("ROVONN_EMAIL") ?? "rovonn@rovonnrussell.com";
const MEETING_LINK_BASE = Deno.env.get("MEETING_LINK_BASE") ?? "https://meet.google.com/your-room";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CALL_TYPE_LABELS: Record<string, string> = {
  "edge-followup": "The Edge Follow-up Call",
  "advisory-discovery": "Advisory Discovery Call",
  "speaking-inquiry": "Speaking Inquiry Call",
  "adapt-sprint-intro": "ADAPT Strategy Sprint Intro",
};

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
  if (!res.ok) console.error("Resend error:", await res.text());
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const bookingLeadId = body.booking_lead_id as string;
    const selectedSlot = body.selected_slot as string;

    if (!bookingLeadId || !selectedSlot) {
      return new Response(JSON.stringify({ error: "booking_lead_id and selected_slot required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check the slot isn't already booked (race condition protection)
    const { data: existing } = await supabase
      .from("booking_leads")
      .select("id")
      .eq("status", "booked")
      .eq("scheduled_at", selectedSlot)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "That slot was just booked. Please pick another." }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate a meeting link. For real Google Meet integration, swap this for the
    // Google Calendar API call that creates an event with conferenceData.createRequest.
    const meetingLink = MEETING_LINK_BASE;

    // Update the lead to "booked"
    const { data: booking, error: updateError } = await supabase
      .from("booking_leads")
      .update({
        scheduled_at: selectedSlot,
        status: "booked",
        meeting_link: meetingLink,
      })
      .eq("id", bookingLeadId)
      .select()
      .single();

    if (updateError || !booking) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: "Could not save booking" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callLabel = CALL_TYPE_LABELS[booking.call_type] || "Call";
    const formattedTime = formatDateTime(booking.scheduled_at);

    // Confirmation email to the founder
    const founderHtml = `
      <p>Hey ${booking.full_name},</p>
      <p>Your <strong>${callLabel}</strong> is on the calendar.</p>
      <p><strong>When:</strong> ${formattedTime}<br>
      <strong>Meeting link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
      <p>I'll read your intake before we get on. Reply to this email if anything else comes up that I should know.</p>
      <p>Talk soon,<br>Rovonn</p>
      <p style="color:#666;font-size:13px">Need to cancel or reschedule? <a href="https://rovonnrussell.com/cancel-booking?token=${booking.cancel_token}">Manage your booking</a></p>
    `;

    await sendEmail({
      to: booking.email,
      from: "Rovonn Russell <rovonn@rovonnrussell.com>",
      subject: `Booked: ${callLabel} on ${formattedTime}`,
      html: founderHtml,
      replyTo: ROVONN_EMAIL,
    });

    // Notification to Rovonn
    const notifyHtml = `
      <p>New booking.</p>
      <p>
        <strong>${booking.full_name}</strong> from <strong>${booking.business_name}</strong><br>
        <strong>Call:</strong> ${callLabel}<br>
        <strong>When:</strong> ${formattedTime}<br>
        <strong>Email:</strong> ${booking.email}<br>
        <strong>Website:</strong> ${booking.business_website || "-"}<br>
        <strong>Size:</strong> ${booking.business_size || "-"}<br>
        <strong>Reason:</strong> ${booking.challenge_type}<br>
        <strong>Context:</strong> ${booking.pre_call_answers?.project_context || "-"}<br>
        <strong>Source:</strong> ${booking.referral_source || "-"}
      </p>
    `;

    await sendEmail({
      to: ROVONN_EMAIL,
      from: "Bookings <bookings@rovonnrussell.com>",
      subject: `[Booking] ${booking.full_name} | ${callLabel} | ${formattedTime}`,
      html: notifyHtml,
    });

    return new Response(JSON.stringify({
      booking: {
        ...booking,
        call_type_label: callLabel,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-booking error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

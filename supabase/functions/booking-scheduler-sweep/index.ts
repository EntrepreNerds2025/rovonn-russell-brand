// Supabase Edge Function: booking-scheduler-sweep
// Runs on a cron schedule (every 15-30 min recommended).
//
// Jobs performed each run:
// 1. Send 24-hour reminder emails to upcoming bookings (status='booked', scheduled in ~24hr)
// 2. Send Rovonn a pre-call brief 60 min before each call (intake details, history)
// 3. Mark past bookings as 'completed' if status is still 'booked' and time has passed
//
// Env vars:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   ROVONN_EMAIL
//
// To deploy + schedule:
//   supabase functions deploy booking-scheduler-sweep --no-verify-jwt
//   Then either:
//     a) Use pg_cron to call this every 15-30 minutes, or
//     b) Use an external scheduler (GitHub Actions, cron-job.org, etc.) to POST to it
//   See DEPLOYMENT.md for the cron setup snippet.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ROVONN_EMAIL = Deno.env.get("ROVONN_EMAIL") ?? "rovonn@rovonnrussell.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping email");
    return;
  }
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
  }
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

// ============================================
// Job 1: 24-hour reminder emails
// ============================================
async function send24HourReminders() {
  const now = Date.now();
  const windowStart = new Date(now + 23 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now + 25 * 60 * 60 * 1000).toISOString();

  const { data: bookings, error } = await supabase
    .from("booking_leads")
    .select("*")
    .eq("status", "booked")
    .is("reminder_sent_at", null)
    .gte("scheduled_at", windowStart)
    .lte("scheduled_at", windowEnd);

  if (error) {
    console.error("send24HourReminders fetch error:", error);
    return { sent: 0 };
  }

  let sent = 0;
  for (const b of bookings || []) {
    const callLabel = CALL_TYPE_LABELS[b.call_type] || "Call";
    const html = `
      <p>Hey ${b.full_name},</p>
      <p>Quick reminder: your <strong>${callLabel}</strong> with me is tomorrow.</p>
      <p><strong>When:</strong> ${formatDateTime(b.scheduled_at)}<br>
      <strong>Meeting link:</strong> <a href="${b.meeting_link || "https://meet.google.com"}">${b.meeting_link || "(check confirmation email)"}</a></p>
      <p>If anything changed, reply here. If you need to reschedule, the link to manage your booking is at the bottom of the original confirmation email.</p>
      <p>Talk soon,<br>Rovonn</p>
      <p style="color:#666;font-size:13px">To cancel: <a href="https://rovonnrussell.com/cancel-booking?token=${b.cancel_token}">manage your booking</a></p>
    `;
    await sendEmail({
      to: b.email,
      from: "Rovonn Russell <rovonn@rovonnrussell.com>",
      subject: `Reminder: ${callLabel} tomorrow at ${formatDateTime(b.scheduled_at)}`,
      html,
      replyTo: ROVONN_EMAIL,
    });
    await supabase
      .from("booking_leads")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", b.id);
    sent += 1;
  }
  return { sent };
}

// ============================================
// Job 2: Pre-call brief to Rovonn (60 min before)
// ============================================
async function sendPreCallBriefs() {
  const now = Date.now();
  const windowStart = new Date(now + 45 * 60 * 1000).toISOString();
  const windowEnd = new Date(now + 75 * 60 * 1000).toISOString();

  const { data: bookings, error } = await supabase
    .from("booking_leads")
    .select("*")
    .eq("status", "booked")
    .is("brief_sent_at", null)
    .gte("scheduled_at", windowStart)
    .lte("scheduled_at", windowEnd);

  if (error) {
    console.error("sendPreCallBriefs fetch error:", error);
    return { sent: 0 };
  }

  let sent = 0;
  for (const b of bookings || []) {
    const callLabel = CALL_TYPE_LABELS[b.call_type] || "Call";
    const context = (b.pre_call_answers as { project_context?: string })?.project_context || "-";

    const html = `
      <p>Heads up: <strong>${b.full_name}</strong> from <strong>${b.business_name}</strong> in 60 min.</p>
      <p>
        <strong>Call:</strong> ${callLabel} (${b.call_duration_min} min)<br>
        <strong>When:</strong> ${formatDateTime(b.scheduled_at)}<br>
        <strong>Meeting:</strong> <a href="${b.meeting_link}">${b.meeting_link}</a><br>
        <strong>Their reason for booking:</strong> ${b.challenge_type}<br>
        <strong>Business website:</strong> ${b.business_website || "-"}<br>
        <strong>Business size:</strong> ${b.business_size || "-"}<br>
        <strong>Their context:</strong><br>
        ${context.replace(/\n/g, "<br>")}
      </p>
      <p style="color:#666;font-size:13px">Reply to founder: <a href="mailto:${b.email}">${b.email}</a></p>
    `;

    await sendEmail({
      to: ROVONN_EMAIL,
      from: "Bookings <bookings@rovonnrussell.com>",
      subject: `[Brief] ${b.full_name} | ${callLabel} | in 60 min`,
      html,
    });

    await supabase
      .from("booking_leads")
      .update({ brief_sent_at: new Date().toISOString() })
      .eq("id", b.id);
    sent += 1;
  }
  return { sent };
}

// ============================================
// Job 3: Mark past bookings as completed
// ============================================
async function markPastBookingsComplete() {
  const now = new Date().toISOString();

  const { data: bookings, error } = await supabase
    .from("booking_leads")
    .select("id, scheduled_at, call_duration_min")
    .eq("status", "booked")
    .lt("scheduled_at", now);

  if (error) {
    console.error("markPastBookingsComplete fetch error:", error);
    return { marked: 0 };
  }

  let marked = 0;
  for (const b of bookings || []) {
    const callEndMs = new Date(b.scheduled_at).getTime() + (b.call_duration_min || 30) * 60_000;
    if (callEndMs >= Date.now()) continue;

    await supabase
      .from("booking_leads")
      .update({ status: "completed" })
      .eq("id", b.id);
    marked += 1;
  }
  return { marked };
}

// ============================================
// Handler
// ============================================
Deno.serve(async (_req) => {
  try {
    const [reminders, briefs, completed] = await Promise.all([
      send24HourReminders(),
      sendPreCallBriefs(),
      markPastBookingsComplete(),
    ]);

    const summary = {
      ok: true,
      ran_at: new Date().toISOString(),
      reminders_sent: reminders.sent,
      briefs_sent: briefs.sent,
      bookings_completed: completed.marked,
    };

    console.log("Sweep complete:", summary);

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sweep error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

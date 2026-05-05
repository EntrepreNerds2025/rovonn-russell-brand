# Impact Loop — Custom Booking + Pre-Call Diagnostic Funnel

**Built for:** Impact Loop (impactloop.ca)
**Role:** Architected and built end-to-end
**Stack:** Supabase, Deno Edge Functions, Google Calendar API, Vite + React + TypeScript, custom email templates, business-timezone-aware scheduling

---

## The problem

Most service businesses route discovery calls through Calendly. It works, but it's a thin layer. It books a meeting and that's it. There's no diagnostic before the call, no AI-generated brief, no client-readable framing of what to expect, no integration with the rest of the business's content and CRM systems. The call shows up on the calendar and the prep is on the human.

For Impact Loop, the discovery call is the most expensive part of the funnel. It's a 30-60 minute live conversation with the founder. If the prospect arrives unprepared and the founder arrives unbriefed, the call becomes a generic intro instead of a strategic conversation. That's a bad ROI on the most valuable time block in the business.

The fix wasn't a better calendar tool. The fix was a custom booking flow that: collected the diagnostic answers in advance, sent the prospect a clear pre-call email with what to expect, generated an internal AI brief for the founder with talking points specific to this prospect's challenges, and synced the lead into the CRM with the conversation context already populated.

That's the Impact Loop booking + pre-call system. Six edge functions plus a custom React booking UI on the live site.

## Architecture

**get-availability.** Fetches Google Calendar busy intervals for the booking calendar, filters to business hours in the configured business timezone, applies buffer rules (no calls in the first 30 minutes after another meeting), and returns available 30-minute slots over the next 14 days. Built on `_shared/google-calendar.ts` (a thin wrapper around the official Google Calendar API) and `_shared/booking.ts` (the slot/interval logic).

**create-booking.** The main booking endpoint:
1. Validates the requested slot is still available (re-checks calendar busy intervals at booking time, not just at the time of slot generation)
2. Creates a Google Calendar event on the booking calendar with both attendees, the call type, and the agenda preview
3. Writes a row to the bookings table with full client context
4. Fires sendBookingConfirmationEmail (custom HTML template, branded)
5. Fires sendBookingInternalNotification (Slack + email to the founder)
6. Calls syncBookingToCrm to push the lead into the impact-loop-blogs CRM with first-touch context already populated

The slot re-validation step is the part that prevents the classic Calendly race condition where two prospects book the same slot in quick succession. Re-checking the calendar at write time, not just at read time, catches it.

**reschedule-booking and cancel-booking.** Both maintain the same calendar/CRM/email triplet — when a meeting moves, the calendar event updates, the booking row updates, the prospect gets a confirmation, and the CRM entry stays synced.

**submit-pre-call-answers.** The pre-call diagnostic form. The prospect answers structured questions about their challenge type, current state, deadline driving the conversation, decision-makers in the room, and budget context. Answers are written to pre_call_answers and trigger the next two functions.

**pre-call-brief.** Reads the diagnostic answers and generates a structured internal brief for the founder. The challenge_type field maps to a curated set of talking points — five challenge types covered (film/video for funder trust, content system not one-off, ESG/impact communication, internal storytelling capacity, default fallback) — each with three actionable talking points. Output goes to the founder's email 1 hour before the call.

**pre-call-email.** Sends the prospect a pre-call email confirming what to expect, the agenda, what to bring (if anything), and a soft reminder that the founder is preparing specifically for their conversation.

## What makes the architecture work

**Two-sided briefing.** Calendly briefs nobody. Impact Loop's flow briefs both sides. The prospect knows what to expect and arrives ready. The founder gets a one-page strategic brief with talking points specific to this prospect. The conversation starts at the level of strategy, not the level of intros.

**Custom timezone handling.** Most calendar tools handle timezones at the booking layer and then forget about them. Impact Loop's `_shared/time.ts` carries timezone context through every layer — slot generation, busy-interval comparison, booking write, calendar event creation, email rendering. The business runs on America/Toronto; the prospect could be anywhere. The math is consistent.

**Slot re-validation at write time.** The Calendly race condition (two people book the same slot within seconds) is mitigated by re-checking calendar busy intervals at the moment of writing the booking, not just at the moment the slot was offered. Costs a Google API call per booking; saves the embarrassment of double-booking.

**Challenge-type talking points are curated, not generated.** The pre-call brief uses an LLM to personalize the framing, but the actual talking points are a curated dictionary keyed by challenge_type. This is a deliberate choice — talking points for nonprofit film work shouldn't be reinvented every time. The LLM adds context; the strategy is structured.

**CRM integration on every action.** Booking, rescheduling, and cancelling all sync to the CRM. No "the meeting happened but I forgot to log it" gaps.

## Result

A discovery call funnel that turns the most expensive part of the sales process into the highest-leverage. Prospects show up better prepared. The founder shows up better briefed. The call gets to strategy faster. The CRM stays accurate without manual logging.

The system replaced Calendly + Notion + a manual brief workflow with a single integrated flow. The annual cost of the Calendly + Notion subscriptions covered the build cost.

## What this proves

End-to-end product thinking, not just function-level thinking. Real integration with Google Calendar (busy intervals, event creation, attendee management), custom email rendering, multi-system sync (Calendar / Database / Email / Slack / CRM). Awareness of edge cases that boilerplate calendar tools don't handle (race conditions, timezone consistency). Pattern is portable to any service business where the discovery call is the bottleneck.

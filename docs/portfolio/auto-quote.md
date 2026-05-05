# Auto-Quote from Google Meet Transcript

**Built for:** EntrepreNerds Agency (entre-nerd-dash)
**Role:** Architected and built end-to-end
**Stack:** Supabase, Deno Edge Functions, Google Drive API, Lovable AI gateway, Anthropic Claude

---

## The problem

The longest delay between a sales call and a closed deal is almost always the proposal. The conversation is fresh, the client is leaning in, and then the salesperson goes back to their desk and spends two hours writing up a quote based on what they remember from the meeting. By the time the proposal arrives, the urgency has cooled.

Most agencies solve this with templates. Templates are fine for repeat work and miserable for custom builds. The right scope, the right pricing, and the right deliverables for *this* client live in the conversation that just happened — not in a template library.

The fix wasn't a faster proposal writer. The fix was a pipeline that takes the meeting transcript itself and produces a structured quote, draft contract, and SOW within minutes — so the salesperson reviews and ships rather than starts from scratch.

That pipeline is auto-quote-from-transcript and its sibling functions (generate-quote-from-transcript, generate-invoice-from-transcript, generate-production-plan-from-text, generate-sow-ai, generate-contract-ai).

## Architecture

**fetch-google-meet-transcript.** Reads a Google Drive file URL (the transcript Google Meet auto-saves), extracts the file ID across all valid URL formats, calls Google Drive via Lovable's connector gateway. Returns clean transcript text plus speaker attribution where available. Handles the auth flow without storing user credentials directly.

**auto-quote-from-transcript.** Takes the transcript plus meeting metadata (attendees, summary, eventId from the calendar). First check: idempotency. If `google_calendar_events.quote_generated = true` for this eventId, returns the existing quote ID instead of generating a new one. This is the architectural call that prevents accidental duplicate quotes when the function is retried.

If no quote exists, calls Lovable AI (Claude under the hood) with a structured extraction prompt that pulls:
- Project scope (broken into deliverables)
- Pricing context discussed (hourly, fixed, retainer)
- Timeline mentioned
- Client constraints (budget caps, deadlines, decision-makers)
- Trigger phrases ("we'd want to start in Q2", "max budget is $25K")

Output is structured JSON, parsed and written into the quotes table with status="draft" and source="auto_from_transcript". Updates `google_calendar_events.quote_generated = true` and `google_calendar_events.generated_quote_id = <new_quote_id>` so the link is queryable from both sides.

**generate-quote-from-transcript.** Variant for when the transcript exists outside a calendar event (uploaded manually, sent by client). Same extraction logic without the calendar-event idempotency check.

**generate-invoice-from-transcript.** Same pattern, different output. Useful for service work where the work is already done and the conversation was the post-work check-in: invoice line items get extracted from the discussed deliverables.

**generate-sow-ai.** Takes the structured quote and produces a long-form SOW (Statement of Work) with milestones, deliverables, acceptance criteria, and exclusions.

**generate-contract-ai.** Drafts a contract clause set based on the SOW: payment terms, IP assignment, change orders, termination conditions. The output is a starting point — not legal advice — flagged clearly for human legal review.

**generate-signed-contract-pdf and generate-signed-sow-pdf.** Render the final approved versions as branded PDFs ready for signature.

**process-meeting-transcripts.** Background job runner that watches `google_calendar_events` for new transcript URLs, fires fetch-google-meet-transcript, then routes to auto-quote-from-transcript or generate-invoice-from-transcript based on the meeting tag. Runs every 15 minutes via pg_cron.

## What makes the architecture work

**Idempotency at the edge.** Auto-quote checks `quote_generated` before calling the LLM. The function is safe to retry — repeated invocations with the same eventId will return the same quote ID, never duplicate it. This is the kind of detail that sounds boring and saves you from a $400 surprise on your API bill the day a webhook misfires.

**Structured extraction, not free-text generation.** The LLM doesn't write the quote. The LLM extracts structured fields. The quote itself is built from the extracted fields by deterministic code. This means the output schema is stable regardless of how the model phrased its response, and downstream PDF rendering / database writes never depend on prompt-fragile text.

**Linked back to the calendar event.** `generated_quote_id` lives on the calendar event row. The salesperson can open the meeting and see the quote was already drafted. The quote can be opened and link back to the meeting. Bidirectional traceability without extra queries.

**Background processing, not real-time.** The transcript usually isn't ready for 5-10 minutes after the meeting ends. process-meeting-transcripts polls every 15 minutes, so quotes appear in draft within 15-25 minutes of the call ending — usually before the salesperson has finished decompressing.

**Human review before send.** Every quote, SOW, and contract drops in as a draft. Nothing is auto-sent. The salesperson reviews, edits, and approves. The pipeline saves the prep time, not the judgment.

## Result

A meeting-to-quote turnaround that goes from 2 hours of post-call writing to 3 minutes of review. Quotes are scoped to what was actually discussed, not what's in the template library. The bottleneck moves from "writing the quote" to "deciding whether to send it" — which is the bottleneck that actually matters.

The pattern (idempotency at the edge, structured extraction, deterministic rendering, calendar-event linking, draft-then-review) applies to any conversation-to-document workflow: discovery calls to project briefs, client check-ins to status reports, sales calls to proposals.

## What this proves

End-to-end pipeline thinking, not single-function thinking. Production-grade idempotency and traceability. Real integration with Google Drive, Google Meet, Anthropic Claude, and Supabase background jobs. Cost-aware design (background processing, not real-time). Pattern is portable to any service business that closes deals through conversations.

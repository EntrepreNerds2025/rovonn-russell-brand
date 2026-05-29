# Portfolio Case Studies

Six one-page case studies grounded in real production code. Each one is verifiable in the codebase. Anonymized where named clients are involved.

## Index

1. **[James - Cold Email Engine with Deliverability Sentinel](./james.md)** - 11-function agent ecosystem covering ICP scoring, lead finding, warmup building, autopilot, and inbox-health monitoring. Built for EntrepreNerds.

2. **[Yaaba - Daily Operations Agent for SMB Sales](./yaaba.md)** - 12-function agent that runs morning briefs, radar scans, prospect research, spec generation, and HITL routing for $10K+ deal pipelines.

3. **[Truesight - Multi-Lane Research Pipeline](./truesight.md)** - Trigger-driven research engine with two cost lanes (Opus for high-stakes, Sonnet for cron), structured report schemas, cooldown windows, and 5 distinct report types.

4. **[Auto-Quote from Google Meet Transcript](./auto-quote.md)** - Meeting-to-money pipeline that ingests a Google Drive transcript, extracts scope and pricing, and writes a structured quote into the CRM.

5. **[Impact Loop - Custom Booking + Pre-Call Diagnostic Funnel](./impact-loop-booking.md)** - Replaced Calendly with a custom-built booking system, pre-call diagnostic, and AI-generated brief delivered before every call.

6. **[Multi-Tenant SaaS Architecture for an Agency CRM](./multi-tenant.md)** - Provisioning, role-scoped access, tenant-aware edge functions, and Stripe Connect for the EntrepreNerds dashboard.

## How to use these

Each case study is self-contained. The architecture is real. The metrics are anonymized where they touch live business data, real where they're logged in code or in our own ops.

These are written to be portfolio pieces - Upwork, the personal brand site at /portfolio, LinkedIn link previews, and direct DMs. The voice is operator-to-operator, not marketing copy. Specifics over hype.

For Upwork specifically, upload the one-pager as a PDF or screenshot. For rovonnrussell.com/portfolio, render each as a card with the title, subtitle, and "Read the full case study" link.

## What's NOT in here

Live production metrics that depend on querying Supabase directly. Once you grab dashboard screenshots or log exports, the metrics blocks in each case study can be filled in with real numbers.

Client names. All client-facing references are anonymized to category descriptors ("a Toronto-based community health nonprofit," "a multi-location home services brand"). When you have permission to name a client, replace the placeholder.

## Authorship note

Rovonn architected and built every system documented here. Where Lovable AI assisted in the coding, the architectural decisions, the prompts, the multi-agent orchestration, the lane structure, the trigger logic, and the production guardrails are all original work.

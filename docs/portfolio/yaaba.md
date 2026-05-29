# Yaaba — Daily Operations Agent for SMB Sales

**Built for:** EntrepreNerds Agency (entre-nerd-dash)
**Role:** Architected and built end-to-end
**Stack:** Supabase, Deno Edge Functions, Anthropic Claude (Opus and Sonnet lanes), Slack, pg_cron, Pro Routine slot architecture

---

## The problem

Running an agency means starting every morning by reconstructing what happened overnight. New leads arrived. Replies came in. Deals shifted. Approvals piled up. Most days you spend the first hour just figuring out what to focus on, and the focus rarely sticks because the next interruption is already coming in.

The fix wasn't a better dashboard. Dashboards are passive. The fix was an agent that read the state of the business every morning and produced a structured brief — what's new, what needs a decision, where to point the deep-work block — before the day even started.

That agent is Yaaba. Twelve coordinated edge functions running on a fixed slot schedule, each owning one job in the daily operations rhythm.

## Architecture

**The Pro Routine slot system.** Anthropic's API rewards predictable usage patterns. Yaaba is built around 5 fixed daily slots on Claude Opus, each tied to a specific routine: morning brief at 7am ET, radar scan at noon, evening closeout at 6pm, prospect research at 3pm Tuesdays, weekly business review on Fridays. The slot architecture (in _shared/pro-routine.ts) handles model selection, max_tokens budgets, prompt construction, agent_feed logging, and downstream routing.

**yaaba-morning-brief.** Reads agent_feed since the last brief, action_queue for pending approvals, and the top-3 leads by ICP score. Produces a structured brief: what landed overnight, what needs a decision today, top leads with next action, and one recommended focus for the first deep-work block. Runs at 7am ET on Opus, 3000 tokens.

**yaaba-radar.** Fires every day at noon ET. Scans for new leads in the last 6 hours, ICP score jumps above 8 (the score-jump trigger that fires Truesight inline), and stale leads sitting more than 14 days without activity. Produces alerts that route through yaaba-router for HITL approval.

**yaaba-router.** The HITL (human-in-the-loop) router. Every advisor output that needs human attention flows through here. Validates structured decision-asks (decision_ask MUST contain exactly 3 options with pros/cons plus a recommendation and reasoning). Writes an agent_feed row for audit. If a human decision is needed, creates an action_queue row. If notify_slack flag is set, fires slack-send. Decision-ask validation enforces good practice — no ambiguous "what should I do?" prompts allowed.

**yaaba-prospect.** Perplexity-driven research using a 100-point weighted scoring model:
- Budget capacity: 25 pts (employee band, multi-location, paid programs)
- Pain signals: 25 pts (fragmented stack, $2K-10K/mo on disconnected SaaS)
- Decision authority: 20 pts (founder, C-suite, head-of)
- Industry fit: 15 pts (healthcare, real estate, construction, consulting, etc.)
- Trigger events: 15 pts (recent funding, hiring, leadership changes)

Scores above 70 fire Truesight automatically. The scoring model is editable in the function — adjustments go live the next time the function runs.

**yaaba-spec-generator.** Uses Gemini to design the IDEAL company-intelligence report schema. Output is a structured JSON schema grouped by section (firmographics, tech_and_ops, pain_signals, decision_makers, trigger_events, brand_voice, personalization). Schema versions are stored in truesight_report_spec — every upgrade is reversible.

**yaaba-source-leads.** Inbound lead aggregation across Instantly, Smartlead, web forms, HubSpot imports, and Apify scrapers. Deduplicates against existing leads table. Writes new entries with status="new" for james-score-lead to pick up.

**yaaba-wbr.** Weekly business review on Fridays. Produces a structured retrospective: pipeline movement, agent action counts, deals won and lost, top wins, top blockers, recommendations for the next week.

**Plus:** yaaba-evening-closeout, yaaba-ingest-transcript, yaaba-proposal-nudge, yaaba-proposal-qa.

## What makes the architecture work

**Slot-based budgeting, not on-demand budgeting.** Every Opus call has a slot and a token budget. The system can't accidentally burn through API budget chasing edge cases — slots are pre-allocated, slots that don't run forfeit their budget, slots that overrun get cut.

**Decision-ask validation.** Every routed decision must have exactly 3 options with pros and cons plus an explicit recommendation. No "advise me" without structure. Forces the upstream advisor to do the thinking, not the human.

**Audit trail everywhere.** Every routine writes to agent_feed. Every decision writes to action_queue. Every override writes a corresponding row. Six months from now, "why did Yaaba flag this lead?" is a SELECT query, not a guess.

**Composable triggers.** Yaaba-radar can fire Truesight inline if a lead's ICP jumps to 9-10. Yaaba-prospect can fire Truesight on score-above-70. The same Truesight runner serves all callers. New triggers are added by inserting a row in truesight_triggers, not by editing function code.

## Result

A daily operations agent that reads the state of the business at fixed times, produces structured briefs and alerts, routes decisions through a validated HITL flow, and never asks an ambiguous question. The morning brief is the user's first read of the day. The evening closeout is the last. Decisions get made faster because the structure is already there.

## What this proves

Multi-agent orchestration with clean job boundaries. HITL design that respects human judgment without abdicating to it. Cost-tier discipline at the Opus level. Audit-trail-first architecture. Pattern is portable to any operations-heavy team that needs predictable daily AI work.

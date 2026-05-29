# James — Cold Email Engine with Deliverability Sentinel

**Built for:** EntrepreNerds Agency (entre-nerd-dash)
**Role:** Architected and built end-to-end
**Stack:** Supabase (Postgres + Edge Functions), Deno, Anthropic Claude, Brave Search API, Instantly, Telegram, pg_cron

---

## The problem

EntrepreNerds was running cold email outreach the way most small agencies do: a sequence in Instantly, manually-built lead lists, a deliverability fingers-crossed prayer every Monday morning, and no real signal on which replies needed attention. The math didn't work. Bounce rates would creep up unnoticed. Lists would go stale. Good leads would get buried in noise.

The fix wasn't a better email tool. The fix was an agent that handled the full lifecycle — finding leads, scoring them, generating warmup sequences, monitoring deliverability, and triaging replies — with humans only stepping in for high-stakes decisions.

That agent is James. Eleven coordinated edge functions running on Supabase, each owning one job in the cold-email pipeline.

## Architecture

**james-lead-finder.** Free-tier lead enrichment using Brave Search (2,000 queries/month free) plus homepage scraping. Takes a plain-English brief, finds candidate companies, extracts publicly-listed emails, drops results into a review queue. Lower-quality than Apollo but $0/month — graduate to paid only when volume justifies it. The architectural call here was to design for the cheapest plausible path first, not to pre-scale the budget.

**james-score-lead.** Claude-based ICP scorer that writes a 0–10 score plus a one-sentence justification (max 160 chars) directly to the leads table. The rubric is structured: 9–10 fires Truesight research immediately, 7–8 queues research for the next batch, below 7 stays in the CRM but doesn't trigger downstream work.

**james-warmup-builder.** Reads approved Truesight intelligence reports, drafts a 3-step warmup sequence (Day 0, Day 3, Day 7) referencing one specific signal from each company's report, and creates a single Instantly campaign with all qualified leads loaded. Voice rules are enforced in the system prompt: warm, partnership-oriented, never salesy, 80–130 words per email, CASL-compliant footer placeholder.

**james-deliverability.** Runs every 2 hours via pg_cron. Pulls Instantly analytics for every sending account. Hard thresholds: bounce_rate above 5% triggers a warning, above 10% auto-pauses the warmup. Spam complaints above 0.3% warn, above 0.5% pause. Daily limit usage above 90% triggers a domain rotation suggestion. Every snapshot logs to inbox_health_log. Telegram fires a plain-English health report on any state change.

**james-autopilot.** Every 10 minutes, scans recent inbox conversations and auto-actions high-confidence items: archives notifications above 0.65 confidence, drafts client replies above 0.90, queues lead follow-ups for Yaaba. Every action is reversible from a one-click undo button. Aggressive defaults but safe — nothing is permanently deleted.

**Plus:** james-draft-warmup, james-tts (text-to-speech briefs), james-standup (daily Slack summary), james-client-followup-brief, james-delete-conversation, james-worker (background job runner).

## What makes the architecture work

**Deterministic-first thresholds.** The deliverability sentinel doesn't ask the LLM "is this account healthy?" It runs the math (bounce rate, spam rate, daily limit usage) deterministically, then uses the LLM only to write the human-readable Telegram message. Fast, cheap, debuggable.

**Confidence-gated autopilot.** Autopilot only fires when the upstream classification confidence exceeds a threshold. Below that threshold, the conversation lands in the human-review queue. The thresholds are configurable per-tenant, so the system can be aggressive for low-stakes work and conservative for high-stakes.

**Reversibility everywhere.** Every action James takes is logged and reversible. Archives go to a recoverable bucket. Drafts are staged, never auto-sent. The autopilot never crosses an irreversible threshold without explicit human approval.

**Lane separation.** Lead scoring (cron, Sonnet) is separate from intelligence research (Opus, fired on score ≥ 9). Cheap reasoning runs cheap. Expensive reasoning only fires when the score earns it.

## Result

A cold email pipeline that runs without manual touch for the routine work and surfaces only the decisions that need human judgment. Bounce rates stay inside threshold automatically. Lead lists get scored and segmented in the same evening they arrive. Warmup sequences get drafted in 90 seconds, not 90 minutes. Replies get triaged before the morning email check.

The architectural pattern (deterministic thresholds, confidence-gated automation, reversible actions, cost-tier separation) is portable to any cold-email or outbound system. Same logic, different content.

## What this proves

Building production-grade agents that survive past the demo. Architecture decisions that prioritize cost-efficiency, observability, and human override. Real integration work across Supabase, Instantly, Telegram, Brave Search, and Anthropic Claude. Multi-step orchestration with clean job boundaries.

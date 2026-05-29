# Truesight - Multi-Lane Research Pipeline

**Built for:** EntrepreNerds Agency (entre-nerd-dash)
**Role:** Architected and built end-to-end
**Stack:** Supabase, Deno Edge Functions, Anthropic Claude (Opus and Sonnet lanes), Perplexity, Firecrawl, Brave Search, pg_cron, structured JSON schemas

---

## The problem

Most CRMs treat lead intelligence as a one-time enrichment: fetch firmographics, append, done. That's fine for cold outreach at the top of the funnel. It's not enough when you're trying to write a $10K+ proposal that lands.

Real research costs money. Perplexity calls cost dollars per query. Firecrawl scrapes cost credits. Claude Opus calls run high. If every lead in the CRM triggered a deep research pass, the API bill would eat the agency's margin.

The fix wasn't a cheaper research tool. The fix was a multi-lane pipeline that decides automatically which leads earn deep research and which get a fast, cheap pass - so the budget goes where it actually pays back.

That pipeline is Truesight. Twelve coordinated edge functions, two cost lanes, five report types, and a trigger system that fires research only when a lead's signal earns it.

## Architecture

**Two lanes, two budgets.**
```
pro_opus     -> claude-opus-4-6     -> 6,000 tokens, 15+ sources, 2,500-word reports
cron_sonnet  -> claude-sonnet-4-6   -> 1,800 tokens,  5+ sources,   800-word reports
```

Pro lane runs deep research for leads with ICP score 9â€“10 or matched-trigger reports. Cron lane handles the mid-tier (score 7â€“8) and routine refreshes. The lane assignment is automatic, set by the trigger that fired the research, not by the researcher.

**truesight-trigger.** Dispatcher that all upstream agents call. Looks up the trigger config (depth, priority, lane_hint, cooldown). Checks cooldown - if a report already exists for this subject within the trigger's cooldown window, returns the existing report instead of re-researching. Picks the lane based on lane_hint and today's Pro slot count. Inserts a truesight_reports row with trigger attribution. For on-demand triggers, fires truesight-runner immediately. For batch-preferred, leaves it for the Tuesday runner to pick up.

**truesight-runner.** Two execution modes:
- BATCH (Tuesday 3pm Pro Routine slot): pulls N reports from the queue with weighted budget - DEEP reports cost 2 weight units, STANDARD costs 1, BRIEF costs 0.5. Total batch budget is 5 weight units.
- ON-DEMAND (called by james-score-lead, edwina-inbox-sweep, yaaba-radar with a report_id): processes one row with the assigned lane.

The depth config is structured:
```ts
{
  deep:     { weight: 2.0, max_tokens: 6000, target_words: 2500, min_sources: 15 },
  standard: { weight: 1.0, max_tokens: 3500, target_words: 1500, min_sources: 8  },
  brief:    { weight: 0.5, max_tokens: 1800, target_words: 800,  min_sources: 5  },
}
```

**truesight-research.** The actual research engine. Runs Brave Search + Perplexity + Firecrawl in parallel where possible. Resolves auth context for tenant scoping. Loads the niche-specific template (every report type has its own template - niche reports look different from competitor reports). Returns parsed structured JSON, never free-text.

**Five report types:**
- nerds_creative_growth_report
- niche_report (industry-level intelligence)
- business_report (specific company)
- competitor_report
- prospecting_report

Each type has its own JSON schema and its own prompt template. The schema-first approach means downstream consumers (james-warmup-builder, the dashboard, exports to PDF) always know what they're getting.

**truesight-free-report.** A public-facing free-tier version exposed via the website. Visitors can request a basic intelligence report, which goes into truesight-queue-add and runs on cron_sonnet for cost-control. Doubles as a lead magnet - every free report request creates a lead in the CRM with first-touch context already populated.

**truesight-pdf.** Renders structured reports as branded PDFs for client delivery.

**truesight-market-map.** Aggregates competitor and niche reports into a market-level visualization.

**truesight-offer-builder.** Reads a niche report and proposes a productized service offer (scope, pricing tier, positioning) tailored to that niche's signals.

## What makes the architecture work

**Cooldown-driven cost control.** Re-researching the same company every week is waste. Truesight's trigger system enforces cooldowns per trigger type - icp_score_trigger has a 30-day cooldown, replied_to_outreach_trigger has 14 days, etc. The same lead can be researched twice if a different trigger fires, but never within the same cooldown window.

**Schema-first reports.** Every report type has a JSON schema in truesight_report_spec, versioned by tenant. Schema upgrades go live for new reports without breaking old ones. Downstream consumers parse the schema, not free text - no LLM-output-fragility cascading into the warmup builder or the PDF renderer.

**Lane separation by attribution.** The trigger that fired the research carries through to the report row. A report attributed to icp_jump_to_9 routes to Opus automatically. A report from a free public form routes to Sonnet automatically. No manual budget decisions per call.

**Trigger config in the database, not in code.** Adding a new trigger means inserting a row in truesight_triggers (name, cooldown, lane_hint, priority). No code change. New triggers can be tested in dry-run mode before going live.

## Result

A research pipeline that scales without scaling cost linearly. The leads that warrant deep research get it; the rest get a structured but cheap pass. The reports flow into the warmup builder, the PDF renderer, and the offer builder without re-prompting. Cooldowns prevent waste. Budget stays predictable.

The same pattern (lane separation by attribution, schema-first outputs, cooldown windows, trigger config in the database) applies to any expensive AI workload that needs to scale.

## What this proves

Production AI cost discipline. Schema-first multi-agent design. Trigger-driven autonomous research with built-in waste prevention. Real integration across Perplexity, Firecrawl, Brave Search, and Anthropic Claude. Pattern is portable to any agency or sales operation that needs to research at scale without burning the API budget.

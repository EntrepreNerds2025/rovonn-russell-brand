/**
 * Portfolio data layer.
 * Holds the structured data for all six Tier-1 portfolio case studies.
 * The pages at /portfolio and /portfolio/:slug render from this single source.
 *
 * These pages are HIDDEN - not in nav, not in sitemap, noindex meta tag.
 * Shareable via direct URL only (e.g. for Upwork portfolio links).
 */

export interface CaseStudyMetric {
  label: string;
  value: string;
  context?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  role: string;
  category: string;
  shortDescription: string;
  heroAccent: "amber" | "deep" | "charcoal";
  stack: string[];
  problem: string;
  metrics: CaseStudyMetric[];
  whatProves: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "james",
    title: "James",
    subtitle: "Cold email engine with deliverability sentinel",
    client: "EntrepreNerds Agency",
    role: "Architected and built end-to-end",
    category: "AI Agent Ecosystem",
    shortDescription:
      "Eleven coordinated edge functions covering ICP scoring, lead finding, warmup building, autopilot, and inbox-health monitoring.",
    heroAccent: "amber",
    stack: [
      "Supabase",
      "Deno Edge Functions",
      "Anthropic Claude",
      "Brave Search API",
      "Instantly",
      "Telegram",
      "pg_cron",
    ],
    problem:
      "EntrepreNerds was running cold email the way most small agencies do: a sequence in Instantly, manual lead lists, fingers-crossed deliverability, and no real signal on which replies needed attention. The fix wasn't a better email tool. The fix was an agent that handled the full lifecycle and only escalated decisions that needed human judgment.",
    metrics: [
      { label: "Coordinated functions", value: "11", context: "in the James cluster" },
      { label: "Auto-pause threshold", value: "10%", context: "bounce rate triggers warmup pause" },
      { label: "Deliverability check cadence", value: "2hrs", context: "via pg_cron" },
      { label: "Autopilot scan cadence", value: "10min", context: "every 10 minutes" },
    ],
    whatProves: [
      "Production-grade agent ecosystems with clean job boundaries",
      "Deterministic-first thresholds for cost and reliability",
      "Confidence-gated automation with reversible actions",
      "Real integration across Supabase, Instantly, Telegram, Brave Search, Claude",
    ],
  },
  {
    slug: "yaaba",
    title: "Yaaba",
    subtitle: "Daily operations agent for SMB sales",
    client: "EntrepreNerds Agency",
    role: "Architected and built end-to-end",
    category: "AI Agent Ecosystem",
    shortDescription:
      "Twelve coordinated edge functions running on a Pro Routine slot architecture: morning brief, radar scan, prospect research, weekly business review.",
    heroAccent: "deep",
    stack: [
      "Supabase",
      "Deno Edge Functions",
      "Claude Opus 4.6",
      "Claude Sonnet 4.6",
      "Slack",
      "Perplexity",
      "pg_cron",
    ],
    problem:
      "Running an agency means starting every morning by reconstructing what happened overnight. Most days the first hour is figuring out what to focus on, and focus rarely sticks. Dashboards are passive. The fix was an agent that read the state of the business at fixed times and produced structured briefs and decision-asks before the day even started.",
    metrics: [
      { label: "Coordinated functions", value: "12", context: "in the Yaaba cluster" },
      { label: "Daily Pro slots", value: "5", context: "fixed Opus runs per day" },
      { label: "Prospect scoring", value: "100pt", context: "weighted model" },
      { label: "Decision-ask options", value: "3", context: "exactly, validated at routing layer" },
    ],
    whatProves: [
      "Multi-agent orchestration with clean job boundaries",
      "HITL design that respects human judgment without abdicating to it",
      "Cost-tier discipline at the Opus level via slot architecture",
      "Audit-trail-first design with composable triggers",
    ],
  },
  {
    slug: "truesight",
    title: "Truesight",
    subtitle: "Multi-lane research pipeline",
    client: "EntrepreNerds Agency",
    role: "Architected and built end-to-end",
    category: "AI Research System",
    shortDescription:
      "Trigger-driven research engine with two cost lanes, structured report schemas, cooldown windows, and 5 distinct report types.",
    heroAccent: "amber",
    stack: [
      "Supabase",
      "Deno Edge Functions",
      "Claude Opus 4.6",
      "Claude Sonnet 4.6",
      "Perplexity",
      "Firecrawl",
      "Brave Search",
    ],
    problem:
      "Most CRMs treat lead intelligence as a one-time enrichment. Real research costs money. Perplexity calls cost dollars per query. Firecrawl scrapes cost credits. Claude Opus calls run high. If every lead triggered deep research, the API bill would eat the agency's margin. The fix was a multi-lane pipeline that decides automatically which leads earn deep research and which get a fast, cheap pass.",
    metrics: [
      { label: "Pro lane budget", value: "6K tokens", context: "Opus, 2,500-word reports, 15+ sources" },
      { label: "Cron lane budget", value: "1.8K tokens", context: "Sonnet, 800-word reports, 5+ sources" },
      { label: "Report types", value: "5", context: "niche, business, competitor, prospecting, growth" },
      { label: "Batch budget cap", value: "5 weight units", context: "per Tuesday Pro run" },
    ],
    whatProves: [
      "Production AI cost discipline with attribution-driven lane assignment",
      "Schema-first multi-agent design",
      "Trigger-driven autonomous research with cooldown-based waste prevention",
      "Real integration across Perplexity, Firecrawl, Brave, Claude",
    ],
  },
  {
    slug: "auto-quote",
    title: "Auto-Quote from Google Meet",
    subtitle: "Meeting-to-money pipeline",
    client: "EntrepreNerds Agency",
    role: "Architected and built end-to-end",
    category: "AI Workflow Automation",
    shortDescription:
      "Reads a Google Drive transcript, extracts scope and pricing, and writes a structured draft quote into the CRM within minutes of the call ending.",
    heroAccent: "deep",
    stack: [
      "Supabase",
      "Google Drive API",
      "Lovable AI Gateway",
      "Anthropic Claude",
      "pg_cron",
    ],
    problem:
      "The longest delay between a sales call and a closed deal is almost always the proposal. The conversation is fresh, the client is leaning in, and then the salesperson spends two hours writing up a quote based on what they remember. By the time the proposal arrives, the urgency has cooled. Most agencies solve this with templates. Templates are fine for repeat work and miserable for custom builds.",
    metrics: [
      { label: "Time to draft quote", value: "15-25min", context: "from meeting end to draft in CRM" },
      { label: "Time saved vs manual", value: "~2hrs", context: "per sales call" },
      { label: "Idempotency", value: "Edge-checked", context: "no duplicate quotes on retry" },
      { label: "Polling cadence", value: "15min", context: "process-meeting-transcripts via pg_cron" },
    ],
    whatProves: [
      "End-to-end pipeline thinking with idempotency at the edge",
      "Structured extraction over free-text generation",
      "Bidirectional traceability between calendar event and quote",
      "Cost-aware design (background processing, not real-time)",
    ],
  },
  {
    slug: "impact-loop-booking",
    title: "Impact Loop Booking System",
    subtitle: "Custom booking + pre-call diagnostic funnel",
    client: "Impact Loop",
    role: "Architected and built end-to-end",
    category: "Custom Booking Platform",
    shortDescription:
      "Replaced Calendly with a custom system that briefs both sides of every discovery call. Prospect arrives ready. Founder arrives prepared.",
    heroAccent: "charcoal",
    stack: [
      "Supabase",
      "Deno Edge Functions",
      "Google Calendar API",
      "Vite + React + TypeScript",
      "Custom email templates",
      "Business-timezone-aware scheduling",
    ],
    problem:
      "Calendly books a meeting and that's it. There's no diagnostic before the call, no AI brief for the founder, no integration with the rest of the business's CRM. For Impact Loop, the discovery call is the most expensive part of the funnel. If the prospect arrives unprepared and the founder arrives unbriefed, the call becomes a generic intro instead of a strategic conversation.",
    metrics: [
      { label: "Edge functions", value: "6", context: "booking + pre-call flow" },
      { label: "Pre-call brief lead time", value: "1hr", context: "before every call" },
      { label: "Race-condition risk", value: "Eliminated", context: "slot re-validation at write time" },
      { label: "Challenge types", value: "5", context: "with curated talking points" },
    ],
    whatProves: [
      "End-to-end product thinking with two-sided briefing",
      "Real Google Calendar integration with timezone consistency",
      "Multi-system sync (Calendar / Database / Email / Slack / CRM) on every action",
      "Awareness of edge cases that boilerplate calendar tools don't handle",
    ],
  },
  {
    slug: "multi-tenant",
    title: "Multi-Tenant Agency CRM",
    subtitle: "SaaS architecture with role-scoped access",
    client: "EntrepreNerds Agency",
    role: "Architected and built end-to-end",
    category: "Platform Architecture",
    shortDescription:
      "One code base, internal ops + external client portals + contractor access + multi-agency SaaS-ready, with tenant-aware everything from day one.",
    heroAccent: "deep",
    stack: [
      "Supabase Postgres",
      "Row-Level Security",
      "Stripe Connect",
      "Deno Edge Functions",
      "Custom tenant provisioning",
      "Role-scoped access control",
    ],
    problem:
      "Most agency CRMs are single-tenant. The agency uses one. If they want to give a client read access, the workaround is shared logins or screen-shares. Each of those breaks at the second client. The EntrepreNerds dashboard had to serve internal operations, client portals, contractor access, and eventually multi-agency SaaS distribution - all from the same code base.",
    metrics: [
      { label: "Provisioning time", value: "<30s", context: "new tenant, end-to-end" },
      { label: "Security layers", value: "2", context: "function-level + RLS at database" },
      { label: "Roles", value: "5", context: "owner, admin, advisor, contractor, client_portal" },
      { label: "Stripe integration", value: "Connect-first", context: "not retrofit" },
    ],
    whatProves: [
      "System-architecture thinking, not feature-level thinking",
      "Production multi-tenancy with RLS, role-scoping, feature flags",
      "Real Stripe Connect for cross-tenant payment routing",
      "Defense-in-depth security design built in from day one",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getAllCaseStudies(): CaseStudy[] {
  return CASE_STUDIES;
}

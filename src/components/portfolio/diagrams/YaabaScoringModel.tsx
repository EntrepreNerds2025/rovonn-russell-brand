/**
 * Yaaba - 100-point weighted prospect scoring model.
 */
const factors = [
  { label: "Budget capacity", points: 25, criteria: "employee band 10-250, multi-location, paid programs, org complexity" },
  { label: "Pain signals", points: 25, criteria: "fragmented stack, $2K-10K/mo on disconnected SaaS" },
  { label: "Decision authority", points: 20, criteria: "founder, C-suite, head-of, director-of" },
  { label: "Industry fit", points: 15, criteria: "healthcare, real estate, construction, consulting, education, nonprofits" },
  { label: "Trigger events", points: 15, criteria: "recent funding, hiring, leadership changes" },
];

export const YaabaScoringModel = () => (
  <div className="bg-foreground text-background rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-2">
      100-Point Weighted Scoring
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      How Yaaba decides which leads earn deep research.
    </h3>

    <div className="space-y-3">
      {factors.map((f) => (
        <div key={f.label} className="flex items-center gap-4">
          <div className="w-44 md:w-56 shrink-0">
            <p className="text-sm font-semibold">{f.label}</p>
            <p className="text-xs opacity-60 leading-tight mt-0.5">{f.criteria}</p>
          </div>
          <div className="flex-1 relative">
            <div className="h-8 rounded-md bg-background/10 overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${f.points}%` }}
              />
            </div>
          </div>
          <div className="w-16 shrink-0 text-right">
            <p className="text-2xl font-serif font-bold leading-none text-accent">{f.points}</p>
            <p className="text-xs opacity-60">pts</p>
          </div>
        </div>
      ))}
    </div>

    <div className="border-t border-background/15 mt-8 pt-6 grid md:grid-cols-3 gap-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-1">Score 70+</p>
        <p className="text-sm opacity-80">Fires Truesight Pro lane (Opus, deep report) automatically.</p>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-1">Score 50-69</p>
        <p className="text-sm opacity-80">Queued for cron lane (Sonnet, standard report).</p>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-1">Score under 50</p>
        <p className="text-sm opacity-80">Stays in CRM, no auto-research, manual review.</p>
      </div>
    </div>
  </div>
);

export default YaabaScoringModel;

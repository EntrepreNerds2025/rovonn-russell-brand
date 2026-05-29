/**
 * Yaaba — daily slot timeline.
 * Shows the 5 fixed Pro Routine slots through the day.
 */
const slots = [
  { time: "7:00 AM ET", name: "Morning Brief", body: "Reads agent_feed since last brief, action_queue, top-3 ICP leads. Writes structured brief.", tokens: "3,000" },
  { time: "12:00 PM ET", name: "Radar", body: "Scans new leads (last 6h), ICP score jumps ≥8, stale leads (14d+). Routes alerts.", tokens: "2,500" },
  { time: "3:00 PM ET", name: "Prospect (Tue)", body: "Perplexity-driven research using 100-pt weighted scoring model. Score 70+ fires Truesight.", tokens: "Variable" },
  { time: "6:00 PM ET", name: "Evening Closeout", body: "Day retro: what shipped, what's pending, top wins, top blockers, tomorrow's focus.", tokens: "2,500" },
  { time: "Friday PM", name: "Weekly Business Review", body: "Pipeline movement, agent action counts, deals won/lost, recommendations for next week.", tokens: "4,000" },
];

export const YaabaDailyTimeline = () => (
  <div className="bg-secondary border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      Pro Routine Slot Architecture
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      Five fixed Opus slots. Predictable budget. Audit-trail-first.
    </h3>

    <div className="relative">
      <div className="absolute left-3 md:left-4 top-2 bottom-2 w-px bg-accent-deep/30" />
      <div className="space-y-6">
        {slots.map((s, idx) => (
          <div key={s.name} className="relative pl-12 md:pl-14">
            <div className="absolute left-0 top-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold border-2 border-accent">
              {idx + 1}
            </div>
            <div className="bg-card border border-border rounded-md p-5">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent-deep">{s.time}</span>
                <h4 className="font-serif text-lg font-bold leading-none">{s.name}</h4>
                <span className="ml-auto text-xs text-muted-foreground">max_tokens: {s.tokens}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <p className="text-sm text-muted-foreground mt-8 leading-relaxed max-w-2xl">
      Slot budgets are pre-allocated. Slots that don't run forfeit their budget. Slots that overrun get cut. The system can't accidentally burn through API credits chasing edge cases.
    </p>
  </div>
);

export default YaabaDailyTimeline;

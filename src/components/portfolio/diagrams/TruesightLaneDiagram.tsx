/**
 * Truesight — two-lane budget visualization.
 * Shows the cost split between Opus (deep) and Sonnet (cron) lanes.
 */
export const TruesightLaneDiagram = () => (
  <div className="bg-secondary border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      Two-Lane Cost Architecture
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      Lane assignment is automatic. The trigger that fired the research carries through.
    </h3>

    <div className="grid md:grid-cols-2 gap-6">
      {/* PRO LANE */}
      <div className="bg-foreground text-background rounded-md p-6 border-2 border-accent">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent">Pro Lane</p>
          <span className="px-2 py-1 rounded bg-accent/20 text-accent text-xs font-bold">claude-opus-4-6</span>
        </div>
        <h4 className="text-2xl font-serif font-bold mb-4">Deep research</h4>

        <div className="space-y-2.5 mb-6">
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-70">max_tokens</span>
            <span className="font-bold">6,000</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-70">target_words</span>
            <span className="font-bold">2,500</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-70">min_sources</span>
            <span className="font-bold">15+</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-70">batch weight</span>
            <span className="font-bold">2.0 units</span>
          </div>
        </div>

        <div className="border-t border-background/15 pt-4">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-2">Fires when</p>
          <ul className="text-sm opacity-80 space-y-1.5">
            <li>• ICP score jumps to 9-10</li>
            <li>• Yaaba prospect score above 70</li>
            <li>• Manual high-stakes request</li>
          </ul>
        </div>
      </div>

      {/* CRON LANE */}
      <div className="bg-card border border-border rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep">Cron Lane</p>
          <span className="px-2 py-1 rounded bg-secondary text-foreground text-xs font-bold border border-border">claude-sonnet-4-6</span>
        </div>
        <h4 className="text-2xl font-serif font-bold mb-4">Standard / Brief</h4>

        <div className="space-y-2.5 mb-6">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">max_tokens</span>
            <span className="font-bold">1,800</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">target_words</span>
            <span className="font-bold">800</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">min_sources</span>
            <span className="font-bold">5+</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">batch weight</span>
            <span className="font-bold">0.5 units</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Fires when</p>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• ICP score 7-8 (queued)</li>
            <li>• Free public report request</li>
            <li>• Tuesday batch (5-unit budget)</li>
          </ul>
        </div>
      </div>
    </div>

    <p className="text-sm text-muted-foreground mt-6 leading-relaxed max-w-2xl">
      The lane that runs is decided by the trigger that fired, not by a per-call decision. A report attributed to icp_jump_to_9 routes to Opus automatically. A free public form routes to Sonnet automatically. No manual budget choices per call.
    </p>
  </div>
);

export default TruesightLaneDiagram;

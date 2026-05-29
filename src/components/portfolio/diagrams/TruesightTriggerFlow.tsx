/**
 * Truesight - trigger to lane to runner flow.
 */
export const TruesightTriggerFlow = () => (
  <div className="bg-card border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      Trigger Flow
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      How an upstream agent fires Truesight without burning budget.
    </h3>

    <svg viewBox="0 0 900 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Truesight trigger flow">
      <defs>
        <marker id="ts-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--accent-deep))" />
        </marker>
      </defs>

      {/* Step 1: caller */}
      <g>
        <rect x="20" y="40" width="170" height="70" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
        <text x="105" y="70" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(var(--foreground))">Upstream agent</text>
        <text x="105" y="90" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">james-score-lead</text>
        <text x="105" y="103" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">yaaba-radar / etc</text>
      </g>

      {/* Step 2: trigger */}
      <g>
        <rect x="240" y="40" width="180" height="70" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="330" y="70" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(var(--foreground))">truesight-trigger</text>
        <text x="330" y="90" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Looks up trigger config</text>
        <text x="330" y="103" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">depth, priority, lane_hint</text>
      </g>

      {/* Step 3: cooldown gate */}
      <g>
        <polygon points="475,75 540,40 605,75 540,110" fill="hsl(45 90% 60% / 0.2)" stroke="hsl(45 80% 45%)" strokeWidth="2"/>
        <text x="540" y="72" textAnchor="middle" fontSize="12" fontWeight="700" fill="hsl(var(--foreground))">Cooldown</text>
        <text x="540" y="88" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">recent report?</text>
      </g>

      {/* Existing report short-circuit */}
      <g>
        <rect x="650" y="40" width="180" height="70" rx="6" fill="hsl(180 30% 92%)" stroke="hsl(180 50% 45%)" strokeWidth="2"/>
        <text x="740" y="70" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(var(--foreground))">Return existing</text>
        <text x="740" y="90" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Yes to short-circuit</text>
        <text x="740" y="103" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">No API spend</text>
      </g>

      {/* Step 4: lane decision */}
      <g>
        <polygon points="475,205 540,170 605,205 540,240" fill="hsl(var(--accent) / 0.2)" stroke="hsl(var(--accent-deep))" strokeWidth="2"/>
        <text x="540" y="202" textAnchor="middle" fontSize="12" fontWeight="700" fill="hsl(var(--foreground))">Pick lane</text>
        <text x="540" y="218" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">slots available?</text>
      </g>

      {/* Step 5a: Pro lane */}
      <g>
        <rect x="650" y="170" width="200" height="70" rx="6" fill="hsl(var(--foreground))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="750" y="200" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(var(--background))">Pro lane (Opus)</text>
        <text x="750" y="220" textAnchor="middle" fontSize="11" fill="hsl(var(--background) / 0.8)">Fires runner immediately</text>
        <text x="750" y="233" textAnchor="middle" fontSize="11" fill="hsl(var(--background) / 0.8)">Deep report</text>
      </g>

      {/* Step 5b: Cron lane */}
      <g>
        <rect x="650" y="270" width="200" height="60" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))"/>
        <text x="750" y="295" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(var(--foreground))">Cron lane (Sonnet)</text>
        <text x="750" y="315" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Queued for Tuesday batch</text>
      </g>

      {/* Arrows */}
      <line x1="190" y1="75" x2="240" y2="75" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#ts-arrow)" />
      <line x1="420" y1="75" x2="475" y2="75" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#ts-arrow)" />
      <line x1="605" y1="75" x2="650" y2="75" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#ts-arrow)" />
      <text x="615" y="65" fontSize="10" fontWeight="600" fill="hsl(180 50% 35%)">YES</text>

      <line x1="540" y1="110" x2="540" y2="170" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#ts-arrow)" />
      <text x="552" y="143" fontSize="10" fontWeight="600" fill="hsl(var(--accent-deep))">NO (proceed)</text>

      <line x1="605" y1="200" x2="650" y2="200" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#ts-arrow)" />
      <text x="615" y="190" fontSize="10" fontWeight="600" fill="hsl(var(--accent-deep))">PRO</text>
      <line x1="585" y1="230" x2="650" y2="285" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#ts-arrow)" />
      <text x="600" y="270" fontSize="10" fontWeight="600" fill="hsl(var(--accent-deep))">CRON</text>
    </svg>

    <p className="text-sm text-muted-foreground mt-6 leading-relaxed max-w-2xl">
      Cooldown windows mean the same lead is never re-researched within the trigger's window. Lane assignment respects daily Pro slot budgets - if today's slots are full, Pro work falls back to cron lane automatically.
    </p>
  </div>
);

export default TruesightTriggerFlow;

/**
 * James - full system architecture diagram.
 * Shows all 11 functions, their groupings, and the data flow.
 */
export const JamesArchitecture = () => (
  <div className="bg-secondary border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      System Architecture
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      Eleven coordinated functions, four layers.
    </h3>

    <svg viewBox="0 0 900 560" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="James system architecture diagram">
      <defs>
        <marker id="james-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--accent-deep))" />
        </marker>
      </defs>

      {/* Layer 1 - Input */}
      <g>
        <text x="20" y="50" className="text-[12px] font-semibold uppercase tracking-widest" fill="hsl(var(--accent-deep))">Layer 1 Â· Discovery</text>
        <rect x="40" y="70" width="200" height="80" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="140" y="100" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--foreground))">james-lead-finder</text>
        <text x="140" y="120" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Brave Search + scraper</text>
        <text x="140" y="135" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Free tier: 2K queries/mo</text>
      </g>

      {/* Layer 2 - Scoring */}
      <g>
        <text x="20" y="200" className="text-[12px] font-semibold uppercase tracking-widest" fill="hsl(var(--accent-deep))">Layer 2 Â· Qualification</text>
        <rect x="40" y="220" width="200" height="80" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="140" y="250" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--foreground))">james-score-lead</text>
        <text x="140" y="270" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">ICP rubric 0-10</text>
        <text x="140" y="285" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Fires Truesight at 7+</text>
      </g>

      {/* Layer 3 - Research callout */}
      <g>
        <rect x="290" y="220" width="180" height="80" rx="6" fill="hsl(var(--accent) / 0.15)" stroke="hsl(var(--accent-deep))" strokeWidth="2" strokeDasharray="4,4"/>
        <text x="380" y="250" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(var(--accent-deep))">to Truesight</text>
        <text x="380" y="270" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Score â‰¥ 9: deep lane</text>
        <text x="380" y="285" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Score 7-8: queue lane</text>
      </g>

      {/* Layer 3 - Outreach */}
      <g>
        <text x="20" y="350" className="text-[12px] font-semibold uppercase tracking-widest" fill="hsl(var(--accent-deep))">Layer 3 Â· Outreach</text>
        <rect x="40" y="370" width="200" height="80" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="140" y="400" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--foreground))">james-warmup-builder</text>
        <text x="140" y="420" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">3-step Day 0/3/7</text>
        <text x="140" y="435" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Voice rules enforced</text>

        <rect x="270" y="370" width="180" height="80" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="360" y="400" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--foreground))">Instantly</text>
        <text x="360" y="420" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Campaign loaded</text>
        <text x="360" y="435" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Sequence runs</text>
      </g>

      {/* Layer 4 - Health */}
      <g>
        <text x="500" y="50" className="text-[12px] font-semibold uppercase tracking-widest" fill="hsl(var(--accent-deep))">Layer 4 Â· Health Sentinel</text>
        <rect x="500" y="70" width="200" height="80" rx="6" fill="hsl(var(--foreground))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="600" y="100" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--background))">james-deliverability</text>
        <text x="600" y="120" textAnchor="middle" fontSize="11" fill="hsl(var(--background) / 0.8)">Every 2 hours</text>
        <text x="600" y="135" textAnchor="middle" fontSize="11" fill="hsl(var(--background) / 0.8)">Auto-pauses unhealthy accounts</text>

        <rect x="500" y="170" width="200" height="60" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))"/>
        <text x="600" y="195" textAnchor="middle" fontSize="12" fontWeight="600" fill="hsl(var(--foreground))">Telegram alerts</text>
        <text x="600" y="215" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">Plain-English reports</text>
      </g>

      {/* Layer 4 - Autopilot */}
      <g>
        <text x="500" y="280" className="text-[12px] font-semibold uppercase tracking-widest" fill="hsl(var(--accent-deep))">Always-On Â· Autopilot</text>
        <rect x="500" y="300" width="200" height="80" rx="6" fill="hsl(var(--foreground))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="600" y="330" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--background))">james-autopilot</text>
        <text x="600" y="350" textAnchor="middle" fontSize="11" fill="hsl(var(--background) / 0.8)">Every 10 minutes</text>
        <text x="600" y="365" textAnchor="middle" fontSize="11" fill="hsl(var(--background) / 0.8)">Confidence-gated actions</text>
      </g>

      {/* Confidence gates */}
      <g>
        <rect x="730" y="290" width="150" height="50" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))"/>
        <text x="805" y="312" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">Archive â‰¥ 0.65</text>
        <text x="805" y="328" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">notification class</text>

        <rect x="730" y="350" width="150" height="50" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))"/>
        <text x="805" y="372" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">Draft â‰¥ 0.90</text>
        <text x="805" y="388" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">client reply</text>
      </g>

      {/* Helpers row */}
      <g>
        <text x="20" y="490" className="text-[12px] font-semibold uppercase tracking-widest" fill="hsl(var(--accent-deep))">Supporting</text>
        <rect x="40" y="510" width="120" height="35" rx="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
        <text x="100" y="532" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))">james-tts</text>

        <rect x="170" y="510" width="140" height="35" rx="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
        <text x="240" y="532" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))">james-standup</text>

        <rect x="320" y="510" width="180" height="35" rx="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
        <text x="410" y="532" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))">james-client-followup-brief</text>

        <rect x="510" y="510" width="160" height="35" rx="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
        <text x="590" y="532" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))">james-draft-warmup</text>

        <rect x="680" y="510" width="180" height="35" rx="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
        <text x="770" y="532" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))">james-worker (background)</text>
      </g>

      {/* Arrows */}
      <line x1="140" y1="150" x2="140" y2="220" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
      <line x1="240" y1="260" x2="290" y2="260" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
      <line x1="140" y1="300" x2="140" y2="370" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
      <line x1="240" y1="410" x2="270" y2="410" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
      <line x1="600" y1="150" x2="600" y2="170" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
      <line x1="700" y1="320" x2="730" y2="315" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
      <line x1="700" y1="340" x2="730" y2="375" stroke="hsl(var(--accent-deep))" strokeWidth="2" markerEnd="url(#james-arrow)" />
    </svg>

    <p className="text-sm text-muted-foreground mt-6 leading-relaxed max-w-2xl">
      Each function owns one job. Clean boundaries mean every step is debuggable, replaceable, and observable in isolation.
    </p>
  </div>
);

export default JamesArchitecture;

/**
 * James — deliverability threshold chart.
 * Visualizes the auto-warn / auto-pause thresholds as a horizontal axis.
 */
export const JamesDeliverabilityChart = () => (
  <div className="bg-card border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      Deterministic Thresholds
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      The math runs first. The LLM only writes the alert.
    </h3>

    <svg viewBox="0 0 800 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deliverability threshold chart">
      {/* Bounce rate */}
      <g>
        <text x="20" y="30" fontSize="13" fontWeight="700" fill="hsl(var(--foreground))">Bounce rate</text>
        <text x="20" y="48" fontSize="11" fill="hsl(var(--muted-foreground))">Threshold-driven auto-action</text>

        <rect x="20" y="70" width="540" height="40" rx="20" fill="hsl(var(--secondary))" />
        <rect x="20" y="70" width="270" height="40" rx="20" fill="hsl(180 60% 45%)" opacity="0.85" />
        <rect x="290" y="70" width="135" height="40" fill="hsl(45 90% 60%)" opacity="0.85" />
        <rect x="425" y="70" width="135" height="40" rx="0" fill="hsl(0 70% 55%)" opacity="0.85" />
        <rect x="425" y="70" width="135" height="40" rx="20" fill="hsl(0 70% 55%)" opacity="0" />

        <text x="155" y="135" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">Healthy</text>
        <text x="155" y="150" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">0% — 5%</text>

        <text x="357" y="135" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">WARN</text>
        <text x="357" y="150" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">5% — 10%</text>

        <text x="492" y="135" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">PAUSE</text>
        <text x="492" y="150" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{`>10%`}</text>

        <text x="595" y="98" fontSize="11" fontWeight="600" fill="hsl(var(--accent-deep))">Auto-pause</text>
        <text x="595" y="115" fontSize="10" fill="hsl(var(--muted-foreground))">+ Telegram alert</text>
      </g>

      {/* Spam rate */}
      <g>
        <text x="20" y="200" fontSize="13" fontWeight="700" fill="hsl(var(--foreground))">Spam complaint rate</text>
        <text x="20" y="218" fontSize="11" fill="hsl(var(--muted-foreground))">Tighter thresholds — spam complaints kill warmup faster</text>

        <rect x="20" y="240" width="540" height="40" rx="20" fill="hsl(var(--secondary))" />
        <rect x="20" y="240" width="324" height="40" rx="20" fill="hsl(180 60% 45%)" opacity="0.85" />
        <rect x="344" y="240" width="108" height="40" fill="hsl(45 90% 60%)" opacity="0.85" />
        <rect x="452" y="240" width="108" height="40" rx="0" fill="hsl(0 70% 55%)" opacity="0.85" />

        <text x="182" y="305" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">Healthy</text>
        <text x="182" y="320" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">0% — 0.3%</text>

        <text x="398" y="305" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">WARN</text>
        <text x="398" y="320" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">0.3% — 0.5%</text>

        <text x="506" y="305" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">PAUSE</text>
        <text x="506" y="320" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{`>0.5%`}</text>

        <text x="595" y="268" fontSize="11" fontWeight="600" fill="hsl(var(--accent-deep))">Auto-pause</text>
        <text x="595" y="285" fontSize="10" fill="hsl(var(--muted-foreground))">+ Telegram alert</text>
      </g>
    </svg>

    <p className="text-sm text-muted-foreground mt-6 leading-relaxed max-w-2xl">
      The deliverability sentinel doesn't ask the LLM "is this account healthy?" It runs the math (bounce rate, spam rate, daily limit usage) deterministically — then uses the LLM only to write the human-readable Telegram message. Fast, cheap, debuggable.
    </p>
  </div>
);

export default JamesDeliverabilityChart;

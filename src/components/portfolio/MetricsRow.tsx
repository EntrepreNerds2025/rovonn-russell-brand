import { CaseStudyMetric } from "@/lib/portfolio";

interface MetricsRowProps {
  metrics: CaseStudyMetric[];
}

export const MetricsRow = ({ metrics }: MetricsRowProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {metrics.map((m) => (
      <div
        key={m.label}
        className="bg-card border border-border rounded-md p-5"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">
          {m.label}
        </p>
        <p className="text-3xl md:text-4xl font-serif font-bold leading-none mb-2">
          {m.value}
        </p>
        {m.context && (
          <p className="text-xs text-muted-foreground leading-relaxed">{m.context}</p>
        )}
      </div>
    ))}
  </div>
);

export default MetricsRow;

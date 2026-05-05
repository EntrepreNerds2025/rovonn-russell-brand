/**
 * Auto-Quote — meeting-to-money pipeline flow.
 */
const steps = [
  { num: "01", title: "Meeting ends", body: "Google Meet auto-saves transcript to Drive.", time: "T+0min" },
  { num: "02", title: "Transcript polled", body: "process-meeting-transcripts checks every 15 min via pg_cron.", time: "T+15min" },
  { num: "03", title: "Idempotency check", body: "Has a quote already been generated for this eventId? If yes — return existing, no LLM call.", time: "T+15min" },
  { num: "04", title: "Structured extraction", body: "Claude extracts: scope, deliverables, pricing context, timeline, decision-makers, trigger phrases.", time: "T+18min" },
  { num: "05", title: "Quote built", body: "Deterministic code builds the quote from structured fields. Written to quotes table as draft.", time: "T+20min" },
  { num: "06", title: "Linked + ready", body: "Calendar event marks quote_generated=true with generated_quote_id. Bidirectional traceability.", time: "T+22min" },
  { num: "07", title: "Salesperson reviews", body: "Quote ready in CRM with status=draft. Edit, approve, send.", time: "T+25min" },
];

export const AutoQuoteFlow = () => (
  <div className="bg-secondary border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      Pipeline Flow
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
      From meeting end to draft quote in 25 minutes.
    </h3>
    <p className="text-sm text-muted-foreground mb-8">
      Compared to ~2 hours of manual post-call writing.
    </p>

    <div className="space-y-3">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex gap-4 md:gap-6">
          <div className="shrink-0 w-12 md:w-14">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-foreground text-background flex items-center justify-center font-serif font-bold text-sm border-2 border-accent">
              {s.num}
            </div>
            {idx < steps.length - 1 && (
              <div className="w-px h-8 bg-accent-deep/30 mx-auto mt-1" />
            )}
          </div>
          <div className="flex-1 bg-card border border-border rounded-md p-4 md:p-5">
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <h4 className="font-serif text-lg font-bold leading-none">{s.title}</h4>
              <span className="ml-auto text-xs font-bold tracking-[0.2em] uppercase text-accent-deep">{s.time}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 grid md:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-md p-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Manual baseline</p>
        <p className="text-3xl font-serif font-bold mb-1">~2hrs</p>
        <p className="text-sm text-muted-foreground">post-call writing per meeting</p>
      </div>
      <div className="bg-card border border-border rounded-md p-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">With auto-quote</p>
        <p className="text-3xl font-serif font-bold mb-1">~3min</p>
        <p className="text-sm text-muted-foreground">review + edit time per meeting</p>
      </div>
      <div className="bg-foreground text-background rounded-md p-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-2">Time recovered</p>
        <p className="text-3xl font-serif font-bold mb-1 text-accent">~95%</p>
        <p className="text-sm opacity-80">of post-call quote-prep time</p>
      </div>
    </div>
  </div>
);

export default AutoQuoteFlow;

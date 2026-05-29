import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { CaseStudy } from "@/lib/portfolio";
import MetricsRow from "./MetricsRow";

export const ProblemSection = ({ problem }: { problem: string }) => (
  <section className="section-padding py-12 md:py-16">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
        The Problem
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-6">
        Why this needed to be built.
      </h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl font-serif">
        {problem}
      </p>
    </div>
  </section>
);

export const MetricsSection = ({ study }: { study: CaseStudy }) => (
  <section className="section-padding py-12 md:py-16 bg-card">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
        At a Glance
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-8">
        The numbers in the architecture.
      </h2>
      <MetricsRow metrics={study.metrics} />
    </div>
  </section>
);

export const ArchitectureSection = ({ children }: { children: ReactNode }) => (
  <section className="section-padding py-12 md:py-16">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
        How It Works
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-8">
        Architecture diagrams from the actual build.
      </h2>
      {children}
    </div>
  </section>
);

export const ProvesSection = ({ items }: { items: string[] }) => (
  <section className="section-padding py-12 md:py-16 bg-foreground text-background">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-4">
        What This Proves
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-8">
        Skills demonstrated, beyond the case study.
      </h2>
      <ul className="space-y-4 max-w-3xl">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
            <span className="text-base md:text-lg leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export const ContactSection = () => (
  <section className="section-padding py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
        Want To Work Together
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-6">
        I assess before I quote.
      </h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
        First 30 minutes are free. Tell me what you're trying to build and what's getting in the way. I'll come back with a clear "yes, here's how" or "no, here's what you actually need instead."
      </p>
      <a
        href="mailto:hello@rovonnrussell.com?subject=Portfolio%20inquiry"
        className="inline-block bg-foreground text-background px-8 py-4 text-sm font-semibold tracking-[0.18em] uppercase hover:bg-accent-deep transition-colors rounded-sm"
      >
        Start the conversation
      </a>
    </div>
  </section>
);

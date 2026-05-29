import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CaseStudy } from "@/lib/portfolio";
import TechStackBadges from "./TechStackBadges";

const accentRing = (accent: CaseStudy["heroAccent"]) => {
  switch (accent) {
    case "amber":
      return "bg-gradient-to-br from-accent/15 via-transparent to-accent-deep/10";
    case "deep":
      return "bg-gradient-to-br from-accent-deep/15 via-transparent to-foreground/10";
    case "charcoal":
      return "bg-gradient-to-br from-foreground/10 via-transparent to-accent/10";
  }
};

export const CaseStudyHero = ({ study }: { study: CaseStudy }) => (
  <section className={`section-padding pt-32 md:pt-40 pb-12 md:pb-16 relative ${accentRing(study.heroAccent)}`}>
    <div className="max-w-5xl mx-auto">
      <Link
        to="/portfolio"
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep hover:underline mb-8"
      >
        <ArrowLeft size={12} /> All Case Studies
      </Link>

      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
        {study.category}
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.0] mb-6">
        {study.title}
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground font-serif italic leading-relaxed mb-10 max-w-3xl">
        {study.subtitle}
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-4xl">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-accent-deep mb-1.5">Client</p>
          <p className="text-base font-semibold leading-tight">{study.client}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-accent-deep mb-1.5">Role</p>
          <p className="text-base font-semibold leading-tight">{study.role}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-accent-deep mb-1.5">Category</p>
          <p className="text-base font-semibold leading-tight">{study.category}</p>
        </div>
      </div>

      <TechStackBadges stack={study.stack} />
    </div>
  </section>
);

export default CaseStudyHero;

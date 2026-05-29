import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { getAllCaseStudies, CaseStudy } from "@/lib/portfolio";
import TechStackBadges from "@/components/portfolio/TechStackBadges";

const accentClass = (accent: CaseStudy["heroAccent"]) => {
  switch (accent) {
    case "amber":
      return "from-accent/15 via-transparent to-accent-deep/10";
    case "deep":
      return "from-accent-deep/15 via-transparent to-foreground/10";
    case "charcoal":
      return "from-foreground/10 via-transparent to-accent/10";
  }
};

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Selected Work
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.0] mb-8">
        Production systems,{" "}
        <span className="italic text-accent-highlight">built end-to-end.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-serif italic">
        Six case studies from across Impact Loop, EntrepreNerds, and the personal brand. Each one grounded in real production code - not concepts.
      </p>
    </div>
  </section>
);

const CaseStudyCard = ({ study }: { study: CaseStudy }) => (
  <Link
    to={`/portfolio/${study.slug}`}
    className={`group relative block bg-card border border-border rounded-md overflow-hidden hover:border-accent transition-colors`}
    onClick={() => trackEvent("portfolio_card_click", { slug: study.slug })}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${accentClass(study.heroAccent)} opacity-50 group-hover:opacity-80 transition-opacity`} />
    <div className="relative p-6 md:p-8">
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent-deep mb-3">
        {study.category}
      </p>
      <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-3 group-hover:text-accent-deep transition-colors">
        {study.title}
      </h2>
      <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed mb-5 font-serif">
        {study.subtitle}
      </p>
      <p className="text-sm text-foreground leading-relaxed mb-6">
        {study.shortDescription}
      </p>
      <div className="mb-6">
        <TechStackBadges stack={study.stack.slice(0, 4)} />
      </div>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-accent-deep">
        Read the case study
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  </Link>
);

const Portfolio = () => {
  useEffect(() => {
    setSEO({
      title: "Portfolio | Rovonn Russell",
      description:
        "Selected production work from Impact Loop, EntrepreNerds, and the personal brand. AI agents, multi-tenant SaaS, custom booking platforms, and more.",
      path: "/portfolio",
      noindex: true,
    });
    trackEvent("portfolio_index_viewed");
    return resetSEO;
  }, []);

  const studies = getAllCaseStudies();

  return (
    <main>
      <HeroSection />
      <section className="section-padding pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {studies.map((s) => (
              <CaseStudyCard key={s.slug} study={s} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground italic font-serif max-w-2xl mx-auto">
              Each case study is grounded in code I've personally architected and shipped. Anonymized where named clients are involved. Live metrics available on request.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Portfolio;

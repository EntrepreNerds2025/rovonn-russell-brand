import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { getCaseStudy } from "@/lib/portfolio";
import CaseStudyHero from "@/components/portfolio/CaseStudyHero";
import {
  ProblemSection,
  MetricsSection,
  ArchitectureSection,
  ProvesSection,
  ContactSection,
} from "@/components/portfolio/CaseStudyShared";
import JamesArchitecture from "@/components/portfolio/diagrams/JamesArchitecture";
import JamesDeliverabilityChart from "@/components/portfolio/diagrams/JamesDeliverabilityChart";
import YaabaDailyTimeline from "@/components/portfolio/diagrams/YaabaDailyTimeline";
import YaabaScoringModel from "@/components/portfolio/diagrams/YaabaScoringModel";
import TruesightLaneDiagram from "@/components/portfolio/diagrams/TruesightLaneDiagram";
import TruesightTriggerFlow from "@/components/portfolio/diagrams/TruesightTriggerFlow";
import AutoQuoteFlow from "@/components/portfolio/diagrams/AutoQuoteFlow";
import BookingComparison from "@/components/portfolio/diagrams/BookingComparison";
import MultiTenantStack from "@/components/portfolio/diagrams/MultiTenantStack";
import NotFound from "./NotFound";

const diagramsBySlug: Record<string, React.ComponentType[]> = {
  james: [JamesArchitecture, JamesDeliverabilityChart],
  yaaba: [YaabaDailyTimeline, YaabaScoringModel],
  truesight: [TruesightLaneDiagram, TruesightTriggerFlow],
  "auto-quote": [AutoQuoteFlow],
  "impact-loop-booking": [BookingComparison],
  "multi-tenant": [MultiTenantStack],
};

const PortfolioCaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudy(slug) : undefined;

  useEffect(() => {
    if (!study) return;
    setSEO({
      title: `${study.title} - Case Study | Rovonn Russell`,
      description: study.shortDescription,
      path: `/portfolio/${study.slug}`,
      noindex: true,
      ogType: "article",
    });
    trackEvent("portfolio_case_study_viewed", { slug: study.slug });
    return resetSEO;
  }, [study]);

  if (!study) return <NotFound />;

  const diagrams = diagramsBySlug[study.slug] ?? [];

  return (
    <main>
      <CaseStudyHero study={study} />
      <ProblemSection problem={study.problem} />
      <MetricsSection study={study} />
      <ArchitectureSection>
        {diagrams.map((Diagram, i) => (
          <Diagram key={i} />
        ))}
      </ArchitectureSection>
      <ProvesSection items={study.whatProves} />
      <ContactSection />
    </main>
  );
};

export default PortfolioCaseStudy;

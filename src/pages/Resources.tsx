import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Layers,
  Compass,
  Heart,
  Briefcase,
  BookOpen,
  CalendarCheck,
  Lock,
} from "lucide-react";

interface Resource {
  icon: typeof Bot;
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  external?: boolean;
  status: "available" | "coming_soon";
}

const resources: Resource[] = [
  {
    icon: Bot,
    tag: "Free PDF · 25 pages",
    title: "Visibility Starter Kit",
    desc: "10 AI prompts, 5 content angles, an event-to-content checklist, a weekly content system, a story capture worksheet, a platform breakdown, and a visual capture supplement. The cornerstone resource.",
    cta: "Get the Kit",
    href: "/resources/visibility-starter-kit",
    status: "available",
  },
  {
    icon: Compass,
    tag: "Free guide · ADAPT framework",
    title: "ADAPT Starter Guide",
    desc: "Audit your own workflow with the ADAPT framework. Find the one place AI belongs in your work, build a small system around it, and run a real pilot.",
    cta: "Read the Framework",
    href: "/frameworks/adapt",
    status: "available",
  },
  {
    icon: CalendarCheck,
    tag: "Coming Soon · 1-page printable",
    title: "Event-to-Content Toolkit",
    desc: "An expanded version of the checklist inside the Starter Kit. Standalone PDF you can print, pin near your desk, and tick through before, during, and after every event.",
    cta: "Notify Me",
    href: "#",
    status: "coming_soon",
  },
  {
    icon: Layers,
    tag: "Coming Soon · System pack",
    title: "AI Content System Kit",
    desc: "The full AI-supported content workflow. Custom GPTs, Claude project templates, automation recipes, and the system map for running a one-person content engine end to end.",
    cta: "Notify Me",
    href: "#",
    status: "coming_soon",
  },
  {
    icon: Heart,
    tag: "Coming Soon · For nonprofits",
    title: "Nonprofit AI Prompt Pack",
    desc: "AI prompts tailored for nonprofit communications, fundraising letters, donor stories, grant narratives, and impact reports. Same direct, practical tone as the Starter Kit.",
    cta: "Notify Me",
    href: "#",
    status: "coming_soon",
  },
  {
    icon: Briefcase,
    tag: "Coming Soon · For founders",
    title: "Founder-Led Content Planner",
    desc: "A 30-day rolling content plan tailored to founder-led brands. Real-week templates, founder voice prompts, and a publishing rhythm built around running a business.",
    cta: "Notify Me",
    href: "#",
    status: "coming_soon",
  },
  {
    icon: BookOpen,
    tag: "Coming Soon · Worksheet",
    title: "Knowledge-to-Asset Worksheet",
    desc: "Turn what you already know into lead magnets, courses, toolkits, and digital products. A 5-step worksheet that maps expertise to revenue-generating assets.",
    cta: "Notify Me",
    href: "#",
    status: "coming_soon",
  },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Resources
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8">
        Tools and templates to help you{" "}
        <span className="italic text-accent-highlight">build visibility.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        Practical resources for founders, businesses, and impact-driven leaders. Most are free. All are designed to live next to your real work, not on a shelf.
      </p>
    </div>
  </section>
);

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const isAvailable = resource.status === "available";
  const Icon = resource.icon;

  const inner = (
    <>
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center">
          <Icon size={22} className="text-accent-deep" />
        </div>
        {!isAvailable && (
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
            <Lock size={10} /> Coming Soon
          </span>
        )}
      </div>
      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-deep mb-2">
        {resource.tag}
      </p>
      <h3 className="font-serif text-xl md:text-2xl font-semibold leading-snug mb-3 group-hover:text-accent-deep transition-colors">
        {resource.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
        {resource.desc}
      </p>
      {isAvailable ? (
        <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">
          {resource.cta} <ArrowRight size={14} />
        </p>
      ) : (
        <p className="text-sm font-medium text-muted-foreground inline-flex items-center gap-1.5">
          {resource.cta} <ArrowUpRight size={14} className="opacity-60" />
        </p>
      )}
    </>
  );

  const className = `group flex flex-col bg-card border border-border rounded-md p-7 transition-colors ${
    isAvailable ? "hover:border-accent/40" : "opacity-80 hover:opacity-100"
  }`;

  if (resource.external) {
    return (
      <a href={resource.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  if (!isAvailable) {
    return <div className={className}>{inner}</div>;
  }
  return (
    <Link to={resource.href} className={className}>
      {inner}
    </Link>
  );
};

const ResourcesGridSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r) => (
          <ResourceCard key={r.title} resource={r} />
        ))}
      </div>
    </div>
  </section>
);

const NewsletterCTASection = () => (
  <section className="section-padding bg-foreground text-background py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
        New Resources
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        Get new resources{" "}
        <span className="italic text-accent">when they ship.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        One email a week. New resources land first in the newsletter. Plus the field notes I write on storytelling, systems, and practical AI.
      </p>
      <Button variant="dark-hero" size="lg" asChild>
        <Link to="/resources/visibility-starter-kit">
          Start with the Visibility Starter Kit <ArrowRight className="ml-2" size={16} />
        </Link>
      </Button>
    </div>
  </section>
);

const Resources = () => {
  useEffect(() => {
    setSEO({
      title: "Resources | Rovonn Russell",
      description: "Tools, templates, and systems to help you build visibility. Practical resources for founders, businesses, and impact-driven leaders. Most are free.",
      path: "/resources",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <ResourcesGridSection />
    <NewsletterCTASection />
  </main>
  );
};

export default Resources;

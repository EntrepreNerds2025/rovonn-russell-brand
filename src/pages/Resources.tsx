import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Target,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface Resource {
  icon: typeof Bot;
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  external?: boolean;
}

const resources: Resource[] = [
  {
    icon: Sparkles,
    tag: "Free · personalized in 24 hours",
    title: "The Edge",
    desc: "Six questions about your business. Within 24 hours, I personally email you back with a custom blueprint on the first AI workflow I'd install in your business this week.",
    cta: "Get Your Edge",
    href: "/the-edge",
  },
  {
    icon: Bot,
    tag: "Free PDF · 30 prompt codes",
    title: "The Founder's Prompt Codes",
    desc: "30 commands that work in ChatGPT, Claude, and any modern AI tool. Founder-tailored. Two minutes to set up, hours back every week after. Includes setup instructions for both ChatGPT Custom Instructions and Claude Projects.",
    cta: "Get the Codes",
    href: "/resources/prompt-codes",
  },
  {
    icon: Target,
    tag: "Free framework",
    title: "The ADAPT Framework",
    desc: "The five-step diagnostic that figures out where AI actually fits in your specific business before you install anything. Assess, Discover, Apply, Produce, Transform.",
    cta: "Read the Framework",
    href: "/adapt",
  },
  {
    icon: BookOpen,
    tag: "Free · field notes",
    title: "The Blog",
    desc: "Field notes on AI, ADAPT, and what actually works for small businesses. New essays drop most weeks. Read freely. No email gate.",
    cta: "Read the Blog",
    href: "/blog",
  },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Resources
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8">
        Tools and playbooks for founders who want to{" "}
        <span className="italic text-accent-highlight">ADAPT AI</span> to the business they actually run.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        Free resources. Real depth. Built for SMB owners and creators who care about their craft and their margin.
      </p>
    </div>
  </section>
);

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const Icon = resource.icon;

  const inner = (
    <>
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center">
          <Icon size={22} className="text-accent-deep" />
        </div>
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
      <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">
        {resource.cta} {resource.external ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
      </p>
    </>
  );

  const className = `group flex flex-col bg-card border border-border rounded-md p-7 transition-colors ${
    "hover:border-accent/40"
  }`;

  if (resource.external) {
    return (
      <a href={resource.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
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
        When You're Ready for a Personal Move
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        Take{" "}
        <span className="italic text-accent">The Edge.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        A 90-second form. I write back personally within 24 hours with a custom blueprint on the first AI workflow I'd install in your business.
      </p>
      <Button variant="dark-hero" size="lg" asChild>
        <Link to="/the-edge">
          Get Your Edge <ArrowRight className="ml-2" size={16} />
        </Link>
      </Button>
    </div>
  </section>
);

const Resources = () => {
  useEffect(() => {
    setSEO({
      title: "Resources | Rovonn Russell",
      description: "Free prompt codes, tools, and field notes for founders and small business owners who want to ADAPT AI to their actual business. The Prompt Codes, the Framework, the Blog, and The Edge.",
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

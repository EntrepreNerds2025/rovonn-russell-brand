import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Layers,
  Target,
  MessageSquareQuote,
  TrendingUp,
  BookOpen,
  Sparkles,
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
    icon: Layers,
    tag: "Free PDF · 25 pages · cornerstone",
    title: "The ADAPT Playbook",
    desc: "The full framework, the five outcomes most founders want from AI, ten specific Virtual Employees you can install, and the first 30 days. For founders and small business owners who want to ADAPT AI to the business they actually run.",
    cta: "Download the Playbook",
    href: "/resources/adapt-playbook",
    status: "coming_soon",
  },
  {
    icon: Bot,
    tag: "Free PDF · 30 prompt codes",
    title: "The Founder's Prompt Codes",
    desc: "30 commands that work in ChatGPT, Claude, and any modern AI tool. Founder-tailored. Two minutes to set up, hours back every week after. Includes setup instructions for both ChatGPT Custom Instructions and Claude Projects.",
    cta: "Get the Codes",
    href: "/resources/prompt-codes",
    status: "available",
  },
  {
    icon: Sparkles,
    tag: "Free · personalized in 24 hours",
    title: "The Edge",
    desc: "A 90-second form. Five questions about your business. Within 24 hours, I personally email you back with a custom blueprint on the first AI workflow I'd install in your business this week.",
    cta: "Get Your Edge",
    href: "/the-edge",
    status: "available",
  },
  {
    icon: Target,
    tag: "Free framework",
    title: "The ADAPT Framework",
    desc: "The five-step diagnostic that figures out where AI actually fits in your specific business before you install anything. Assess, Discover, Apply, Produce, Transform. The wedge behind every Virtual Employee we install.",
    cta: "Read the Framework",
    href: "/adapt",
    status: "available",
  },
  {
    icon: BookOpen,
    tag: "Case studies",
    title: "Built with ADAPT",
    desc: "Real case studies of Virtual Employees we've installed in founders' businesses. The Virtual Proposal Writer, the Virtual Inbox Manager, the Virtual Project Manager. With outcomes in real numbers.",
    cta: "See What We've Built",
    href: "/built-with-adapt",
    status: "available",
  },
  {
    icon: MessageSquareQuote,
    tag: "Coming soon · essay",
    title: "Voice as Moat",
    desc: "Why your craft and brand matter MORE in the AI era, not less. How to keep your voice intact while you scale, and why most AI content commoditizes the very thing you're trying to defend.",
    cta: "Notify Me",
    href: "#",
    status: "coming_soon",
  },
  {
    icon: TrendingUp,
    tag: "Coming soon · weekly newsletter",
    title: "The Founder Economy Briefing",
    desc: "A weekly read on AI, the SMB economy, and what's actually working in 2026. Sent Sunday morning. Roughly 4 minutes. Unsubscribe whenever.",
    cta: "Subscribe",
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
      description: "Free playbooks, prompt codes, and tools for founders and small business owners who want to ADAPT AI to their actual business. The Playbook, the Prompt Codes, the Framework, and The Edge.",
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

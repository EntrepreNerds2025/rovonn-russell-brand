import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Eye,
  Sparkles,
  Building2,
} from "lucide-react";

interface PathAction {
  label: string;
  href: string;
  external?: boolean;
}

interface Path {
  number: string;
  icon: typeof Bot;
  intent: string;
  title: string;
  desc: string;
  actions: PathAction[];
}

const paths: Path[] = [
  {
    number: "01",
    icon: Bot,
    intent: "I want to use AI in a practical way.",
    title: "Practical AI for real work.",
    desc: "Not chasing every tool. Building one or two workflows that actually save you time and protect your voice.",
    actions: [
      { label: "Read the ADAPT framework", href: "/frameworks/adapt" },
      { label: "Get the Visibility Starter Kit", href: "/resources/visibility-starter-kit" },
      { label: "Watch AI for Real Work videos", href: import.meta.env.VITE_YOUTUBE_URL || "https://youtube.com", external: true },
    ],
  },
  {
    number: "02",
    icon: Eye,
    intent: "I want to become more visible.",
    title: "Build a visibility system.",
    desc: "Show up consistently around the work you're already doing. Without burning out, posting randomly, or losing your voice.",
    actions: [
      { label: "Get the Visibility Starter Kit", href: "/resources/visibility-starter-kit" },
      { label: "Read articles on visibility", href: "https://blog.rovonnrussell.com", external: true },
      { label: "Browse all resources", href: "/resources" },
    ],
  },
  {
    number: "03",
    icon: Sparkles,
    intent: "I want to turn my knowledge into assets.",
    title: "Knowledge to assets.",
    desc: "Convert what you already know into lead magnets, courses, toolkits, and digital products that compound while you sleep.",
    actions: [
      { label: "Read knowledge-to-asset essays", href: "https://blog.rovonnrussell.com", external: true },
      { label: "Browse all resources", href: "/resources" },
      { label: "Work with Rovonn on advisory", href: "/work-with-me" },
    ],
  },
  {
    number: "04",
    icon: Building2,
    intent: "I represent an organization.",
    title: "For nonprofits, CSR teams, and impact-led companies.",
    desc: "If you're here on behalf of a team or organization that needs storytelling, visibility, ADAPT training, or campaign work delivered, Impact Loop is the right door.",
    actions: [
      { label: "Visit Impact Loop", href: "https://impactloop.ca", external: true },
      { label: "Take the Impact Story Diagnostic", href: "https://impactloop.ca/bookings", external: true },
      { label: "Explore ADAPT Training", href: "https://impactloop.ca/adapt-ai-training", external: true },
    ],
  },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Start Here
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8">
        Pick the path that matches{" "}
        <span className="italic text-accent-highlight">where you actually are.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        Whether you want to use AI better, become more visible, turn your expertise into assets, or bring this work to your organization, here's the best place to begin.
      </p>
    </div>
  </section>
);

const PathSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
      {paths.map((path) => (
        <article
          key={path.number}
          className="grid md:grid-cols-12 gap-6 md:gap-10 pb-10 md:pb-14 border-b border-border last:border-b-0 last:pb-0"
        >
          <div className="md:col-span-3">
            <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-2">
              <span className="font-serif font-bold text-6xl md:text-7xl text-accent leading-none">
                {path.number}
              </span>
              <div className="md:mt-3">
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center mb-3">
                  <path.icon size={18} className="text-accent-deep" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-9">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-3">
              {path.intent}
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold leading-snug mb-4">
              {path.title}
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-7 max-w-2xl">
              {path.desc}
            </p>

            <div className="space-y-2.5">
              {path.actions.map((action, i) =>
                action.external ? (
                  <a
                    key={i}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/action flex items-center justify-between bg-card border border-border rounded-md px-5 py-3.5 hover:border-accent/40 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                    <ArrowUpRight size={16} className="text-accent-deep group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform" />
                  </a>
                ) : (
                  <Link
                    key={i}
                    to={action.href}
                    className="group/action flex items-center justify-between bg-card border border-border rounded-md px-5 py-3.5 hover:border-accent/40 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                    <ArrowRight size={16} className="text-accent-deep group-hover/action:translate-x-1 transition-transform" />
                  </Link>
                )
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const FinalSection = () => (
  <section className="section-padding bg-foreground text-background py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
        Still Not Sure?
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        When in doubt,{" "}
        <span className="italic text-accent">start with the kit.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        The Visibility Starter Kit is the cornerstone resource. Most people who land here start there, then come back for the rest as they need it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="dark-hero" size="lg" asChild>
          <Link to="/resources/visibility-starter-kit">
            Get the Visibility Starter Kit <ArrowRight className="ml-2" size={16} />
          </Link>
        </Button>
        <Button variant="dark-outline" size="lg" asChild>
          <Link to="/resources">Browse all resources</Link>
        </Button>
      </div>
    </div>
  </section>
);

const StartHere = () => {
  useEffect(() => {
    setSEO({
      title: "Start Here | Rovonn Russell",
      description: "Pick the path that matches where you actually are. Whether you want to use AI better, become more visible, turn expertise into assets, or bring this work to your organization, here's the best place to begin.",
      path: "/start-here",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <PathSection />
    <FinalSection />
  </main>
  );
};

export default StartHere;

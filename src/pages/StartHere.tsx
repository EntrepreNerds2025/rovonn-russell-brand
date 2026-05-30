import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  UserRoundSearch,
  Layers,
  BookOpen,
  Film,
  Building2,
} from "lucide-react";

interface PathAction {
  label: string;
  href: string;
  external?: boolean;
}

interface Path {
  number: string;
  icon: typeof UserRoundSearch;
  intent: string;
  title: string;
  desc: string;
  actions: PathAction[];
}

const paths: Path[] = [
  {
    number: "01",
    icon: UserRoundSearch,
    intent: "I want to know where AI fits in my business.",
    title: "Take The Edge.",
    desc: "A 90-second form. Five questions about your business. Within 24 hours, I write back personally with a custom blueprint on the first AI workflow I'd install in your business this week.",
    actions: [
      { label: "Get Your Edge", href: "/the-edge" },
      { label: "Read the blog", href: "/blog" },
    ],
  },
  {
    number: "02",
    icon: Layers,
    intent: "I want to understand the framework first.",
    title: "Read the ADAPT framework.",
    desc: "Assess, Discover, Apply, Produce, Transform. The five-step diagnostic that figures out where AI actually fits in your specific business before you install anything.",
    actions: [
      { label: "Read the ADAPT framework", href: "/adapt" },
      { label: "Take The Edge", href: "/the-edge" },
    ],
  },
  {
    number: "03",
    icon: BookOpen,
    intent: "I want something I can use today.",
    title: "Get The Founder's Prompt Codes.",
    desc: "Free 30-page PDF. 30 prompt codes that work in ChatGPT, Claude, and any modern AI tool. Two minutes to set up, hours back every week after.",
    actions: [
      { label: "Get the Prompt Codes", href: "/resources/prompt-codes" },
      { label: "Read the blog", href: "/blog" },
    ],
  },
  {
    number: "04",
    icon: Film,
    intent: "I want premium creative direction.",
    title: "Studio direction for founders.",
    desc: "For founders whose personal brand is the multiplier. Premium directorial production, 5-8 projects per year, by application. AI used where it earns its keep.",
    actions: [
      { label: "See Studio details", href: "/studio" },
      { label: "Tell me about your project", href: "/contact?topic=studio" },
    ],
  },
  {
    number: "05",
    icon: Building2,
    intent: "I represent a nonprofit, foundation, or CSR team.",
    title: "Visit Impact Loop.",
    desc: "My studio for mission-driven organizations. Cinematic storytelling, ADAPT training, and content systems delivered for nonprofits, foundations, and CSR teams.",
    actions: [
      { label: "Visit Impact Loop", href: "https://impactloop.ca", external: true },
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
        Five paths. Pick yours. Each one ends with a clear next step that won't waste your time.
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
        <span className="italic text-accent">take The Edge.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        It's 90 seconds. You'll get a personal email back from me within 24 hours with the first AI workflow I'd install in your business. No pitch, no funnel, no sales call required.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="dark-hero" size="lg" asChild>
          <Link to="/the-edge">
            Get Your Edge <ArrowRight className="ml-2" size={16} />
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
      description: "Pick the path that matches where you actually are. Five paths for founders, small business owners, creators, and organizations. Each one ends with a clear next step.",
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

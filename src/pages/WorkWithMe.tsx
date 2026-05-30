import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  UserRoundSearch,
  Mic,
  Film,
  PhoneCall,
  MessageSquareText,
  HeartHandshake,
  Users,
  CheckCircle2,
} from "lucide-react";

const BOOKING_URL = import.meta.env.VITE_ADVISORY_BOOKING_URL || "/contact";

const primaryPaths = [
  {
    icon: UserRoundSearch,
    label: "Most-common offer",
    title: "AI Advisory for founders.",
    desc: "One-on-one work to figure out where AI fits in your specific business and where it'll backfire. Monthly retainer or fixed-scope ADAPT Sprint. We meet, we install workflows, we measure what works.",
    cta: "See engagement options",
    href: "#leaders",
    external: false,
  },
  {
    icon: Users,
    label: "For builds at scale",
    title: "Virtual Employees, built with EntrepreNerds.",
    desc: "When you need a Virtual Employee installed in your business at SMB scale, my team at EntrepreNerds does the build. I lead the strategy. They lead the implementation. Most projects start with The Edge.",
    cta: "See case studies",
    href: "/built-with-adapt",
    external: false,
  },
  {
    icon: Film,
    label: "For founders whose brand is the multiplier",
    title: "Studio direction.",
    desc: "Premium directorial production for founders and companies who need a brand film, founder narrative, or campaign centerpiece. Selective intake, 5 to 8 projects per year. From $15,000.",
    cta: "See Studio details",
    href: "/studio",
    external: false,
  },
  {
    icon: Mic,
    label: "For events + teams",
    title: "Speaking + workshops.",
    desc: "Keynotes, conference talks, and team workshops on AI for the founder economy. In-person and remote. The ADAPT framework in keynote form, voice as moat, the five outcomes, and more.",
    cta: "View speaking topics",
    href: "/speaking",
    external: false,
  },
];

const engagementOptions = [
  {
    icon: PhoneCall,
    label: "Start Here",
    title: "Discovery Call.",
    format: "Free · 30 minutes",
    desc: "A low-commitment intro call to figure out what you actually need. No pitch, no pressure, no follow-up sales sequence. We talk through where you are, what you're trying to build, and which of the options below (if any) makes sense.",
    includes: [
      "30-minute call, on Zoom or phone",
      "Honest read on whether what you need is something Rovonn helps with",
      "If it isn't, a referral to someone who does",
    ],
    cta: "Book a discovery call",
    href: BOOKING_URL,
    external: true,
  },
  {
    icon: MessageSquareText,
    label: "One-Time Engagement",
    title: "Strategy Session.",
    format: "Paid · 90 minutes",
    desc: "A focused, one-time strategic conversation on a specific question. Best for founders and operators who have a clear thing they're stuck on and want a strategic gut-check before they invest in building anything.",
    includes: [
      "Pre-call brief: you submit context, Rovonn reviews before the call",
      "90-minute working session focused on one specific decision or problem",
      "Follow-up summary with notes, recommendations, and what to do next",
    ],
    cta: "Book a strategy session",
    href: BOOKING_URL,
    external: true,
  },
  {
    icon: HeartHandshake,
    label: "Ongoing Partnership",
    title: "Strategic Advisory.",
    format: "Monthly retainer",
    desc: "An ongoing thinking partner for founders building visibility and AI-supported systems seriously. Monthly strategy call plus async support between calls. Good for people who want compounding strategic input over time, not a one-time fix.",
    includes: [
      "Monthly 60-min strategy call",
      "Async support (Loom + email) between calls",
      "Quarterly review of progress and priorities",
      "Direct line to Rovonn for time-sensitive questions",
    ],
    cta: "Inquire about advisory",
    href: BOOKING_URL,
    external: true,
  },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Work With Me
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8">
        Four doors. Pick the one that{" "}
        <span className="italic text-accent-highlight">fits where you are.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        Whether you're a founder who wants AI advisory, a business that needs a Virtual Employee built, a brand that needs creative direction, or an event looking for a speaker, here's the right way in. Most people start with The Edge.
      </p>
    </div>
  </section>
);

const PrimaryPathsSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryPaths.map((path) => {
          const Inner = (
            <>
              <div className="w-12 h-12 mb-6 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <path.icon size={22} className="text-accent-deep" />
              </div>
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-3">
                {path.label}
              </p>
              <h3 className="font-serif text-2xl font-semibold mb-3 leading-tight">{path.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">{path.desc}</p>
              <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">
                {path.cta} {path.external ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
              </p>
            </>
          );
          const className = "group flex flex-col bg-card border border-border rounded-md p-7 hover:border-accent/40 transition-colors";

          if (path.external) {
            return (
              <a key={path.title} href={path.href} target="_blank" rel="noopener noreferrer" className={className}>
                {Inner}
              </a>
            );
          }
          if (path.href.startsWith("#")) {
            return (
              <a key={path.title} href={path.href} className={className}>
                {Inner}
              </a>
            );
          }
          return (
            <Link key={path.title} to={path.href} className={className}>
              {Inner}
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

const LeadersSection = () => (
  <section id="leaders" className="section-padding py-20 md:py-28">
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          For Founders + Small Business Owners
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
          Three ways to work{" "}
          <span className="italic">with Rovonn directly.</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Most people start with The Edge or a discovery call. From there, the right format depends on whether you have a specific question, a one-time need, or want an ongoing thinking partner.
        </p>
      </div>

      <div className="space-y-10 md:space-y-14">
        {engagementOptions.map((opt, i) => (
          <article
            key={opt.title}
            className="grid md:grid-cols-12 gap-6 md:gap-10 pb-10 md:pb-14 border-b border-border last:border-b-0 last:pb-0"
          >
            <div className="md:col-span-3">
              <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-2">
                <span className="font-serif font-bold text-6xl md:text-7xl text-accent leading-none">
                  0{i + 1}
                </span>
                <div className="md:mt-3">
                  <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center mb-2">
                    <opt.icon size={18} className="text-accent-deep" />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-9">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-2">
                {opt.label}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold leading-snug mb-2">
                {opt.title}
              </h3>
              <p className="text-sm font-medium text-foreground/70 mb-5">{opt.format}</p>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                {opt.desc}
              </p>

              <div className="bg-secondary/60 border border-border rounded-md p-5 mb-6 max-w-2xl">
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-3">
                  What's Included
                </p>
                <ul className="space-y-2">
                  {opt.includes.map((line, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 size={15} className="text-accent-deep shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="hero" asChild>
                <a href={opt.href} target="_blank" rel="noopener noreferrer">
                  {opt.cta} <ArrowRight className="ml-2" size={14} />
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const WorkshopsNote = () => (
  <section className="section-padding bg-secondary py-12 md:py-14">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start gap-5 bg-card border border-border rounded-md p-7">
        <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
          <Users size={22} className="text-accent-deep" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-2">
            Also Available
          </p>
          <h3 className="font-serif text-xl md:text-2xl font-semibold mb-2 leading-tight">
            Workshops for small teams.
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
            Half-day or full-day workshops on storytelling, visibility systems, and practical AI for teams of 5-30. Tailored to your team's actual workflows. Mention this on the discovery call.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 hover:gap-2.5 hover:text-accent-deep transition-all"
          >
            Inquire about workshops <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="section-padding bg-foreground text-background py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
        Not Sure Yet?
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        Start with a{" "}
        <span className="italic text-accent">discovery call.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        30 minutes. Free. No pitch. We figure out together whether what you need is something Rovonn helps with, and if it isn't, you'll leave with a referral to someone who does.
      </p>
      <Button variant="dark-hero" size="lg" asChild>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a discovery call <ArrowRight className="ml-2" size={16} />
        </a>
      </Button>
    </div>
  </section>
);

const WorkWithMe = () => {
  useEffect(() => {
    setSEO({
      title: "Work With Me | Rovonn Russell",
      description: "Three doors: organizations route to Impact Loop, founders and leaders work with Rovonn directly through advisory and strategy sessions, events get speaking topics.",
      path: "/work-with-me",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <PrimaryPathsSection />
    <LeadersSection />
    <WorkshopsNote />
    <FinalCTA />
  </main>
  );
};

export default WorkWithMe;

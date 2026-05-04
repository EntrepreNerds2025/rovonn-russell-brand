import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  Eye,
  Compass,
  PlayCircle,
  Layers,
  Repeat2,
  Building2,
  UserRoundSearch,
  BookOpen,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-16 md:pb-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        A Framework
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.0] mb-8">
        ADAPT.
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-serif italic">
        A practical framework for AI adoption that doesn't strip the human side out of your work.
      </p>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   FRAMING
   ────────────────────────────────────────────────────────── */
const FramingSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Why This Exists
      </p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-8">
        Most teams adopt AI by reaching for tools.{" "}
        <span className="italic text-accent-highlight">ADAPT inverts that.</span>
      </h2>
      <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
        <p>
          The teams that go further faster aren't the ones who tried the most tools. They're the ones who started with assessment, picked one place to apply AI deliberately, and built a system out of what worked.
        </p>
        <p>
          ADAPT is the framework I teach for that journey. Five steps, in this order. Skip a step and you end up with toys instead of leverage.
        </p>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   THE 5 STEPS
   ────────────────────────────────────────────────────────── */
const steps = [
  {
    letter: "A",
    label: "Assess",
    icon: Eye,
    title: "Start with where you actually are.",
    body: "Before any tool. Before any pilot. Look honestly at how the work currently moves through your team — what's painful, what's manual, where the bottleneck really is. Most AI projects fail at this step because they skip it. The team that knows its actual workflow will build something useful. The team that imagines a workflow will build something abstract.",
    practice: "Map one process end-to-end. Where does time go? Where does quality drop? Where does capacity break? That's where AI is going to matter — not where it sounds exciting.",
  },
  {
    letter: "D",
    label: "Discover",
    icon: Compass,
    title: "Find where AI actually fits.",
    body: "Now look at your real workflow against what AI is genuinely good at: classification, summarization, drafting, translation, structured extraction, light judgment. Match the tool to the task you actually have, not the task you wish you had. Most of the AI use cases that work in production look unremarkable. That's a feature.",
    practice: "Pick one workflow where AI could genuinely help. Just one. Resist the urge to find five. Concentration beats spread, especially this early.",
  },
  {
    letter: "A",
    label: "Apply",
    icon: PlayCircle,
    title: "Run a small, real pilot.",
    body: "One workflow, one team member, one specific use. Not a department-wide rollout. Not a vendor evaluation. A pilot small enough that you can see whether it actually works in two weeks, not two quarters. Build cheaply. Use the simplest tool that could possibly work. The point isn't sophistication — it's signal.",
    practice: "Define what \"working\" looks like before you start. Time saved? Output quality? Reduced errors? If you don't define the success metric in advance, you'll find a way to claim success regardless.",
  },
  {
    letter: "P",
    label: "Produce",
    icon: Layers,
    title: "Compare with-AI to without-AI.",
    body: "Run the pilot long enough to compare outputs honestly. Not just \"did the AI generate something?\" — but is the output better than the manual version, faster, more consistent, or freeing up real time? Production is where most AI pilots quietly fail. The model produced something. Nobody used it. Or someone used it and then spent more time fixing it than they would have done from scratch. Catch that here.",
    practice: "Track three metrics: time, quality, and team energy. Energy matters because a tool that technically saves time but burns out the operator is a net loss.",
  },
  {
    letter: "T",
    label: "Transform",
    icon: Repeat2,
    title: "Turn what works into a system.",
    body: "Anything that survives Produce gets converted into a system. Documented. Repeatable. Owned by someone. Templated. This is the step that compounds — every workflow you transform makes the next one easier, because you know what to look for. The teams that stay good at AI are the ones that keep transforming. Everyone else stays in pilot purgatory.",
    practice: "Write down the workflow as a runbook. If a new team member couldn't replicate it from your notes, it's not a system yet — it's still tribal knowledge.",
  },
];

const StepsSection = () => (
  <section className="section-padding py-16 md:py-24">
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          The Five Steps
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
          Assess. Discover. Apply.{" "}
          <span className="italic">Produce. Transform.</span>
        </h2>
      </div>

      <div className="space-y-10 md:space-y-14">
        {steps.map((step, i) => (
          <article
            key={step.label}
            className="grid md:grid-cols-12 gap-6 md:gap-10 pb-10 md:pb-14 border-b border-border last:border-b-0 last:pb-0"
          >
            {/* Letter + label */}
            <div className="md:col-span-3">
              <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1">
                <span className="font-serif font-bold text-7xl md:text-8xl text-accent leading-none">
                  {step.letter}
                </span>
                <div className="md:mt-2">
                  <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent-deep mb-1">
                    Step 0{i + 1}
                  </p>
                  <p className="font-serif text-2xl font-semibold">{step.label}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="md:col-span-9">
              <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4 leading-snug">
                {step.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-5">
                {step.body}
              </p>
              <div className="flex items-start gap-3 pt-4 border-t border-border/60">
                <step.icon size={18} className="text-accent-deep shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-1.5">
                    In Practice
                  </p>
                  <p className="text-sm md:text-base font-serif italic text-foreground leading-relaxed">
                    {step.practice}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   ORDER MATTERS
   ────────────────────────────────────────────────────────── */
const OrderSection = () => (
  <section className="section-padding bg-foreground text-background py-20 md:py-28">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
        Why The Order Matters
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
        Most teams want to start at{" "}
        <span className="italic text-accent">Apply.</span>
      </h2>
      <div className="space-y-5 text-base md:text-lg opacity-80 leading-relaxed">
        <p>
          The tools are exciting. The pilot is concrete. Apply feels like progress.
        </p>
        <p>
          But the teams that skip Assess and Discover end up automating the wrong thing — efficiently. They get faster at work that didn't matter. The teams that skip Transform stay in pilot purgatory forever, perpetually evaluating tools, perpetually demoing, never owning anything.
        </p>
        <p>
          The order isn't ceremonial. It's the difference between a team that compounds and a team that experiments.
        </p>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   WHO IT'S FOR / NEXT STEPS
   ────────────────────────────────────────────────────────── */
const nextStepCards = [
  {
    icon: BookOpen,
    label: "For Yourself",
    title: "Use ADAPT on your own work.",
    desc: "Audit your own workflow with the framework. Find the one place AI belongs. Build a small system around it.",
    cta: "Get the ADAPT Starter Guide",
    href: "/resources",
    external: false,
  },
  {
    icon: UserRoundSearch,
    label: "For Leaders",
    title: "Run ADAPT with your team.",
    desc: "Advisory and coaching for founders and team leaders running their first ADAPT cycle. Quarterly, paced, accountable.",
    cta: "Book ADAPT Advisory",
    href: "/work-with-me",
    external: false,
  },
  {
    icon: Building2,
    label: "For Organizations",
    title: "ADAPT Training for your team.",
    desc: "Full delivery for nonprofits, CSR teams, and impact-led companies. Engaged and run by Impact Loop, the studio Rovonn founded.",
    cta: "Explore ADAPT Training",
    href: "https://impactloop.ca/adapt-ai-training",
    external: true,
  },
];

const NextStepsSection = () => (
  <section className="section-padding py-20 md:py-28">
    <div className="max-w-6xl mx-auto">
      <div className="max-w-3xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          Three Ways To Run It
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
          Pick the version that fits where you{" "}
          <span className="italic">actually are.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {nextStepCards.map((card) => {
          const Inner = (
            <>
              <div className="w-12 h-12 mb-6 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <card.icon size={22} className="text-accent-deep" />
              </div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent-deep mb-3">
                {card.label}
              </p>
              <h3 className="font-serif text-xl font-semibold mb-3 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                {card.desc}
              </p>
              <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">
                {card.cta} <ArrowRight size={14} />
              </p>
            </>
          );
          const className =
            "group flex flex-col bg-card border border-border rounded-md p-7 hover:border-accent/40 transition-colors";
          return card.external ? (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {Inner}
            </a>
          ) : (
            <Link key={card.title} to={card.href} className={className}>
              {Inner}
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   FINAL LINE
   ────────────────────────────────────────────────────────── */
const FinalSection = () => (
  <section className="section-padding bg-secondary py-20 md:py-24">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        The Point
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
        Don't chase AI.{" "}
        <span className="italic text-accent-highlight">Adapt to it on your own terms.</span>
      </h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
        Clarity before complexity. One workflow at a time. Built into a system you actually own.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="hero" size="lg" asChild>
          <Link to="/resources">
            Get the ADAPT Starter Guide <ArrowRight className="ml-2" size={16} />
          </Link>
        </Button>
        <Button variant="hero-outline" size="lg" asChild>
          <Link to="/work-with-me">Work With Rovonn</Link>
        </Button>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   MAIN
   ────────────────────────────────────────────────────────── */
const AdaptFramework = () => {
  useEffect(() => {
    setSEO({
      title: "ADAPT Framework | Rovonn Russell",
      description: "A practical framework for AI adoption that doesn't strip the human side out of your work. Assess. Discover. Apply. Produce. Transform.",
      path: "/frameworks/adapt",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <FramingSection />
    <StepsSection />
    <OrderSection />
    <NextStepsSection />
    <FinalSection />
  </main>
  );
};

export default AdaptFramework;

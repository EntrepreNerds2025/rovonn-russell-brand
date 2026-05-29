import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import {
  ArrowRight,
  Film,
  Sparkles,
  Camera,
  ScrollText,
  Wand2,
  CheckCircle2,
} from "lucide-react";

const STUDIO_INTAKE_URL =
  import.meta.env.VITE_STUDIO_INTAKE_URL || "/contact?topic=studio";

/* ──────────────────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-16 md:pb-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Studio
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.0] mb-8">
        Cinematic stories,{" "}
        <span className="italic text-accent-highlight">directed.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-serif italic">
        Premium directorial production for founders whose personal brand is the multiplier. Not for everyone. By application only. Five to eight projects per year.
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
        Most founder content is made for the algorithm.{" "}
        <span className="italic text-accent-highlight">
          Studio is for the archive.
        </span>
      </h2>
      <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
        <p>
          There's a difference between content and a film. Content gets posted,
          gets a number, and gets buried by the next post. A film holds up. It
          gets watched twice. It gets sent to the people who matter. It plays
          on a loop on a sales page two years from now and still does the work.
        </p>
        <p>
          Studio is for founders, executives, and companies that need a piece
          of work that holds up — a brand film, a founder narrative, a campaign
          centerpiece, a story that gets used everywhere. Selective intake.
          High-touch direction. Modern production with AI used where it earns
          its keep, never where it cheapens the work.
        </p>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   WHAT YOU GET
   ────────────────────────────────────────────────────────── */
const includes = [
  {
    icon: ScrollText,
    label: "Story strategy",
    body: "Before any cameras. We figure out what story this project is actually telling — and what it shouldn't try to tell. The work that holds up is the work that knows what it isn't.",
  },
  {
    icon: Camera,
    label: "Full production",
    body: "Script, shoot, edit, sound. Cinematic direction across every frame. Locations, talent, lighting, and pacing handled end-to-end so you can stay focused on the work itself.",
  },
  {
    icon: Wand2,
    label: "AI-augmented post",
    body: "AI used where it actually saves time without flattening the craft — generative b-roll, color and grade workflows, scale that used to need a 10-person team. AI is a tool here, not the headline.",
  },
  {
    icon: Sparkles,
    label: "Final assets, multi-format",
    body: "Long-form film for the site, vertical cuts for social, ad-length variants, and a master archive file for whatever the next two years asks for.",
  },
];

const WhatYouGetSection = () => (
  <section className="section-padding py-20 md:py-28">
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          What's Included
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
          Direction-first production,{" "}
          <span className="italic">end to end.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {includes.map((item) => (
          <article
            key={item.label}
            className="bg-card border border-border rounded-md p-7 hover:border-accent/40 transition-colors"
          >
            <div className="w-12 h-12 mb-6 rounded-md bg-accent/10 flex items-center justify-center">
              <item.icon size={22} className="text-accent-deep" />
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 leading-tight">
              {item.label}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   PROCESS
   ────────────────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    label: "Intake",
    body: "You tell me about the project — who it's for, what story you want to tell, what the deadline looks like. I qualify in or out within 48 hours. No pitch deck, no sales sequence.",
  },
  {
    number: "02",
    label: "Direction",
    body: "If it's a fit, we move to a paid creative direction phase: story brief, treatment, shot logic, visual references. This is where most of the value of working with a director shows up.",
  },
  {
    number: "03",
    label: "Production",
    body: "Shoot, edit, sound, color, AI-augmented post. Tight communication across the build. You see cuts at meaningful checkpoints, not every two days.",
  },
  {
    number: "04",
    label: "Delivery",
    body: "Master file, social cuts, ad variants, archive. Documented so the work outlives the project window.",
  },
];

const ProcessSection = () => (
  <section className="section-padding bg-secondary py-20 md:py-28">
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          The Process
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
          Four phases.{" "}
          <span className="italic">In this order.</span>
        </h2>
      </div>

      <div className="space-y-10 md:space-y-14">
        {steps.map((step) => (
          <article
            key={step.number}
            className="grid md:grid-cols-12 gap-6 md:gap-10 pb-10 md:pb-14 border-b border-border last:border-b-0 last:pb-0"
          >
            <div className="md:col-span-3">
              <span className="font-serif font-bold text-6xl md:text-7xl text-accent leading-none">
                {step.number}
              </span>
            </div>
            <div className="md:col-span-9">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-2">
                {step.label}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {step.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   AI TRANSPARENCY + INTAKE NOTE
   ────────────────────────────────────────────────────────── */
const TransparencySection = () => (
  <section className="section-padding py-16 md:py-20">
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-md p-8 md:p-10">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          On AI in the studio
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-5 leading-tight">
          AI is a tool here.{" "}
          <span className="italic">Direction is the work.</span>
        </h3>
        <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            Modern production runs faster than it used to. Generative b-roll
            fills a gap on a tight schedule. AI-augmented color and grade
            workflows shave days off post. Vertical cuts and ad variants get
            generated in hours instead of weeks.
          </p>
          <p>
            What AI doesn't do here: write the story. Choose the angle. Decide
            what the work means. The direction is human. The taste is human.
            The judgment about what to keep and what to cut is human. AI is
            used where it earns its keep — never where it cheapens the work.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   FINAL CTA
   ────────────────────────────────────────────────────────── */
const FinalCTA = () => (
  <section className="section-padding bg-foreground text-background py-20 md:py-28">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
        Selective Intake
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        Five to eight projects a year.{" "}
        <span className="italic text-accent">From $15,000.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        If your project sounds like a fit, tell me about it. I'll respond
        within 48 hours with whether it's a fit, and if so, what the next step
        looks like. No pitch sequence. No follow-up funnel.
      </p>
      <Button variant="dark-hero" size="lg" asChild>
        <a href={STUDIO_INTAKE_URL}>
          Tell me about your project <ArrowRight className="ml-2" size={16} />
        </a>
      </Button>
      <p className="opacity-50 text-xs mt-6">
        Looking for monthly social media or AI ads instead?{" "}
        <a
          href="https://nerdscreativegroup.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          Visit Nerds Creative
        </a>
        .
      </p>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────── */
const Studio = () => {
  useEffect(() => {
    setSEO({
      title: "Studio — Cinematic Production for Founders and Companies | Rovonn Russell",
      description:
        "Selective intake, director-led production for founders and companies. Brand films, founder narratives, campaign visuals. From $15,000.",
      path: "/studio",
    });
    return resetSEO;
  }, []);

  return (
    <main>
      <HeroSection />
      <FramingSection />
      <WhatYouGetSection />
      <ProcessSection />
      <TransparencySection />
      <FinalCTA />
    </main>
  );
};

export default Studio;

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Clock, TrendingUp, Sparkles } from "lucide-react";

type CaseStudy = {
  slug: string;
  icon: typeof Clock;
  title: string;
  subtitle: string;
  outcome: string;
  before: string;
  bottleneck: string;
  built: string;
  result: string;
  counterfactual: string;
};

const caseStudies: CaseStudy[] = [
  {
    slug: "virtual-proposal-writer",
    icon: Sparkles,
    title: "The Virtual Proposal Writer",
    subtitle: "Design Studio · 4 people · Vancouver",
    outcome: "6-hour proposals down to 90 minutes. The course she'd been parking for 2 years launched.",
    before:
      "She runs a 4-person interior design studio. Custom-tailored client proposals were how she won business. Each one took 6 hours. Across her monthly proposal volume, she was burning 24 hours a month on writing alone. The online course she'd been meaning to record for two years was parked because there was no time.",
    bottleneck:
      "The bottleneck wasn't writing proposals. It was the customization to each specific client. That customization was the thing that won her work. So a generic AI proposal generator would have killed the moat she actually had.",
    built:
      "With my team at EntrepreNerds, we installed her Virtual Proposal Writer. Claude trained on her past 30 proposals as voice samples, plus a templated intake-to-draft workflow that handles the structural customization layer. She approves and tweaks the final draft. Time to install: 3 hours.",
    result:
      "Proposal time dropped from 6 hours to 90 minutes. That's 18 hours back per month. She used the recovered time to record the course. It launched 7 weeks later and now generates its own revenue line.",
    counterfactual:
      "Without ADAPT, she'd have installed a generic proposal tool, lost the custom voice that won her business, and the course would still be on the napkin.",
  },
  {
    slug: "virtual-inbox-manager",
    icon: Clock,
    title: "The Virtual Inbox Manager",
    subtitle: "Coaching practice · 1 person · Boston",
    outcome: "90 minutes a day of email triage cut to 10 minutes. Mornings back.",
    before:
      "A solo coach with a growing waitlist. Mornings were eaten by 90 minutes of email triage: new inquiries, existing client check-ins, podcast pitches, vendor questions, and the never-ending miscellany. By the time he got to his actual coaching work, he was already worn down.",
    bottleneck:
      "The bottleneck wasn't volume. It was that everything looked equally important until he opened it. Every email demanded the same level of his attention. He needed a layer that did the looking for him.",
    built:
      "His Virtual Inbox Manager: an AI workflow that triages incoming email by category (new lead, existing client, vendor, podcast, miscellany), drafts replies in his voice for the templated categories, and surfaces only the messages that genuinely need his attention. He reviews and approves in 10 focused minutes a day. Time to install: 4 hours.",
    result:
      "Email work dropped from 90 minutes to 10. That's roughly 7 hours back per week. He used the recovered mornings to launch a second coaching tier that's now 30% of his revenue.",
    counterfactual:
      "Without ADAPT, he'd have hired a virtual assistant at $1,500/month, brought them up to speed for 6 weeks, and still been the bottleneck on the messages that mattered.",
  },
  {
    slug: "virtual-project-manager",
    icon: TrendingUp,
    title: "The Virtual Project Manager",
    subtitle: "Creative agency · 6 people · Toronto",
    outcome: "3 stalled client projects unblocked in 30 days. Founder stopped being the bottleneck on every status update.",
    before:
      "A 6-person creative agency where the founder personally wrote every client status update, tracked every milestone across 12 active projects, and was the bottleneck on every internal handoff. Three projects had been stalled for weeks because she hadn't had time to chase the next step.",
    bottleneck:
      "The bottleneck wasn't the projects themselves. It was that all status reporting, all milestone tracking, and all client communication flowed through her. The team was capable. The system was founder-dependent.",
    built:
      "Her Virtual Project Manager: an AI workflow connected to her project tool, calendar, and client communication channels. It assembles weekly status updates from raw project data, drafts client check-in emails in her voice, flags stalled projects with suggested next steps, and surfaces only the decisions that actually need her. Time to install: 6 hours.",
    result:
      "All three stalled projects unblocked within 30 days. Internal handoffs flowed without her. She recovered roughly 10 hours per week and used them to win and onboard 2 new client engagements that month.",
    counterfactual:
      "Without ADAPT, she'd have either burned out trying to scale herself, or hired a $7K/month project manager who would have taken 90 days to be useful. Neither was actually the move.",
  },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">Built with ADAPT</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7">
        Virtual Employees, built to fit your <span className="italic text-accent-highlight">specific business.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
        Every founder has work they wish they could hire for but can't justify. AI changes the math. I install Virtual Employees in founders' businesses, designed for the work eating your week, the project on the napkin, the role you've been trying to avoid hiring for. Sometimes a Virtual Proposal Writer. Sometimes a Virtual Inbox Manager. Sometimes something nobody's named yet.
      </p>
    </div>
  </section>
);

const FramingBlock = () => (
  <section className="section-padding bg-secondary py-12 md:py-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">Some Virtual Employees We've Installed</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-6">These are examples. <span className="italic text-accent-highlight">Yours will be different.</span></h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        Every founder's bottleneck is specific to their business. The roles below are some of the most common Virtual Employees we've built so far. If yours isn't on this list, that doesn't mean it can't be built. It usually means we'll design it specifically for you. Take The Edge if you want to find out which Virtual Employee would change your week.
      </p>
    </div>
  </section>
);

const CaseStudyCard = ({ study }: { study: CaseStudy }) => (
  <article className="bg-card border border-border rounded-md overflow-hidden">
    <div className="p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
          <study.icon size={22} className="text-accent-deep" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-1">{study.subtitle}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">{study.title}</h2>
        </div>
      </div>
      <p className="text-base md:text-lg font-medium text-foreground leading-relaxed mb-8 italic">{study.outcome}</p>
      <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">The Founder Before</p>
          <p>{study.before}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">The Bottleneck</p>
          <p>{study.bottleneck}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">What We Built</p>
          <p>{study.built}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">The Result</p>
          <p>{study.result}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Without ADAPT</p>
          <p>{study.counterfactual}</p>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground mb-4">Want a Virtual Employee like this in YOUR business?</p>
        <Button variant="hero" asChild><Link to="/the-edge">Take The Edge <ArrowRight className="ml-2" size={14} /></Link></Button>
      </div>
    </div>
  </article>
);

const CaseStudiesSection = () => (
  <section className="section-padding">
    <div className="max-w-4xl mx-auto space-y-8">
      {caseStudies.map((study) => (
        <CaseStudyCard key={study.slug} study={study} />
      ))}
    </div>
  </section>
);

const RoutingFooter = () => (
  <section className="section-padding bg-foreground text-background py-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">How to Get Started</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-10">Two doors. Pick the one that fits where you are.</h2>
      <div className="space-y-6 text-base md:text-lg opacity-85 leading-relaxed">
        <p>
          <strong className="text-accent">For founders who want a personal first move:</strong> Take The Edge or book Advisory. We'll figure out what Virtual Employee fits your business and either install it together or hand you the blueprint to install it yourself.
        </p>
        <p>
          <strong className="text-accent">For builds at enterprise or mid-market scale:</strong> My team at <a href="https://entreprenerdsagency.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">EntrepreNerds</a> handles those. I lead the strategy. They lead the build.
        </p>
      </div>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button variant="dark-hero" size="lg" asChild><Link to="/the-edge">Get Your Edge</Link></Button>
        <Button variant="dark-outline" size="lg" asChild><Link to="/work-with-me">See Work With Me</Link></Button>
      </div>
    </div>
  </section>
);

const BuiltWithAdapt = () => {
  useEffect(() => {
    trackEvent("built_with_adapt_page_viewed");
    setSEO({
      title: "Built with ADAPT — Virtual Employees for Founders | Rovonn Russell",
      description: "Case studies of Virtual Employees I've installed in founders' businesses. Virtual Proposal Writer, Virtual Inbox Manager, Virtual Project Manager, and more. Built with ADAPT.",
      path: "/built-with-adapt",
    });
    return resetSEO;
  }, []);

  return (
    <main>
      <HeroSection />
      <FramingBlock />
      <CaseStudiesSection />
      <RoutingFooter />
    </main>
  );
};

export default BuiltWithAdapt;

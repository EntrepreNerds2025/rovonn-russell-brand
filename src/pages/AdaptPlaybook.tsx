import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, CheckCircle2, Download, BookOpen, Layers, Target, Users, ListChecks, Sparkles } from "lucide-react";

const PDF_URL = "/resources/the-adapt-playbook.pdf";

const insideSections = [
  { icon: Target, title: "Part 1: The Five Outcomes", desc: "What founders actually want from AI: save time, protect margin, achieve success, stop struggling, unlock work. And how to spot which one is most stuck for you." },
  { icon: Layers, title: "Part 2: The ADAPT Framework", desc: "Assess, Discover, Apply, Produce, Transform. Letter by letter. Why most founders skip three of them and end up with four unused subscriptions." },
  { icon: Users, title: "Part 3: Ten Virtual Employees", desc: "Ten specific AI workflows you can install, named as the role they play (Virtual Inbox Manager, Virtual Proposal Writer, Virtual Project Manager, more)." },
  { icon: BookOpen, title: "Part 4: The First 30 Days", desc: "Week by week. Assess, install, run, refine, then install the next. By month six, the business is structurally different." },
  { icon: ListChecks, title: "Part 5: Self-Assessment Scorecard", desc: "Five dimensions, 14 questions. Score yourself. The highest dimension is the outcome to focus on first." },
  { icon: Sparkles, title: "Part 6: Your Next Move", desc: "Two doors: a personal first move via The Edge, or a build at scale via my team at EntrepreNerds." },
];

const HeroSection = ({ onScrollToForm }: { onScrollToForm: () => void }) => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">The cornerstone resource. Free</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7">
        The ADAPT <span className="italic text-accent-highlight">Playbook.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
        A guide for founders and small business owners who want to ADAPT AI to the business they actually run. The framework, the five outcomes, ten Virtual Employees, and the first 30 days.
      </p>
      <Button variant="hero" size="lg" onClick={onScrollToForm}>
        Send it to my inbox <ArrowRight className="ml-2" size={16} />
      </Button>
      <p className="text-xs text-muted-foreground mt-4">Free. No spam. Unsubscribe anytime.</p>
    </div>
  </section>
);

const InsideSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">What's Inside</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-12">Six parts. <span className="italic text-accent-highlight">Built to live next to your work.</span></h2>
      <div className="grid md:grid-cols-2 gap-6">
        {insideSections.map((s) => (
          <div key={s.title} className="flex items-start gap-4 bg-card border border-border rounded-md p-6 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 mt-0.5 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <s.icon size={18} className="text-accent-deep" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold leading-snug mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FormSection = ({ formRef }: { formRef: React.RefObject<HTMLDivElement> }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      trackEvent("adapt_playbook_submission_attempted");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/subscribe-to-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: "playbook", email, first_name: firstName, source: "site_form" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent("adapt_playbook_submission_completed");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Try again, or email rovonn@rovonnrussell.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={formRef} className="section-padding bg-foreground text-background py-20">
      <div className="max-w-2xl mx-auto">
        {submitted ? (
          <div className="text-center">
            <CheckCircle2 size={48} className="text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-5">Check your inbox, {firstName}.</h2>
            <p className="opacity-75 mb-8">The ADAPT Playbook is on its way. Read Part 1 first to identify which of the five outcomes is most stuck for you. The workflows in Part 3 are mapped to it.</p>
            <a href={PDF_URL} className="inline-flex items-center gap-2 text-accent underline font-semibold" target="_blank" rel="noopener noreferrer">
              <Download size={16} /> Download directly while you wait
            </a>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5 text-center">Send it to my inbox</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-8 text-center">Get the Playbook. <span className="italic text-accent">Free.</span></h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-background/20 rounded-md bg-background/5 text-background placeholder:text-background/40 focus:outline-none focus:border-accent transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-background/20 rounded-md bg-background/5 text-background placeholder:text-background/40 focus:outline-none focus:border-accent transition-colors"
              />
              {error && <p className="text-sm text-accent-highlight">{error}</p>}
              <Button type="submit" variant="dark-hero" size="lg" disabled={submitting} className="w-full">
                {submitting ? "Sending..." : "Send me the Playbook ->"}
              </Button>
              <p className="text-xs opacity-50 text-center mt-3">You'll also get my Sunday briefing. Short, useful, unsubscribe anytime.</p>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

const WhoForSection = () => (
  <section className="section-padding py-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">Who This Is For</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-10">Founders and small business owners who refuse to choose between AI leverage and a brand that sounds human.</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          "Founders running businesses with 1 to 25 people",
          "Creators, coaches, and consultants who run real operations",
          "Service businesses where the founder is the bottleneck",
          "Anyone tired of buying AI tools that sit unused in browser tabs",
        ].map((line) => (
          <div key={line} className="flex items-start gap-3 text-base text-foreground">
            <CheckCircle2 size={18} className="text-accent-deep shrink-0 mt-0.5" />
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NextSection = () => (
  <section className="section-padding bg-secondary py-16">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">When You're Ready for More</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-10">Two next moves.</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/the-edge" className="group block bg-card border border-border rounded-md p-8 hover:border-accent/40 transition-colors">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-3">For a personal first move</p>
          <h3 className="font-serif text-2xl font-semibold leading-snug mb-4">The Edge.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">A 90-second form. Five questions about your business. Within 24 hours, I write back personally with a custom blueprint on the first AI workflow I'd install for you this week.</p>
          <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">Get Your Edge <ArrowRight size={14} /></p>
        </Link>
        <Link to="/built-with-adapt" className="group block bg-card border border-border rounded-md p-8 hover:border-accent/40 transition-colors">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-3">For proof in real cases</p>
          <h3 className="font-serif text-2xl font-semibold leading-snug mb-4">Built with ADAPT.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">Case studies of Virtual Employees we've installed in founders' businesses. The Virtual Proposal Writer, the Virtual Inbox Manager, the Virtual Project Manager.</p>
          <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">See the case studies <ArrowRight size={14} /></p>
        </Link>
      </div>
    </div>
  </section>
);

const AdaptPlaybook = () => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("adapt_playbook_page_viewed");
    setSEO({
      title: "The ADAPT Playbook | A Free Guide for Founders | Rovonn Russell",
      description: "A free guide for founders and small business owners. The ADAPT framework, the five outcomes founders actually want from AI, ten Virtual Employees, and the first 30 days.",
      path: "/resources/adapt-playbook",
    });
    return resetSEO;
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main>
      <HeroSection onScrollToForm={scrollToForm} />
      <InsideSection />
      <WhoForSection />
      <FormSection formRef={formRef} />
      <NextSection />
    </main>
  );
};

export default AdaptPlaybook;

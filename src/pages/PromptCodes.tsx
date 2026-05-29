import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, CheckCircle2, Download } from "lucide-react";

const PDF_URL = "/resources/the-founders-prompt-codes.pdf";

const sampleCodes = [
  { code: "TRUTHMODE", category: "Strategy", desc: "Stop being polite. Tell me what's weak about my plan." },
  { code: "80/20", category: "Strategy", desc: "The simplest, highest-leverage path." },
  { code: "TIMEBACK", category: "Time", desc: "Find ways to save hours and reduce the founder bottleneck." },
  { code: "MARGINLENS", category: "Money", desc: "Show me how this protects profit or reduces waste." },
  { code: "VOICELOCK", category: "Voice", desc: "Keep the writing aligned to my voice and tone." },
  { code: "ADAPTMODE", category: "On-Brand", desc: "Fit AI to MY business. Not a list of tools, real moves." },
];

const HeroSection = ({ onScrollToForm }: { onScrollToForm: () => void }) => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">A free download for founders</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7">
        The Founder's <span className="italic text-accent-highlight">Prompt Codes.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
        30 commands that work in ChatGPT, Claude, and any modern AI tool. Use them today. Save hours this week.
      </p>
      <Button variant="hero" size="lg" onClick={onScrollToForm}>
        Send it to my inbox <ArrowRight className="ml-2" size={16} />
      </Button>
      <p className="text-xs text-muted-foreground mt-4">Plus my Sunday briefing. Unsubscribe anytime.</p>
    </div>
  </section>
);

const PreviewSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">What's Inside</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-12">Six of the thirty. <span className="italic text-accent-highlight">Just a taste.</span></h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleCodes.map((item) => (
          <div key={item.code} className="bg-card border border-border rounded-md p-6 hover:border-accent/40 transition-colors">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">{item.category}</p>
            <p className="font-mono font-bold text-lg text-foreground mb-2">{item.code}:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground italic mt-10 text-center">Plus 24 more, organized by category, with examples and setup instructions for ChatGPT and Claude.</p>
    </div>
  </section>
);

const WorksInSection = () => (
  <section className="section-padding py-12">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Works In</p>
      <h2 className="text-2xl md:text-3xl font-serif font-semibold leading-tight mb-3">ChatGPT. Claude. Any modern AI tool.</h2>
      <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">Includes setup instructions for ChatGPT Custom Instructions, Claude Projects, and one-off paste-at-start use. Two minutes to set up, hours back every week after.</p>
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
      trackEvent("prompt_codes_submission_attempted");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/subscribe-to-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: "prompt_codes", email, first_name: firstName, source: "site_form" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent("prompt_codes_submission_completed");
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
            <p className="opacity-75 mb-8">The Prompt Codes PDF is on its way. Open it, paste page 6 into your AI tool's Custom Instructions, and start using the codes today.</p>
            <a href={PDF_URL} className="inline-flex items-center gap-2 text-accent underline font-semibold" target="_blank" rel="noopener noreferrer">
              <Download size={16} /> Download directly while you wait
            </a>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5 text-center">Send it to my inbox</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-8 text-center">Get the 30 codes. <span className="italic text-accent">Free.</span></h2>
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
                {submitting ? "Sending..." : "Send me the codes ->"}
              </Button>
              <p className="text-xs opacity-50 text-center mt-3">You'll also get my Sunday briefing. Short, useful, unsubscribe anytime.</p>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

const NextSection = () => (
  <section className="section-padding">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">When You're Ready for More</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-10">Two next moves.</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/the-edge" className="group block bg-card border border-border rounded-md p-8 hover:border-accent/40 transition-colors">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-3">For founders ready for a personal move</p>
          <h3 className="font-serif text-2xl font-semibold leading-snug mb-4">The Edge.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">A 90-second form. Five questions about your business. Within 24 hours, I write back personally with a custom blueprint on the first AI workflow I'd install in your business this week.</p>
          <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">Get Your Edge <ArrowRight size={14} /></p>
        </Link>
        <Link to="/resources/adapt-playbook" className="group block bg-card border border-border rounded-md p-8 hover:border-accent/40 transition-colors">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-3">For founders ready for the framework</p>
          <h3 className="font-serif text-2xl font-semibold leading-snug mb-4">The ADAPT Playbook.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">A 25-page guide. The framework, the five outcomes, ten specific workflows, and the first 30 days. Free download.</p>
          <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">Download the Playbook <ArrowRight size={14} /></p>
        </Link>
      </div>
    </div>
  </section>
);

import { useRef } from "react";

const PromptCodes = () => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("prompt_codes_page_viewed");
    setSEO({
      title: "The Founder's Prompt Codes | 30 AI Commands for Small Business Owners | Rovonn Russell",
      description: "30 prompt codes that work in ChatGPT, Claude, and any modern AI tool. Founder-tailored. Free download. Use them today.",
      path: "/resources/prompt-codes",
    });
    return resetSEO;
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main>
      <HeroSection onScrollToForm={scrollToForm} />
      <PreviewSection />
      <WorksInSection />
      <FormSection formRef={formRef} />
      <NextSection />
    </main>
  );
};

export default PromptCodes;

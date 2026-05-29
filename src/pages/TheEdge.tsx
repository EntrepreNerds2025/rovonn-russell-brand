import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type EdgeFormData = {
  business_description: string;
  time_eater: string;
  stalled_project: string;
  ai_status: "defense" | "watching" | "offense" | "";
  business_url: string;
  first_name: string;
  email: string;
};

const initialFormState: EdgeFormData = {
  business_description: "",
  time_eater: "",
  stalled_project: "",
  ai_status: "",
  business_url: "",
  first_name: "",
  email: "",
};

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">A free read on your business</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7">
        Send me your bottleneck. I'll send you your <span className="italic text-accent-highlight">Edge.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
        Five questions. 90 seconds. A personal email back from me within 24 hours with the first AI workflow I'd install in your business this week.
      </p>
    </div>
  </section>
);

const EdgeForm = () => {
  const [formData, setFormData] = useState<EdgeFormData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof EdgeFormData>(field: K, value: EdgeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      trackEvent("the_edge_submission_attempted");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/process-edge-submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "site_form",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent("the_edge_submission_completed");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Try again, or email rovonn@rovonnrussell.com directly.");
      trackEvent("the_edge_submission_failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="section-padding pb-20">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-md p-10 md:p-14 text-center">
          <CheckCircle2 size={48} className="text-accent-deep mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-5">Got it, {formData.first_name}.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Your Edge arrives in your inbox within 24 hours. While you wait, you'll find the ADAPT Playbook waiting in your inbox right now. The workflow I'm probably going to recommend is in there.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" asChild><Link to="/resources/adapt-playbook">Open the Playbook <ArrowRight className="ml-2" size={16} /></Link></Button>
            <Button variant="hero-outline" size="lg" asChild><Link to="/blog">Read the Blog</Link></Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding pb-20">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-card border border-border rounded-md p-8 md:p-12 space-y-7">
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="business">What's your business? <span className="text-muted-foreground font-normal">(one sentence)</span></label>
          <input
            id="business"
            type="text"
            required
            placeholder='e.g., "I run a 6-person design studio in Toronto."'
            value={formData.business_description}
            onChange={(e) => updateField("business_description", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="time-eater">What's eating most of your time right now? <span className="text-muted-foreground font-normal">(one sentence)</span></label>
          <input
            id="time-eater"
            type="text"
            required
            placeholder='e.g., "Client intake and project status updates."'
            value={formData.time_eater}
            onChange={(e) => updateField("time_eater", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="stalled">What's the project you've been meaning to ship but haven't? <span className="text-muted-foreground font-normal">(one sentence)</span></label>
          <input
            id="stalled"
            type="text"
            required
            placeholder='e.g., "A productized service for healthcare clinics."'
            value={formData.stalled_project}
            onChange={(e) => updateField("stalled_project", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Where are you on AI today?</label>
          <div className="space-y-2">
            {[
              { value: "defense", label: "Defense", desc: "I'm resisting or ignoring it" },
              { value: "watching", label: "Watching", desc: "I haven't done anything yet" },
              { value: "offense", label: "Offense", desc: "I've installed at least one workflow" },
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:border-accent-deep/40 transition-colors">
                <input
                  type="radio"
                  name="ai_status"
                  value={option.value}
                  required
                  checked={formData.ai_status === option.value}
                  onChange={(e) => updateField("ai_status", e.target.value as EdgeFormData["ai_status"])}
                  className="mt-1 accent-accent-deep"
                />
                <div>
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="url">Your business website <span className="text-muted-foreground font-normal">(so I can read up on you before I write back)</span></label>
          <input
            id="url"
            type="url"
            placeholder="https://yourbusiness.com"
            value={formData.business_url}
            onChange={(e) => updateField("business_url", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="first-name">First name</label>
            <input
              id="first-name"
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => updateField("first_name", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:border-accent-deep transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@yourbusiness.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-deep transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div>
          <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Sending..." : "Send me my Edge ->"}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            You'll get an instant confirmation with the ADAPT Playbook as a "while you wait" resource. Within 24 hours, I'll write back personally with a specific recommendation for your business.
          </p>
        </div>
      </form>
    </section>
  );
};

const WhatHappensNext = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">What Happens Next</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-10">No sales pitch. Just a clear next move <span className="italic text-accent-highlight">for your business.</span></h2>
      <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">In 5 minutes:</strong> you get an instant email with the ADAPT Playbook to read while I work on your blueprint.</p>
        <p><strong className="text-foreground">Within 24 hours:</strong> I personally read up on your business, run the diagnostic, and email you back with the specific first AI workflow I'd install in your business this week. Tools, time-to-install, expected outcome.</p>
        <p><strong className="text-foreground">If we end up working together:</strong> great. If not, you walk away with a clearer roadmap than you came in with.</p>
      </div>
    </div>
  </section>
);

const LowerCTA = () => (
  <section className="section-padding">
    <div className="max-w-3xl mx-auto text-center border border-border rounded-md p-10 md:p-14 bg-card">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">Not ready for The Edge yet?</p>
      <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-6">Start with the ADAPT Playbook. <span className="italic text-accent-highlight">Free.</span></h2>
      <p className="text-base text-muted-foreground leading-relaxed mb-8">A 25-page guide covering the framework, the five outcomes, ten specific workflows, and the first 30 days. Read it on your own time, then come back when you want a personalized read.</p>
      <Button variant="hero-outline" size="lg" asChild><Link to="/resources/adapt-playbook">Download the Playbook <ArrowRight className="ml-2" size={16} /></Link></Button>
    </div>
  </section>
);

const TheEdge = () => {
  useEffect(() => {
    trackEvent("the_edge_page_viewed");
    setSEO({
      title: "The Edge | Get Your First AI Workflow | Rovonn Russell",
      description: "Send me your bottleneck. I'll send you your Edge within 24 hours. A personal email back with the first AI workflow I'd install in your business this week.",
      path: "/the-edge",
    });
    return resetSEO;
  }, []);

  return (
    <main>
      <HeroSection />
      <EdgeForm />
      <WhatHappensNext />
      <LowerCTA />
    </main>
  );
};

export default TheEdge;

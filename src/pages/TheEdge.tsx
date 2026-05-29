import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

type AIStatus = "defense" | "watching" | "offense" | "";

type EdgeFormData = {
  business_description: string;
  time_eater: string;
  stalled_project: string;
  ai_status: AIStatus;
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

type StepKey = keyof EdgeFormData | "contact";

interface Step {
  key: StepKey;
  number: number;
  label: string;
  question: string;
  hint?: string;
  type: "text" | "url" | "radio" | "contact";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string; desc: string }[];
}

const steps: Step[] = [
  {
    key: "business_description",
    number: 1,
    label: "About you",
    question: "What's your business?",
    hint: "One sentence is plenty. Industry, size, what you sell.",
    type: "text",
    placeholder: 'e.g., "I run a 6-person design studio in Toronto."',
    required: true,
  },
  {
    key: "time_eater",
    number: 2,
    label: "The bottleneck",
    question: "What's eating most of your time right now?",
    hint: "Be specific. The kind of work, not the feeling.",
    type: "text",
    placeholder: 'e.g., "Client intake and project status updates."',
    required: true,
  },
  {
    key: "stalled_project",
    number: 3,
    label: "The stalled thing",
    question: "What's the project you've been meaning to ship but haven't?",
    hint: "The one parked because there's no time. The napkin one.",
    type: "text",
    placeholder: 'e.g., "A productized service for healthcare clinics."',
    required: true,
  },
  {
    key: "ai_status",
    number: 4,
    label: "Where you are",
    question: "Where are you on AI today?",
    type: "radio",
    required: true,
    options: [
      { value: "defense", label: "Defense", desc: "I'm resisting or ignoring it" },
      { value: "watching", label: "Watching", desc: "I haven't done anything yet" },
      { value: "offense", label: "Offense", desc: "I've installed at least one workflow" },
    ],
  },
  {
    key: "business_url",
    number: 5,
    label: "Your business",
    question: "Your business website?",
    hint: "Optional. So I can read up on you before I write back.",
    type: "url",
    placeholder: "https://yourbusiness.com",
    required: false,
  },
  {
    key: "contact",
    number: 6,
    label: "Send your Edge",
    question: "Where should I send your Edge?",
    hint: "First name and email. Within 24 hours, a personal email back from me.",
    type: "contact",
    required: true,
  },
];

const TOTAL_STEPS = steps.length;

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">A free read on your business</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7">
        Send me your bottleneck. I'll send you your <span className="italic text-accent-highlight">Edge.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
        Six questions. 90 seconds. A personal email back from me within 24 hours with the first AI workflow I'd install in your business this week.
      </p>
    </div>
  </section>
);

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const percent = (current / total) * 100;
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="font-semibold tracking-[0.2em] uppercase text-accent-deep">Question {current} of {total}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-deep transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const EdgeWizard = () => {
  const [formData, setFormData] = useState<EdgeFormData>(initialFormState);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === TOTAL_STEPS - 1;

  const updateField = useCallback(<K extends keyof EdgeFormData>(field: K, value: EdgeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isCurrentValid = () => {
    if (!currentStep.required) return true;
    if (currentStep.key === "contact") {
      return formData.first_name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(formData.email);
    }
    const val = formData[currentStep.key as keyof EdgeFormData];
    return typeof val === "string" && val.trim().length > 0;
  };

  const handleNext = () => {
    if (!isCurrentValid()) return;
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      trackEvent("the_edge_step_advanced", { step: stepIndex + 1 });
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentValid()) return;
    setSubmitting(true);
    setError(null);
    try {
      trackEvent("the_edge_submission_attempted");
      const endpoint = `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/process-edge-submission`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "site_form" }),
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
            Your Edge arrives in your inbox within 24 hours. Check your email now for the instant confirmation.
          </p>
          <Button variant="hero-outline" size="lg" asChild><Link to="/blog">Read the Blog while you wait</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding pb-20">
      <ProgressBar current={stepIndex + 1} total={TOTAL_STEPS} />

      <div className="max-w-3xl mx-auto bg-card border border-border rounded-md p-8 md:p-14 min-h-[420px] flex flex-col">
        <div key={currentStep.key} className="animate-fade-up flex-1">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">{currentStep.label}</p>
          <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-3">{currentStep.question}</h2>
          {currentStep.hint && (
            <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed mb-8">{currentStep.hint}</p>
          )}

          {/* Text / URL input */}
          {(currentStep.type === "text" || currentStep.type === "url") && (
            <input
              autoFocus
              type={currentStep.type === "url" ? "url" : "text"}
              placeholder={currentStep.placeholder}
              value={formData[currentStep.key as keyof EdgeFormData] as string}
              onChange={(e) => updateField(currentStep.key as keyof EdgeFormData, e.target.value as never)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (isLastStep) handleSubmit();
                  else handleNext();
                }
              }}
              className="w-full px-5 py-4 text-lg md:text-xl border-0 border-b-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent-deep transition-colors"
            />
          )}

          {/* Radio options */}
          {currentStep.type === "radio" && currentStep.options && (
            <div className="space-y-3 mt-2">
              {currentStep.options.map((opt) => {
                const selected = formData.ai_status === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateField("ai_status", opt.value as AIStatus)}
                    className={`w-full text-left p-5 border-2 rounded-md transition-colors ${
                      selected
                        ? "border-accent-deep bg-accent/10"
                        : "border-border hover:border-accent-deep/40"
                    }`}
                  >
                    <p className="font-semibold text-foreground mb-1">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Contact step */}
          {currentStep.type === "contact" && (
            <div className="space-y-5 mt-2">
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">First name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="What should I call you?"
                  value={formData.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  className="w-full px-5 py-4 text-lg border-0 border-b-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent-deep transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@yourbusiness.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="w-full px-5 py-4 text-lg border-0 border-b-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent-deep transition-colors"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive mt-5">{error}</p>}
        </div>

        {/* Nav buttons */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <span />
          )}

          {!isLastStep ? (
            <Button
              type="button"
              variant="hero"
              size="lg"
              onClick={handleNext}
              disabled={!isCurrentValid()}
            >
              Next <ArrowRight className="ml-2" size={16} />
            </Button>
          ) : (
            <Button
              type="button"
              variant="hero"
              size="lg"
              onClick={handleSubmit}
              disabled={!isCurrentValid() || submitting}
            >
              {submitting ? "Sending..." : "Send my Edge"} <ArrowRight className="ml-2" size={16} />
            </Button>
          )}
        </div>

        {/* Keyboard hint */}
        {(currentStep.type === "text" || currentStep.type === "url" || currentStep.type === "contact") && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-secondary border border-border rounded text-foreground">Enter</kbd> to continue
          </p>
        )}
      </div>
    </section>
  );
};

const WhatHappensNext = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">What Happens Next</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-10">No sales pitch. Just a clear next move <span className="italic text-accent-highlight">for your business.</span></h2>
      <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">In 5 minutes:</strong> you get an instant confirmation email.</p>
        <p><strong className="text-foreground">Within 24 hours:</strong> I personally read up on your business, run the diagnostic, and email you back with the specific first AI workflow I'd install in your business this week. Tools, time-to-install, expected outcome.</p>
        <p><strong className="text-foreground">If we end up working together:</strong> great. If not, you walk away with a clearer roadmap than you came in with.</p>
      </div>
    </div>
  </section>
);

const TheEdge = () => {
  useEffect(() => {
    trackEvent("the_edge_page_viewed");
    setSEO({
      title: "The Edge - Get Your First AI Workflow | Rovonn Russell",
      description: "Send me your bottleneck. I'll send you your Edge within 24 hours. A personal email back with the first AI workflow I'd install in your business this week.",
      path: "/the-edge",
    });
    return resetSEO;
  }, []);

  return (
    <main>
      <HeroSection />
      <EdgeWizard />
      <WhatHappensNext />
    </main>
  );
};

export default TheEdge;

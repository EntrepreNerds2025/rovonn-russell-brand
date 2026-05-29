import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Target, Eye, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// ---------- Types ----------
interface DiagnosticResponses {
  org_type: string;
  problem_solved: string;
  beneficiaries: string;
  communication_channels: string[];
  story_clarity: string;
  proof_of_impact: string[];
  publish_frequency: string;
  biggest_challenge: string;
  desired_outcome: string;
  org_name: string;
}

interface DiagnosticScores {
  impact_story_score: number;
  story_clarity_score: number;
  visibility_score: number;
}

interface DiagnosticReport {
  scores: DiagnosticScores;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

const INITIAL: DiagnosticResponses = {
  org_type: "",
  problem_solved: "",
  beneficiaries: "",
  communication_channels: [],
  story_clarity: "",
  proof_of_impact: [],
  publish_frequency: "",
  biggest_challenge: "",
  desired_outcome: "",
  org_name: "",
};

// ---------- Questions ----------
type QuestionDef =
  | { type: "single"; key: keyof DiagnosticResponses; question: string; options: string[] }
  | { type: "multi"; key: keyof DiagnosticResponses; question: string; options: string[] }
  | { type: "text"; key: keyof DiagnosticResponses; question: string; placeholder: string };

const QUESTIONS: QuestionDef[] = [
  { type: "text", key: "org_name", question: "What is the name of your organization?", placeholder: "e.g. Horizon Foundation" },
  { type: "single", key: "org_type", question: "What type of organization are you?", options: ["Nonprofit", "Social Enterprise", "Mission-Driven Business", "Initiative or Campaign", "Foundation", "Other"] },
  { type: "text", key: "problem_solved", question: "What problem does your organization exist to solve?", placeholder: "Describe the core issue your work addresses..." },
  { type: "text", key: "beneficiaries", question: "Who benefits from your work?", placeholder: "Describe the communities or groups you serve..." },
  { type: "multi", key: "communication_channels", question: "How do you currently communicate your impact?", options: ["Website", "Social Media", "Annual Reports", "Video", "Email Newsletter", "Events/Speaking", "Not Consistently"] },
  { type: "single", key: "story_clarity", question: "How clear is your story to someone hearing it for the first time?", options: ["Very Clear", "Somewhat Clear", "Confusing", "We Haven't Defined It"] },
  { type: "multi", key: "proof_of_impact", question: "What proof of impact do you currently show?", options: ["Testimonials", "Data & Metrics", "Case Studies", "Photos/Video", "Awards/Recognition", "Very Little Proof"] },
  { type: "single", key: "publish_frequency", question: "How often do you publish stories about your work?", options: ["Weekly", "Monthly", "Occasionally", "Rarely", "Never"] },
  { type: "single", key: "biggest_challenge", question: "What is your biggest storytelling challenge right now?", options: ["Getting Attention", "Explaining Impact Clearly", "Attracting Partners", "Attracting Funding", "Building Trust", "All of the Above"] },
  { type: "single", key: "desired_outcome", question: "What outcome would you most like to achieve?", options: ["More Awareness", "More Partnerships", "More Funding/Support", "Stronger Trust", "All of the Above"] },
];

// ---------- Helpers ----------
function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-500";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Developing";
  if (score >= 40) return "Needs Work";
  return "Critical Gap";
}

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  return (
    <div className="border border-border rounded-lg p-6 text-center">
      <Icon className="mx-auto mb-3 text-accent-highlight" size={28} />
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className={`text-4xl font-serif font-bold ${scoreColor(score)}`}>{score}</p>
      <p className={`text-xs font-semibold mt-1 ${scoreColor(score)}`}>{scoreLabel(score)}</p>
      <div className="mt-3">
        <Progress value={score} className="h-2" />
      </div>
    </div>
  );
}

// ---------- Main Component ----------
const DiagnosticTool = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "questions" | "email" | "loading" | "results">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [responses, setResponses] = useState<DiagnosticResponses>(INITIAL);
  const [email, setEmail] = useState("");
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = QUESTIONS[qIndex];
  const progress = ((qIndex + 1) / QUESTIONS.length) * 100;

  const setValue = useCallback((key: keyof DiagnosticResponses, value: string | string[]) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMulti = useCallback((key: keyof DiagnosticResponses, option: string) => {
    setResponses((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(option) ? arr.filter((o) => o !== option) : [...arr, option] };
    });
  }, []);

  const canProceed = () => {
    const val = responses[currentQ.key];
    if (Array.isArray(val)) return val.length > 0;
    return typeof val === "string" && val.trim().length > 0;
  };

  const nextQuestion = () => {
    if (qIndex < QUESTIONS.length - 1) setQIndex((i) => i + 1);
    else setStep("email");
  };

  const prevQuestion = () => {
    if (qIndex > 0) setQIndex((i) => i - 1);
  };

  const runDiagnostic = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setStep("loading");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("run-diagnostic", {
        body: { responses, email, org_name: responses.org_name },
      });

      if (error) throw new Error(error.message || "Failed to generate diagnostic.");
      if (data?.error) throw new Error(data.error);

      setReport(data.report);
      setStep("results");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
      setStep("email");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Intro ----------
  if (step === "intro") {
    return (
      <main>
        <section className="section-padding pt-32 md:pt-40">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">AI-Powered Tool</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Impact Story Diagnostic</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Discover how effectively your organization communicates its impact. Answer 10 quick questions and receive a personalized storytelling analysis with actionable recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 size={16} className="text-accent-highlight" />
                <span>Takes ~3 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles size={16} className="text-accent-highlight" />
                <span>AI-generated insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target size={16} className="text-accent-highlight" />
                <span>Actionable strategy</span>
              </div>
            </div>
            <Button variant="hero" size="lg" onClick={() => setStep("questions")}>
              Start the Diagnostic <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Questions ----------
  if (step === "questions") {
    return (
      <main>
        <section className="section-padding pt-32 md:pt-40">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  Question {qIndex + 1} of {QUESTIONS.length}
                </p>
                <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">{currentQ.question}</h2>

            {currentQ.type === "text" && (
              <textarea
                className="w-full border border-border bg-background rounded-lg px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/30 min-h-[120px] resize-none"
                placeholder={currentQ.placeholder}
                value={responses[currentQ.key] as string}
                onChange={(e) => setValue(currentQ.key, e.target.value)}
              />
            )}

            {currentQ.type === "single" && (
              <div className="grid gap-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    className={`text-left border rounded-lg px-5 py-4 text-sm transition-all ${
                      responses[currentQ.key] === opt
                        ? "border-accent bg-accent/5 text-foreground font-medium"
                        : "border-border hover:border-accent/30 text-muted-foreground"
                    }`}
                    onClick={() => setValue(currentQ.key, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === "multi" && (
              <div className="grid gap-3">
                {currentQ.options.map((opt) => {
                  const selected = (responses[currentQ.key] as string[]).includes(opt);
                  return (
                    <button
                      key={opt}
                      className={`text-left border rounded-lg px-5 py-4 text-sm transition-all ${
                        selected
                          ? "border-accent bg-accent/5 text-foreground font-medium"
                          : "border-border hover:border-accent/30 text-muted-foreground"
                      }`}
                      onClick={() => toggleMulti(currentQ.key, opt)}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${selected ? "bg-accent border-accent" : "border-muted-foreground/30"}`}>
                          {selected && <CheckCircle2 size={12} className="text-accent-foreground" />}
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
                <p className="text-xs text-muted-foreground mt-1">Select all that apply</p>
              </div>
            )}

            <div className="flex justify-between mt-10">
              <Button variant="outline" onClick={prevQuestion} disabled={qIndex === 0}>
                <ArrowLeft size={14} className="mr-2" /> Back
              </Button>
              <Button variant="hero" onClick={nextQuestion} disabled={!canProceed()}>
                {qIndex === QUESTIONS.length - 1 ? "Continue" : "Next"} <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Email Capture ----------
  if (step === "email") {
    return (
      <main>
        <section className="section-padding pt-32 md:pt-40">
          <div className="max-w-lg mx-auto text-center">
            <Sparkles className="mx-auto mb-6 text-accent-highlight" size={40} />
            <h2 className="text-3xl font-serif font-bold mb-4">Your analysis is ready to generate.</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Enter your email to receive your personalized Impact Story Diagnostic report with scores, insights, and strategic recommendations.
            </p>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full border border-border bg-background rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="you@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button variant="hero" className="w-full" size="lg" onClick={runDiagnostic} disabled={isSubmitting}>
                Generate My Report <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Loading ----------
  if (step === "loading") {
    return (
      <main>
        <section className="section-padding pt-32 md:pt-40">
          <div className="max-w-lg mx-auto text-center">
            <Loader2 className="mx-auto mb-6 text-accent-highlight animate-spin" size={48} />
            <h2 className="text-3xl font-serif font-bold mb-4">Analyzing your impact story...</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our AI is evaluating your storytelling clarity, proof of impact, and visibility. This takes about 15–30 seconds.
            </p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground animate-pulse">
                <BookOpen size={14} /> Evaluating narrative structure...
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Results ----------
  if (step === "results" && report) {
    const avgScore = Math.round((report.scores.impact_story_score + report.scores.story_clarity_score + report.scores.visibility_score) / 3);
    return (
      <main>
        <section className="section-padding pt-32 md:pt-40">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">Your Diagnostic Report</p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                Impact Story Diagnostic{responses.org_name ? `: ${responses.org_name}` : ""}
              </h1>
              <p className="text-muted-foreground">Overall Score: <span className={`font-bold text-lg ${scoreColor(avgScore)}`}>{avgScore}/100</span></p>
            </div>

            {/* Score Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <ScoreCard label="Impact Story Score" score={report.scores.impact_story_score} icon={Target} />
              <ScoreCard label="Story Clarity Score" score={report.scores.story_clarity_score} icon={Eye} />
              <ScoreCard label="Visibility Score" score={report.scores.visibility_score} icon={Sparkles} />
            </div>

            {/* Summary */}
            <div className="border border-border rounded-lg p-8 mb-8">
              <h3 className="font-serif text-xl font-semibold mb-4">Summary</h3>
              <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
            </div>

            {/* Strengths & Gaps */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="border border-border rounded-lg p-8">
                <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" /> Key Strengths
                </h3>
                <ul className="space-y-3">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-border rounded-lg p-8">
                <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-yellow-600" /> Key Gaps
                </h3>
                <ul className="space-y-3">
                  {report.gaps.map((g, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="border border-border rounded-lg p-8 mb-12">
              <h3 className="font-serif text-xl font-semibold mb-6">Strategic Recommendations</h3>
              <div className="space-y-4">
                {report.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent-highlight flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="section-dark rounded-lg p-8 md:p-12 text-center">
              <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: "hsl(var(--dark-section-foreground))" }}>
                Ready to strengthen your impact story?
              </h3>
              <p className="text-sm mb-8 opacity-80" style={{ color: "hsl(var(--dark-section-foreground))" }}>
                Book a complimentary strategy conversation with Rovonn Russell to explore how to turn these insights into action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" onClick={() => navigate("/contact")}>
                  Book a Strategy Conversation <ArrowRight className="ml-2" size={16} />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/services")} className="border-white/20 text-foreground hover:bg-white/10">
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return null;
};

export default DiagnosticTool;

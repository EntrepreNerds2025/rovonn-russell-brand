import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  BookOpen,
  Layers,
  Bot,
  Eye,
  Sparkles,
  ListChecks,
  CalendarCheck,
  Camera,
} from "lucide-react";
import { useStarterKitSubmit } from "@/hooks/use-crm-submit";
import { trackEvent } from "@/lib/analytics";
import { setSEO, resetSEO } from "@/lib/seo";

const PDF_URL = "/resources/visibility-starter-kit.pdf";

const audienceOptions = [
  "Entrepreneur",
  "Creator",
  "Nonprofit Leader",
  "Business Owner",
  "Consultant or Coach",
  "Corporate or Team Leader",
  "Other",
];

const inside = [
  { icon: Bot, title: "10 AI prompts that actually work", desc: "Copy-paste prompts for content, voice, headlines, repurposing, and SEO." },
  { icon: Layers, title: "5 content angles for finding stories", desc: "Behind-the-scenes, the lesson, the contrarian, the process, the result." },
  { icon: ListChecks, title: "Event-to-content checklist", desc: "Turn one event into 20 pieces of content. Pre, during, and after capture." },
  { icon: CalendarCheck, title: "A weekly content system", desc: "Mon/Wed/Fri rhythm. Three pieces per week in 80 minutes total." },
  { icon: BookOpen, title: "Story capture worksheet", desc: "10-minute weekly exercise to mine real work for stories." },
  { icon: Eye, title: "Where it lives: platform breakdown", desc: "LinkedIn vs X vs newsletter vs blog. Match the angle to the room." },
  { icon: Camera, title: "Visual capture supplement", desc: "What to film, what to photograph, the 5-format video repurpose." },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-16 md:pb-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        A Free Resource
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.0] mb-8">
        The Visibility{" "}
        <span className="italic text-accent-highlight">Starter Kit.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-serif italic">
        A practical kit for turning your ideas, work, and expertise into content people understand and act on.
      </p>
    </div>
  </section>
);

const InsideSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
        What's Inside
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-12">
        Seven sections.{" "}
        <span className="italic">25 pages.</span>{" "}
        Built to live next to your work.
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {inside.map((item) => (
          <div key={item.title} className="flex items-start gap-4 bg-card border border-border rounded-md p-5">
            <div className="w-10 h-10 mt-0.5 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <item.icon size={18} className="text-accent-deep" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold leading-snug mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FormSection = ({ onSubmitted, isSubmitted }: { onSubmitted: () => void; isSubmitted: boolean }) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useStarterKitSubmit();
  const started = useRef(false);

  const handleStarted = () => {
    if (!started.current) {
      started.current = true;
      trackEvent("starter_kit_form_started");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("A valid email is required."); return; }
    if (!audience) { setError("Tell us which one you are."); return; }
    mutate({ firstName: firstName.trim(), email: email.trim(), audience }, {
      onSuccess: () => {
        trackEvent("starter_kit_form_submitted", { audience });
        onSubmitted();
      },
    });
  };

  if (isSubmitted) {
    return (
      <section className="section-padding bg-foreground text-background py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-accent" />
          </div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5">
            You're In
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
            Your kit is{" "}
            <span className="italic text-accent">ready.</span>
          </h2>
          <p className="opacity-80 leading-relaxed mb-10 text-base md:text-lg">
            Download the 25-page PDF below. We'll also send a copy to your email so it's saved somewhere you can find it.
          </p>
          <Button variant="dark-hero" size="lg" asChild>
            <a href={PDF_URL} download="Visibility-Starter-Kit-Rovonn-Russell.pdf" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("starter_kit_downloaded")}>
              <Download className="mr-2" size={16} /> Download the Kit
            </a>
          </Button>
          <p className="text-xs opacity-50 mt-8">
            What's next? Pin one prompt this week. Try one angle on one moment. Ship one piece using the weekly system.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-foreground text-background py-16 md:py-20">
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5 text-center">
          Get The Kit
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6 text-center">
          Start turning your ideas into{" "}
          <span className="italic text-accent">visibility.</span>
        </h2>
        <p className="opacity-70 leading-relaxed mb-10 text-center text-base">
          Free. No spam. Unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); handleStarted(); }}
              placeholder="Your name"
              className="w-full bg-background/5 border border-background/15 text-background rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40"
              autoComplete="given-name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-background/5 border border-background/15 text-background rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="audience" className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">
              What best describes you? *
            </label>
            <select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-background/5 border border-background/15 text-background rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent appearance-none cursor-pointer"
              required
            >
              <option value="" className="bg-foreground text-background">Choose one</option>
              {audienceOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-foreground text-background">{opt}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-accent">{error}</p>
          )}

          <Button
            type="submit"
            variant="dark-hero"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Get the Starter Kit"}
            {!isPending && <ArrowRight className="ml-2" size={16} />}
          </Button>
        </form>
      </div>
    </section>
  );
};

const TrustNoteSection = () => (
  <section className="section-padding py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Who This Is For
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-6">
        Founders, businesses, and leaders who know they should be posting{" "}
        <span className="italic">but it hasn't stuck.</span>
      </h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        You're already doing the work. Clients, projects, conversations, lessons, surprises. The raw material is there. What's missing is a system for turning that material into content people can understand and act on. That's what this kit is for.
      </p>
    </div>
  </section>
);

// 2026-05-23: The Visibility Starter Kit was retired with the AI-forward repositioning.
// All traffic now redirects to /resources/prompt-codes (the new top-of-funnel lead magnet).
// The original components above are kept as reference and for potential rollback but are
// no longer rendered. The PDF asset remains in /public/resources/ for 90 days so any
// existing email links don't 404 before being updated.
import { useNavigate } from "react-router-dom";

const VisibilityStarterKit = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setSEO({
      title: "Redirecting | Rovonn Russell",
      description: "The Visibility Starter Kit has been retired. Redirecting to the new resources.",
      path: "/resources/visibility-starter-kit",
    });
    navigate("/resources/prompt-codes", { replace: true });
    return resetSEO;
  }, [navigate]);

  return (
    <main className="section-padding pt-32 md:pt-40 min-h-[60vh]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">Redirecting</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-6">
          This page moved.
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          The Visibility Starter Kit was retired. The new top-of-funnel resource is The Founder's Prompt Codes. You're being redirected now. If it doesn't load, the link below works.
        </p>
        <Button variant="hero" asChild>
          <Link to="/resources/prompt-codes">Go to The Founder's Prompt Codes</Link>
        </Button>
      </div>
    </main>
  );
};

export default VisibilityStarterKit;

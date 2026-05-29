import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Bot, Layers, Eye, Sparkles, BookOpen } from "lucide-react";
import { useSpeakingInquirySubmit } from "@/hooks/use-crm-submit";
import { trackEvent } from "@/lib/analytics";
import { setSEO, resetSEO } from "@/lib/seo";

const topics = [
  {
    icon: Bot,
    title: "Don't Just Adopt AI. ADAPT It.",
    desc: "The keynote version of the framework. Why most founders are losing the AI fight, and what changes when they ADAPT instead of adopt. 30 to 60 minutes.",
  },
  {
    icon: Sparkles,
    title: "The Five Things Founders Actually Want From AI",
    desc: "The economic case for AI in the SMB economy. Save time, protect margin, achieve the level of success they've been chasing, stop struggling, unlock the work that wasn't possible before. 30 to 60 minutes.",
  },
  {
    icon: Eye,
    title: "Voice as Moat",
    desc: "Why your craft and brand matter MORE in the AI era, not less. For creator-economy events, conferences, and founder summits. 30 to 45 minutes.",
  },
  {
    icon: Layers,
    title: "Building AI That Fits",
    desc: "Workshop format. We walk a room of founders through the ADAPT framework on their own businesses and identify the first Virtual Employee to install. 90 minutes to half-day.",
  },
  {
    icon: BookOpen,
    title: "The Founder Economy in 2026",
    desc: "Industry talk. What's actually happening to small businesses right now, what's working with AI, what's hype, and where the next 24 months are headed. 30 to 60 minutes.",
  },
];

const eventTypes = [
  "Conference Keynote",
  "Corporate Workshop",
  "Nonprofit Retreat",
  "Podcast / Interview",
  "Panel / Fireside",
  "Other",
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        Speaking
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8">
        Bring Rovonn in to talk about how founders and small businesses{" "}
        <span className="italic text-accent-highlight">ADAPT AI to actually grow.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
        Keynotes, workshops, and on-site training for conferences, founder summits, leadership offsites, and teams ready to install AI that fits their actual business. In-person across North America. Remote anywhere.
      </p>
    </div>
  </section>
);

const TopicsSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-5xl mx-auto">
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
          Talks + Workshops
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
          Five topics{" "}
          <span className="italic">audiences engage with.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {topics.map((t) => (
          <article key={t.title} className="bg-card border border-border rounded-md p-6 md:p-7 hover:border-accent/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <t.icon size={18} className="text-accent-deep" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold leading-snug mb-2.5">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-10 max-w-2xl italic font-serif">
        All talks can be tailored to your audience. Custom topics welcome - Rovonn has spoken on adjacent themes including narrative architecture, founder storytelling, and AI ethics for mission-driven organizations.
      </p>
    </div>
  </section>
);

const FormSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    event: "",
    event_date: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending } = useSpeakingInquirySubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    mutate(
      {
        name: form.name,
        email: form.email,
        org: form.org,
        event: form.event,
        event_date: form.event_date,
        message: form.message
          ? `Topic interest: ${form.topic || "Not specified"}\n\n${form.message}`
          : `Topic interest: ${form.topic || "Not specified"}`,
      },
      {
        onSuccess: () => {
          trackEvent("speaking_form_submitted");
          setSubmitted(true);
          setForm({ name: "", email: "", org: "", event: "", event_date: "", topic: "", message: "" });
        },
      }
    );
  };

  if (submitted) {
    return (
      <section className="section-padding bg-foreground text-background py-16 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <Mic size={36} className="mx-auto mb-6 text-accent" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
            Inquiry received.
          </h2>
          <p className="opacity-75 leading-relaxed">
            Thanks for reaching out. Rovonn will review and respond within 2-3 business days.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-foreground text-background py-16 md:py-20">
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5 text-center">
          Speaking Inquiry
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6 text-center">
          Invite Rovonn{" "}
          <span className="italic text-accent">to speak.</span>
        </h2>
        <p className="opacity-70 leading-relaxed mb-10 text-center">
          Tell us about your event. We'll respond within 2-3 business days.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Organization</label>
            <input
              type="text"
              value={form.org}
              onChange={(e) => setForm({ ...form, org: e.target.value })}
              className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Event Type</label>
              <select
                value={form.event}
                onChange={(e) => setForm({ ...form, event: e.target.value })}
                className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent appearance-none cursor-pointer"
              >
                <option value="" className="bg-foreground text-background">Choose one</option>
                {eventTypes.map((opt) => (
                  <option key={opt} value={opt} className="bg-foreground text-background">{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Event Date</label>
              <input
                type="text"
                placeholder="Approximate is fine"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Topic Interest</label>
            <select
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent appearance-none cursor-pointer"
            >
              <option value="" className="bg-foreground text-background">Choose a topic</option>
              {topics.map((t) => (
                <option key={t.title} value={t.title} className="bg-foreground text-background">{t.title}</option>
              ))}
              <option value="Custom topic" className="bg-foreground text-background">Custom topic (describe below)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-2">Message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Audience size, format, anything else we should know."
              className="w-full bg-background/5 border border-background/15 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-background/40 resize-none"
            />
          </div>

          <Button type="submit" variant="dark-hero" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Submit Inquiry"} {!isPending && <ArrowRight className="ml-2" size={16} />}
          </Button>
        </form>
      </div>
    </section>
  );
};

const Speaking = () => {
  useEffect(() => {
    setSEO({
      title: "Speaking | Rovonn Russell",
      description: "Bring Rovonn in to talk about how founders and small businesses ADAPT AI to actually grow. Keynotes, workshops, and on-site training for conferences, founder summits, and leadership offsites.",
      path: "/speaking",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <TopicsSection />
    <FormSection />
  </main>
  );
};

export default Speaking;

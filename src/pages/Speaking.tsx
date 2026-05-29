import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Bot, Layers, Eye, Sparkles, BookOpen, Users, Video, Building2, MessageSquare, Briefcase, MapPin, CheckCircle2 } from "lucide-react";
import { useSpeakingInquirySubmit } from "@/hooks/use-crm-submit";
import { trackEvent } from "@/lib/analytics";
import { setSEO, resetSEO } from "@/lib/seo";

const formats = [
  { icon: Mic, label: "Keynote", duration: "30 to 60 minutes", desc: "Conference keynotes, founder summits, industry events. ADAPT, the five outcomes, or the founder economy framed for a big room." },
  { icon: Layers, label: "Workshop", duration: "Half-day or full-day", desc: "Hands-on. We walk a room of founders through ADAPT applied to THEIR specific businesses. Each leaves with an identified Virtual Employee to install on Monday." },
  { icon: Video, label: "Virtual Session", duration: "60 to 90 minutes", desc: "Zoom, Streamyard, hosted webinars. Same depth as in-person. Lower friction for distributed audiences. Recordings available for asynchronous teams." },
  { icon: Users, label: "Founder Community Talk", duration: "45 to 75 minutes", desc: "Mastermind groups, founder collectives, accelerator cohorts, peer circles. More conversational, more Q&A, more tailored to the room's specific businesses." },
  { icon: MessageSquare, label: "Fireside + Panel", duration: "30 to 45 minutes", desc: "Moderated conversation format. Good for events that want a thoughtful exchange rather than a presentation. I'm comfortable being the principal or the moderator." },
  { icon: Building2, label: "Corporate Workshop", duration: "Half-day or full-day", desc: "For agencies, professional service firms, and SMB teams. Tailored to the team's actual workflows. We identify what AI fits where and ship at least one workflow during the session." },
  { icon: Briefcase, label: "On-Site Training", duration: "1 to 3 days", desc: "Multi-day on-site engagement for organizations that want depth. Includes leadership briefing, team workshop, and a tailored install plan the company keeps." },
  { icon: MapPin, label: "Founder Retreat", duration: "1 to 2 days", desc: "Smaller, intimate groups. Often in scenic locations. Mix of keynote, workshop, and 1-on-1 advisory time. Best for premium retreats and CEO peer groups." },
];

const howIWork = [
  "Every talk is tailored. I don't have a deck I drag from event to event. I write a fresh version for your audience based on a pre-event intake call.",
  "I do a 30-minute prep call with the organizer ahead of every booking. Goal: make sure the audience leaves with something they can install on Monday, not just inspiration.",
  "I'm comfortable being the only AI speaker on the lineup or one of several. I write to land alongside whatever else is on the agenda.",
  "I bring my own visuals. Mode B flat-lay tactile cards, walking-on-camera bg-swap clips, and editorial slides in cream and charcoal. Your event AV gets a clean deliverable.",
  "If you want me to send a follow-up resource to attendees (The Edge form, The Prompt Codes PDF, a custom briefing on your industry), I include that at no extra charge.",
  "I'll record the talk for your archive if you want it. You own the footage. I just ask that I can use clips on my own channels with attribution.",
];

const audienceFits = [
  { label: "Strong fit", items: ["Founder events for businesses with 1 to 50 people", "Industry conferences in service businesses, creative, agencies", "Mastermind groups and peer circles", "Coaching certifications and accelerator cohorts", "Family business and second-generation founder events", "Black founder, Caribbean diaspora, and equity-focused founder events"] },
  { label: "Possible fit", items: ["Mid-market B2B events (we'll talk about who's in the room)", "Marketing and content conferences", "Tech conferences for builders, not consumers"] },
  { label: "Probably not a fit", items: ["Enterprise CIO conferences (my work is SMB-focused)", "Pure VC / fundraising events", "Crypto / Web3 / metaverse events"] },
];

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
  "Keynote (conference / summit)",
  "Workshop (half / full day)",
  "Virtual session (Zoom / webinar)",
  "Founder community / mastermind",
  "Fireside chat",
  "Panel discussion",
  "Corporate workshop (agency / firm)",
  "On-site training (1-3 days)",
  "Founder retreat",
  "Podcast / interview",
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

const FormatsSection = () => (
  <section className="section-padding py-16 md:py-20">
    <div className="max-w-6xl mx-auto">
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Formats</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Eight ways to bring me <span className="italic text-accent-highlight">to your audience.</span></h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {formats.map((f) => (
          <article key={f.label} className="bg-card border border-border rounded-md p-6 hover:border-accent/40 transition-colors flex flex-col">
            <div className="w-10 h-10 mb-5 rounded-md bg-accent/10 flex items-center justify-center">
              <f.icon size={18} className="text-accent-deep" />
            </div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-deep mb-2">{f.duration}</p>
            <h3 className="font-serif text-xl font-semibold leading-snug mb-3">{f.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{f.desc}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground italic mt-10 max-w-2xl">
        Don't see your format here? Ask. If your event needs a custom shape, I'll usually find a way.
      </p>
    </div>
  </section>
);

const HowIWorkSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">How I work</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-10">Tailored, prepped, <span className="italic text-accent-highlight">designed to land.</span></h2>
      <div className="space-y-5">
        {howIWork.map((line, i) => (
          <div key={i} className="flex items-start gap-4">
            <CheckCircle2 size={20} className="text-accent-deep shrink-0 mt-1" />
            <p className="text-base md:text-lg text-foreground leading-relaxed">{line}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AudienceFitSection = () => (
  <section className="section-padding py-16 md:py-20">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Audience fit</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-10">Where I land hardest <span className="italic text-accent-highlight">and where I don't.</span></h2>
      <div className="grid md:grid-cols-3 gap-5">
        {audienceFits.map((bucket) => (
          <div key={bucket.label} className="bg-card border border-border rounded-md p-6">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-deep mb-4">{bucket.label}</p>
            <ul className="space-y-2.5">
              {bucket.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-deep shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground italic mt-8 max-w-2xl">
        Not sure if your event is a fit? Submit the inquiry below anyway. I'd rather say no than have you guess.
      </p>
    </div>
  </section>
);

const PastVenuesSection = () => (
  <section className="section-padding bg-secondary py-12 md:py-16">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Recent and upcoming</p>
      <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-6">A growing list of stages and rooms.</h2>
      <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        Recent appearances and upcoming bookings appear here once confirmed. If you'd like to be the next event listed, the inquiry form is below.
      </p>
    </div>
  </section>
);

const Speaking = () => {
  useEffect(() => {
    setSEO({
      title: "Speaking | Rovonn Russell",
      description: "Bring Rovonn in to talk about how founders and small businesses ADAPT AI to actually grow. Keynotes, workshops, virtual sessions, community talks, and on-site training across North America and remote.",
      path: "/speaking",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <FormatsSection />
    <TopicsSection />
    <HowIWorkSection />
    <AudienceFitSection />
    <PastVenuesSection />
    <FormSection />
  </main>
  );
};

export default Speaking;

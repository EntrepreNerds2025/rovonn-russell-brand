import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, BookOpen, Eye, Award, Lightbulb, CheckCircle, Mic, FileText, Bot, Users, Building, Heart, Zap } from "lucide-react";

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-20 md:pb-32 relative overflow-hidden">
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6 animate-fade-in">
        Impact Story Architect
      </p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-8 animate-fade-up">
        Design the story{" "}
        <span className="italic text-accent-highlight">your work</span>{" "}
        deserves.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
        Helping organizations turn their work into stories that build trust, attract opportunity, and drive growth.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <Button variant="hero" size="lg" asChild>
          <Link to="/ai-tools">Start the Impact Story Diagnostic <ArrowRight className="ml-2" size={16} /></Link>
        </Button>
        <Button variant="hero-outline" size="lg" asChild>
          <Link to="/contact">Book a Strategy Conversation</Link>
        </Button>
      </div>
    </div>
    {/* Subtle decorative line */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-accent/30" />
  </section>
);

const ProblemSection = () => (
  <section className="section-dark section-padding">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">The Core Problem</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        The real problem isn't the work you're doing.{" "}
        <span className="text-accent-highlight italic">It's that people don't fully see it.</span>
      </h2>
      <p className="text-lg opacity-70 leading-relaxed mb-10 max-w-3xl">
        Organizations doing meaningful work often struggle to communicate their value clearly enough for people to care.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          "Donors don't feel the impact",
          "Partners don't see the opportunity",
          "The story isn't clear",
          "Important initiatives get overlooked",
          "Trust takes too long to build",
          "Messaging becomes scattered",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3 p-4 rounded border border-border/10 bg-background/5">
            <span className="text-accent-highlight mt-0.5">✕</span>
            <span className="text-sm opacity-80">{item}</span>
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold tracking-wide uppercase text-accent-highlight">
        The result? Impact Communication Failure. — Impact Story Architecture fixes that.
      </p>
    </div>
  </section>
);

const frameworkItems = [
  { icon: Target, title: "Clarity", desc: "Define your core narrative and messaging foundation." },
  { icon: BookOpen, title: "Narrative", desc: "Structure the stories that communicate your mission." },
  { icon: Award, title: "Proof", desc: "Showcase measurable results and real impact." },
  { icon: Eye, title: "Visibility", desc: "Amplify your story across the right channels." },
  { icon: Lightbulb, title: "Opportunity", desc: "Turn attention into partnerships, funding, and growth." },
];

const FrameworkSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">The Framework</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Impact Story Architecture</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Storytelling should be designed as a system, not random content. A five-part framework for organizations that want their work to be seen, understood, and supported.
        </p>
      </div>
      <div className="grid md:grid-cols-5 gap-6">
        {frameworkItems.map((item, i) => (
          <div key={item.title} className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-accent/20 flex items-center justify-center group-hover:border-accent transition-colors">
              <item.icon size={24} className="text-accent-highlight" />
            </div>
            <div className="text-xs tracking-widest uppercase text-muted-foreground mb-2">0{i + 1}</div>
            <h3 className="font-serif text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const audiences = [
  { icon: Heart, label: "Nonprofits", desc: "Communicate your mission with clarity and trust." },
  { icon: Building, label: "Mission-Driven Businesses", desc: "Stand out with authentic impact storytelling." },
  { icon: Users, label: "Foundations & Initiatives", desc: "Show the real results of your investment." },
  { icon: Zap, label: "Impact Campaigns", desc: "Build momentum through strategic narrative." },
];

const AudienceSection = () => (
  <section className="section-padding bg-secondary">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">Who This Is For</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold">Built for organizations doing meaningful work.</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {audiences.map((a) => (
          <div key={a.label} className="bg-card p-8 rounded border border-border flex gap-5 hover:border-accent/30 transition-colors">
            <a.icon size={28} className="text-accent-highlight shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-lg font-semibold mb-1">{a.label}</h3>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const caseStudies = [
  {
    title: "Community Health Initiative",
    challenge: "A health organization struggled to show impact to funders.",
    strategy: "Designed a narrative system around patient stories and measurable outcomes.",
    result: "3x increase in donor engagement within 6 months.",
  },
  {
    title: "Youth Empowerment Campaign",
    challenge: "An initiative couldn't attract corporate partners.",
    strategy: "Built a storytelling framework that positioned impact as opportunity.",
    result: "Secured 5 new partnerships and a national media feature.",
  },
  {
    title: "Environmental Impact Launch",
    challenge: "A foundation's message was lost in a crowded space.",
    strategy: "Created a documentary-style content system for launch.",
    result: "400% increase in engagement and viral social media reach.",
  },
];

const CaseStudiesSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">Case Studies</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold">Stories of transformation.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {caseStudies.map((cs) => (
          <div key={cs.title} className="border border-border rounded p-8 hover:border-accent/30 transition-colors group">
            <h3 className="font-serif text-xl font-semibold mb-4 group-hover:text-accent-highlight transition-colors">{cs.title}</h3>
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold text-accent-highlight">Challenge:</span> <span className="text-muted-foreground">{cs.challenge}</span></div>
              <div><span className="font-semibold text-accent-highlight">Strategy:</span> <span className="text-muted-foreground">{cs.strategy}</span></div>
              <div><span className="font-semibold text-accent-highlight">Result:</span> <span className="text-muted-foreground">{cs.result}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Button variant="hero-outline" asChild>
          <Link to="/case-studies">View All Case Studies <ArrowRight className="ml-2" size={16} /></Link>
        </Button>
      </div>
    </div>
  </section>
);

const tiers = [
  {
    title: "Strategy",
    items: ["Impact Story Diagnostic", "Story Audit", "Story Architecture Strategy"],
  },
  {
    title: "Advisory",
    items: ["Consulting", "Messaging & Narrative Design", "Authority Positioning"],
  },
  {
    title: "Execution",
    items: ["Impact Storytelling Media", "Campaign Storytelling", "Impact Loop Production"],
  },
];

const ServicesSection = () => (
  <section className="section-dark section-padding">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">How To Work Together</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold">Three ways to engage.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div key={tier.title} className="border border-border/10 rounded p-8 bg-background/5 hover:bg-background/10 transition-colors">
            <div className="text-xs tracking-widest uppercase text-accent-highlight mb-3">0{i + 1}</div>
            <h3 className="font-serif text-2xl font-semibold mb-6">{tier.title}</h3>
            <ul className="space-y-3">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm opacity-80">
                  <CheckCircle size={16} className="text-accent-highlight shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Button variant="dark-hero" size="lg" asChild>
          <Link to="/services">Explore Services <ArrowRight className="ml-2" size={16} /></Link>
        </Button>
      </div>
    </div>
  </section>
);

const LeadMagnetSection = () => (
  <section className="section-padding bg-secondary">
    <div className="max-w-3xl mx-auto text-center">
      <Bot size={40} className="text-accent-highlight mx-auto mb-6" />
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">AI-Powered Tool</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Impact Story Diagnostic</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Answer a few questions about your organization and receive an AI-generated storytelling clarity score, messaging insights, and actionable improvement suggestions.
      </p>
      <Button variant="hero" size="lg" asChild>
        <Link to="/ai-tools">Take the Diagnostic <ArrowRight className="ml-2" size={16} /></Link>
      </Button>
    </div>
  </section>
);

const SpeakingSection = () => (
  <section className="section-padding">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">Speaking</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Invite Rovonn to speak.</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Keynotes and workshops for conferences, leadership summits, and organizations ready to rethink how they communicate impact.
        </p>
        <Button variant="hero" asChild>
          <Link to="/speaking">Inquire About Speaking <Mic className="ml-2" size={16} /></Link>
        </Button>
      </div>
      <div className="space-y-4">
        {[
          "Impact Story Architecture",
          "Trust in the Age of AI",
          "How Organizations Build Authority Through Storytelling",
          "Storytelling for Nonprofits & Mission-Driven Brands",
        ].map((topic) => (
          <div key={topic} className="p-5 border border-border rounded flex items-center gap-4 hover:border-accent/30 transition-colors">
            <FileText size={18} className="text-accent-highlight shrink-0" />
            <span className="text-sm font-medium">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="section-padding bg-foreground text-background">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
        Ready to design the story <span className="italic">your work deserves?</span>
      </h2>
      <p className="opacity-70 mb-10 leading-relaxed">
        Start with a strategy conversation, explore the Impact Story Diagnostic, or inquire about speaking.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="dark-hero" size="lg" asChild>
          <Link to="/contact">Book a Strategy Call</Link>
        </Button>
        <Button variant="dark-outline" size="lg" asChild>
          <Link to="/ai-tools">Try the Diagnostic</Link>
        </Button>
      </div>
    </div>
  </section>
);

const Index = () => (
  <main>
    <HeroSection />
    <ProblemSection />
    <FrameworkSection />
    <AudienceSection />
    <CaseStudiesSection />
    <ServicesSection />
    <LeadMagnetSection />
    <SpeakingSection />
    <FinalCTA />
  </main>
);

export default Index;

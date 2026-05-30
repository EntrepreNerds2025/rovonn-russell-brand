import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import rovonnPortrait from "@/assets/rovonn-portrait.png";
import {
  ArrowRight,
  Bot,
  Layers,
  Target,
  MessageSquareQuote,
  TrendingUp,
  FileText,
  Building2,
  UserRoundSearch,
  Mic,
} from "lucide-react";

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6 animate-fade-in">A practical guide for founders + small business owners</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7 animate-fade-up">
          Don't just adopt AI. <span className="italic text-accent-highlight">ADAPT it.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.15s" }}>
          I help founders and small business owners build AI systems that fit the business they actually run. Hours back every week. Margin that survives the next price hike. The room to finally ship the work that's been waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="lg" asChild><Link to="/the-edge">Get Your Edge <ArrowRight className="ml-2" size={16} /></Link></Button>
          <Button variant="hero-outline" size="lg" asChild><Link to="/speaking">Speaking + workshops</Link></Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Or <Link to="/blog" className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-accent-deep transition-colors underline decoration-accent/40 underline-offset-4"><FileText size={14} /> read the blog</Link>
        </p>
      </div>
      <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-border bg-cream">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-cream to-accent-deep/15" />
          <img
            src={rovonnPortrait}
            alt="Rovonn Russell, AI Advisor for Founders and Small Business Owners"
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="eager"
          />
        </div>
        <div className="absolute -top-3 -right-3 w-24 h-24 bg-accent/30 rounded-md -z-10" />
      </div>
    </div>
  </section>
);

const PositioningSection = () => (
  <section className="section-padding bg-secondary">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">The Work I Care About</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">Most founders are adopting AI. Almost none are <span className="italic text-accent-highlight">ADAPTing it.</span></h2>
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>That's why most are still working Saturdays, eating the rising costs of every tool and every contractor, and watching the version of the business they actually wanted stay stuck on a napkin in a drawer.</p>
        <p>My work is to fix that. I help founders and small business owners figure out where AI actually fits in their specific business, install the workflows that earn their place, and keep their voice intact while we do it.</p>
      </div>
    </div>
  </section>
);

const themeItems = [
  { icon: Bot, title: "AI Workflows That Actually Fit", desc: "The right workflows for your specific business, not the loudest tools on LinkedIn. Voice-protected, founder-friendly, installed without bloat." },
  { icon: Layers, title: "The ADAPT Framework", desc: "Assess, Discover, Apply, Produce, Transform. The five-step diagnostic that figures out where AI fits before you install anything." },
  { icon: Target, title: "The Five Outcomes", desc: "Save time. Protect margin. Achieve the success you've been chasing. Stop struggling. Unlock the work that wasn't possible before." },
  { icon: MessageSquareQuote, title: "Voice as Moat", desc: "Why your craft and brand matter MORE in the AI era, not less. How to keep your voice intact while you scale." },
  { icon: TrendingUp, title: "The Founder Economy", desc: "What's actually happening to small businesses in 2026. What's working. What's just hype. Honest field notes from the trenches." },
];

const ThemesSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <div className="max-w-2xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">What I Write About</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Five lenses on how AI actually works <span className="italic text-accent-highlight">for founders.</span></h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeItems.map((item) => (
          <article key={item.title} className="border border-border bg-card rounded-md p-7 hover:border-accent/40 transition-colors group">
            <div className="w-12 h-12 mb-5 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors"><item.icon size={22} className="text-accent-deep" /></div>
            <h3 className="font-serif text-xl font-semibold mb-2.5 leading-tight">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const SpeakingSection = () => {
  const topics = ["Don't just adopt AI. ADAPT it. (the keynote)", "The Five Things Founders Actually Want From AI", "Voice as Moat: protecting your craft in the AI era", "Building AI That Fits (founder workshop)", "The Founder Economy in 2026"];
  return (
    <section className="section-padding bg-foreground text-background">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5">Bring me to your stage</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">Speaking, workshops, <span className="italic text-accent">and live training.</span></h2>
          <p className="text-base md:text-lg opacity-75 leading-relaxed mb-8">Keynotes, hands-on workshops, founder community talks, virtual sessions, and on-site training. For events that want their founders and small business operators to leave with something they can install on Monday.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="dark-hero" size="lg" asChild><Link to="/speaking">See speaking options <ArrowRight className="ml-2" size={16} /></Link></Button>
            <Button variant="dark-outline" size="lg" asChild><Link to="/the-edge">Get Your Edge first</Link></Button>
          </div>
          <p className="text-xs opacity-50 mt-4">In-person across North America. Virtual anywhere.</p>
        </div>
        <div className="border border-background/15 bg-background/5 rounded-md p-7 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent mb-5">Topics I speak on</p>
          <ul className="space-y-3.5">
            {topics.map((item) => (<li key={item} className="flex items-start gap-3 text-sm md:text-base opacity-90"><span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent" /><span>{item}</span></li>))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const ArticlesSection = () => {
  const posts = getAllPosts().slice(0, 3);
  const hasPosts = posts.length > 0;

  return (
    <section className="section-padding bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Latest Articles</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Field notes on AI, ADAPT, and the <span className="italic text-accent-highlight">founder economy.</span></h2>
          </div>
          <Button variant="hero-outline" asChild><Link to="/blog">Read the Blog <ArrowRight className="ml-2" size={14} /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {hasPosts ? (
            posts.map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`} className="group block bg-card border border-border rounded-md p-7 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={14} className="text-accent-deep" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-accent-deep">{a.category}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{formatPostDate(a.date)}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold leading-snug mb-3 group-hover:text-accent-deep transition-colors">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
                <p className="mt-5 text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">Read article <ArrowRight size={14} /></p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-3 border border-border rounded-md p-12 text-center bg-card">
              <p className="text-muted-foreground mb-6">First posts dropping soon. The Edge is the fastest way to start now.</p>
              <Button variant="default" asChild>
                <Link to="/the-edge">Get Your Edge <ArrowRight className="ml-2" size={14} /></Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const workWithMeCards = [
  { icon: UserRoundSearch, title: "For Founders + Small Business Owners", desc: "Advisory, ADAPT Strategy Sprints, and the Virtual Employees we install in your business with my team at EntrepreNerds.", cta: "See How We Work Together", href: "/work-with-me", external: false },
  { icon: Mic, title: "For Events and Teams", desc: "Keynotes, workshops, and on-site training on AI for the founder economy. In-person and remote.", cta: "View Speaking Topics", href: "/speaking", external: false },
  { icon: Building2, title: "For Nonprofits + CSR Teams", desc: "Cinematic storytelling, content systems, and ADAPT training for mission-driven organizations.", cta: "Explore Impact Loop", href: "https://impactloop.ca", external: true },
];

const WorkWithMeSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Want to Go Deeper?</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Three ways to work <span className="italic text-accent-highlight">together.</span></h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {workWithMeCards.map((card) => {
          const Inner = (
            <>
              <div className="w-12 h-12 mb-6 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors"><card.icon size={22} className="text-accent-deep" /></div>
              <h3 className="font-serif text-xl font-semibold mb-3 leading-tight">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">{card.desc}</p>
              <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-accent-deep transition-all">{card.cta} <ArrowRight size={14} /></p>
            </>
          );
          const className = "group flex flex-col bg-card border border-border rounded-md p-7 hover:border-accent/40 transition-colors";
          return card.external
            ? (<a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer" className={className}>{Inner}</a>)
            : (<Link key={card.title} to={card.href} className={className}>{Inner}</Link>);
        })}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="section-dark section-padding">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">When You're Ready</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">Don't just adopt AI. <span className="italic text-accent">ADAPT it.</span></h2>
      <p className="opacity-70 mb-10 leading-relaxed text-base md:text-lg">The Edge is a 90-second form. I write back personally within 24 hours with the first AI workflow I'd install in your business.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="dark-hero" size="lg" asChild><Link to="/the-edge">Get Your Edge</Link></Button>
        <Button variant="dark-outline" size="lg" asChild><Link to="/book">Book a call</Link></Button>
        <Button variant="dark-outline" size="lg" asChild><Link to="/speaking">Speaking + workshops</Link></Button>
      </div>
    </div>
  </section>
);

const Index = () => {
  useEffect(() => {
    trackEvent("personal_brand_home_viewed");
    setSEO({
      title: "Rovonn Russell | AI Advisor for Founders and Small Business Owners",
      description: "I help founders and small business owners build AI systems that fit the business they actually run. Hours back, margin held, the project on the napkin finally shipped. Don't just adopt AI. ADAPT it.",
      path: "/",
    });
    return resetSEO;
  }, []);

  return (
    <main>
      <HeroSection />
      <PositioningSection />
      <ThemesSection />
      <SpeakingSection />
      <ArticlesSection />
      <WorkWithMeSection />
      <FinalCTA />
    </main>
  );
};

export default Index;

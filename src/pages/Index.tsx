import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Bot,
  Eye,
  Sparkles,
  FileText,
  Building2,
  UserRoundSearch,
  Mic,
} from "lucide-react";

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6 animate-fade-in">Storytelling + Systems</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7 animate-fade-up">
          Storytelling, systems, and AI for people building <span className="italic text-accent-highlight">something that matters.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.15s" }}>
          I help founders, businesses, and impact-driven leaders turn their ideas, expertise, and work into visibility, trust, and practical systems.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="lg" asChild><Link to="/start-here">Start Here <ArrowRight className="ml-2" size={16} /></Link></Button>
          <Button variant="hero-outline" size="lg" asChild><Link to="/resources">Explore Resources</Link></Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Or <Link to="/blog" className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-accent-deep transition-colors underline decoration-accent/40 underline-offset-4"><FileText size={14} /> read the blog</Link>
        </p>
      </div>
      <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-border bg-cream">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent-deep/10" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end gap-3">
            <div className="bg-card border border-border rounded-md p-4 shadow-sm transform -rotate-2 ml-2">
              <div className="flex items-center gap-2 mb-2"><Bot size={14} className="text-accent-deep" /><span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">AI for Real Work</span></div>
              <div className="h-1.5 bg-foreground/80 rounded w-3/4 mb-1.5" /><div className="h-1.5 bg-foreground/30 rounded w-1/2" />
            </div>
            <div className="bg-foreground text-background border border-foreground rounded-md p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2"><Layers size={14} className="text-accent" /><span className="text-[10px] font-semibold tracking-widest uppercase opacity-70">Visibility System</span></div>
              <div className="h-1.5 bg-background/80 rounded w-2/3 mb-1.5" /><div className="h-1.5 bg-background/40 rounded w-1/2" />
            </div>
            <div className="bg-card border border-border rounded-md p-4 shadow-sm transform rotate-1 mr-2">
              <div className="flex items-center gap-2 mb-2"><BookOpen size={14} className="text-accent-deep" /><span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Story Capture</span></div>
              <div className="h-1.5 bg-foreground/80 rounded w-1/2 mb-1.5" /><div className="h-1.5 bg-foreground/30 rounded w-2/3" />
            </div>
          </div>
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
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">Great work should not stay <span className="italic text-accent-highlight">invisible.</span></h2>
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>A lot of people are doing meaningful work, building useful ideas, and carrying valuable knowledge, but they struggle to turn it into clear stories, consistent content, and systems that create leverage.</p>
        <p>That is the work I care about. I help people communicate what they do, organize what they know, and use practical AI to create more visibility, trust, and opportunity.</p>
      </div>
    </div>
  </section>
);

const themeItems = [
  { icon: BookOpen, title: "Storytelling That Builds Trust", desc: "How to turn ideas, work, and impact into stories people understand, remember, and support." },
  { icon: Layers, title: "Visibility Systems", desc: "How to create content consistently without burning out or posting randomly." },
  { icon: Bot, title: "Practical AI for Real Work", desc: "How to tailor AI and systems to what your work actually needs. Judgment first, tools second. Home of the ADAPT framework I teach." },
  { icon: Eye, title: "Building in Public", desc: "Lessons from building Impact Loop, Nerds Creative, ADAPT, and my own personal brand." },
  { icon: Sparkles, title: "Knowledge-to-Asset Creation", desc: "How to turn expertise into lead magnets, toolkits, workshops, digital products, and resources." },
];

const ThemesSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <div className="max-w-2xl mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">What I Talk About</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Five things I think about, write about, and build around.</h2>
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

const StarterKitSection = () => {
  const includes = ["10 AI prompts for content + clarity", "5 content angles you can use this week", "Event-to-content checklist", "A weekly content system template", "Story capture worksheet"];
  return (
    <section className="section-padding bg-foreground text-background">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-5">Featured Resource</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">Start turning your ideas into <span className="italic text-accent">visibility.</span></h2>
          <p className="text-base md:text-lg opacity-75 leading-relaxed mb-8">Get a practical starter kit with prompts, content angles, and a simple system for turning your ideas, work, or expertise into content people can understand and act on.</p>
          <Button variant="dark-hero" size="lg" asChild><Link to="/resources/visibility-starter-kit">Get the Starter Kit <ArrowRight className="ml-2" size={16} /></Link></Button>
          <p className="text-xs opacity-50 mt-4">Free. No spam. Unsubscribe anytime.</p>
        </div>
        <div className="border border-background/15 bg-background/5 rounded-md p-7 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent mb-5">The Visibility Starter Kit</p>
          <ul className="space-y-3.5">
            {includes.map((item) => (<li key={item} className="flex items-start gap-3 text-sm md:text-base opacity-90"><span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent" /><span>{item}</span></li>))}
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
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Field notes on storytelling, systems, and AI.</h2>
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
              <p className="text-muted-foreground mb-6">First posts dropping soon. The Visibility Starter Kit is the fastest way to start now.</p>
              <Button variant="default" asChild>
                <Link to="/resources/visibility-starter-kit">Get the Starter Kit <ArrowRight className="ml-2" size={14} /></Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const workWithMeCards = [
  { icon: Building2, title: "For Organizations", desc: "Need storytelling, content visibility, ADAPT training, or campaign support for your organization?", cta: "Explore Impact Loop", href: "https://impactloop.ca", external: true },
  { icon: UserRoundSearch, title: "For Leaders and Entrepreneurs", desc: "Want advisory, workshops, or help building your own visibility and AI-supported systems?", cta: "Work With Rovonn", href: "/work-with-me", external: false },
  { icon: Mic, title: "For Events and Teams", desc: "Bring Rovonn in to speak or teach on storytelling, visibility, content systems, and practical AI.", cta: "View Speaking Topics", href: "/speaking", external: false },
];

const WorkWithMeSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">Want to Go Deeper?</p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Three ways to work together.</h2>
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
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">Build Visibility</p>
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">Build visibility around the work that <span className="italic text-accent">matters.</span></h2>
      <p className="opacity-70 mb-10 leading-relaxed text-base md:text-lg">Start with the Visibility Starter Kit, read the blog, or explore Impact Loop for your organization.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="dark-hero" size="lg" asChild><Link to="/resources/visibility-starter-kit">Get the Starter Kit</Link></Button>
        <Button variant="dark-outline" size="lg" asChild><Link to="/blog">Read the Blog</Link></Button>
        <Button variant="dark-outline" size="lg" asChild><a href="https://impactloop.ca" target="_blank" rel="noopener noreferrer">Explore Impact Loop</a></Button>
      </div>
    </div>
  </section>
);

const Index = () => {
  useEffect(() => {
    trackEvent("personal_brand_home_viewed");
    setSEO({
      title: "Rovonn Russell | Storytelling, Systems and AI",
      description: "Rovonn Russell helps founders, businesses, and impact-driven leaders turn their ideas, expertise, and work into visibility, trust, and practical systems using storytelling, content, and AI.",
      path: "/",
    });
    return resetSEO;
  }, []);

  return (
    <main>
      <HeroSection />
      <PositioningSection />
      <ThemesSection />
      <StarterKitSection />
      <ArticlesSection />
      <WorkWithMeSection />
      <FinalCTA />
    </main>
  );
};

export default Index;

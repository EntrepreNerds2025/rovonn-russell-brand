import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ArrowUpRight, PlayCircle, Youtube as YoutubeIcon } from "lucide-react";
import { setSEO, resetSEO } from "@/lib/seo";

const YOUTUBE_URL = import.meta.env.VITE_YOUTUBE_URL || "https://youtube.com";

interface Video {
  title: string;
  desc: string;
  duration: string;
  href: string;
}

interface Playlist {
  category: string;
  tagline: string;
  videos: Video[];
}

const playlists: Playlist[] = [
  {
    category: "AI for Business",
    tagline: "Practical AI workflows for founders, operators, and small teams.",
    videos: [
      { title: "5 AI workflows for small teams", desc: "Content ideation, drafting, repurposing, summarizing, reporting.", duration: "12 min", href: YOUTUBE_URL },
      { title: "Why your AI agents are failing 41% of the time", desc: "The math nobody tells you about chaining LLM calls.", duration: "8 min", href: YOUTUBE_URL },
      { title: "How I built an inbox triager that saves 8 hours a week", desc: "The architecture behind a working AI agent.", duration: "14 min", href: YOUTUBE_URL },
    ],
  },
  {
    category: "AI for Impact",
    tagline: "How nonprofits and mission-driven teams can use AI without losing the human side.",
    videos: [
      { title: "How nonprofits can use AI without losing their human voice", desc: "The ADAPT framework for impact organizations.", duration: "10 min", href: YOUTUBE_URL },
      { title: "AI ethics for impact-led teams", desc: "What to think about before you turn the model on your community.", duration: "11 min", href: YOUTUBE_URL },
    ],
  },
  {
    category: "Storytelling and Visibility",
    tagline: "Turning ideas, work, and expertise into content that actually lands.",
    videos: [
      { title: "Most organizations don't have a content problem", desc: "They have a capture problem. Here's the fix.", duration: "9 min", href: YOUTUBE_URL },
      { title: "How I use AI to build visibility systems", desc: "Practical, repeatable, impactful.", duration: "13 min", href: YOUTUBE_URL },
      { title: "5 content angles for finding stories in your work", desc: "Behind-the-scenes, the lesson, the contrarian, the process, the result.", duration: "8 min", href: YOUTUBE_URL },
    ],
  },
  {
    category: "Content Systems",
    tagline: "Build once. Use forever. Without burning out.",
    videos: [
      { title: "Turn one event into 20 pieces of content", desc: "A simple system that multiplies your impact.", duration: "10 min", href: YOUTUBE_URL },
      { title: "The weekly content rhythm that doesn't burn out", desc: "Mon/Wed/Fri, 80 minutes total, real work as source material.", duration: "9 min", href: YOUTUBE_URL },
    ],
  },
  {
    category: "Building in Public",
    tagline: "Lessons from building Impact Loop, Nerds Creative, ADAPT, and the personal brand.",
    videos: [
      { title: "Behind the scenes: building 15 AI agents for a storytelling company", desc: "Three architectural mistakes I had to unlearn.", duration: "16 min", href: YOUTUBE_URL },
      { title: "Why I split my brand into three", desc: "House-of-brands strategy for founders running multiple ventures.", duration: "11 min", href: YOUTUBE_URL },
    ],
  },
  {
    category: "Personal Brand and Digital Assets",
    tagline: "How to turn your expertise into compounding digital assets.",
    videos: [
      { title: "From knowledge to assets", desc: "Turning expertise into lead magnets, courses, and toolkits.", duration: "12 min", href: YOUTUBE_URL },
      { title: "How I built my personal brand from scratch", desc: "The specific decisions, the timeline, the mistakes.", duration: "15 min", href: YOUTUBE_URL },
    ],
  },
];

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        On YouTube
      </p>
      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-8">
        Storytelling, systems, and AI{" "}
        <span className="italic text-accent-highlight">in practice.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
        Tutorials, frameworks, and field notes from building Impact Loop, ADAPT, and the personal brand. New videos most weeks.
      </p>
      <Button variant="hero" size="lg" asChild>
        <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          <YoutubeIcon className="mr-2" size={16} /> Subscribe on YouTube
        </a>
      </Button>
    </div>
  </section>
);

const VideoCard = ({ video }: { video: Video }) => (
  <a
    href={video.href}
    target="_blank"
    rel="noopener noreferrer"
    className="group block"
  >
    <div className="aspect-video rounded-md bg-secondary border border-border overflow-hidden relative mb-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-deep/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-foreground/85 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
          <PlayCircle className="text-background" size={26} />
        </div>
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-foreground/85 text-background text-[10px] font-medium tracking-wide">
        {video.duration}
      </div>
    </div>
    <h3 className="font-serif text-lg font-semibold leading-snug mb-2 group-hover:text-accent-deep transition-colors">
      {video.title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{video.desc}</p>
  </a>
);

const PlaylistsSection = () => (
  <section className="section-padding bg-secondary py-16 md:py-20">
    <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
      {playlists.map((pl) => (
        <div key={pl.category}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-2">
                Playlist
              </p>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold leading-tight mb-2">
                {pl.category}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground italic font-serif max-w-2xl">
                {pl.tagline}
              </p>
            </div>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5 hover:gap-2.5 hover:text-accent-deep transition-all whitespace-nowrap"
            >
              View playlist <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pl.videos.map((v) => (
              <VideoCard key={v.title} video={v} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="section-padding bg-foreground text-background py-16 md:py-20">
    <div className="max-w-3xl mx-auto text-center">
      <YoutubeIcon size={36} className="mx-auto mb-6 text-accent" />
      <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
        New videos{" "}
        <span className="italic text-accent">most weeks.</span>
      </h2>
      <p className="opacity-70 leading-relaxed mb-10 text-base md:text-lg max-w-2xl mx-auto">
        Subscribe so you don't miss the next one. The whole archive lives here too — pick the playlist that fits where you are.
      </p>
      <Button variant="dark-hero" size="lg" asChild>
        <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          <YoutubeIcon className="mr-2" size={16} /> Subscribe on YouTube
        </a>
      </Button>
    </div>
  </section>
);

const YouTubePage = () => {
  useEffect(() => {
    setSEO({
      title: "Videos | Rovonn Russell",
      description: "Storytelling, systems, and AI in practice. Tutorials, frameworks, and field notes from building Impact Loop, ADAPT, and the personal brand.",
      path: "/youtube",
    });
    return resetSEO;
  }, []);

  return (
  <main>
    <HeroSection />
    <PlaylistsSection />
    <FinalCTA />
  </main>
  );
};

export default YouTubePage;

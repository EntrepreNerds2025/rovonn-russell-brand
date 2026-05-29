import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => (
  <main>
    <section className="section-padding pt-32 md:pt-40">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">About</p>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">
          The story behind{" "}
          <span className="italic text-accent-highlight">ADAPT.</span>
        </h1>
        <div className="prose max-w-none text-muted-foreground space-y-6 text-lg leading-relaxed">
          <p>I spent most of my career sitting in two rooms.</p>
          <p>
            In one room: technical people building AI systems. In the other: founders, creators, and small business owners trying to figure out what any of it had to do with the business they actually ran. The two rooms didn't talk to each other.
          </p>
          <p>
            The technical people built tools. The tools were powerful. But they were designed for people who already knew what they wanted. The founders didn't know what they wanted. They knew what was eating their week. They knew the project they'd been meaning to ship for three years. They knew the margin slipping while costs climbed. None of the tools they were being sold actually fit those problems.
          </p>
          <p>
            So most of them did one of three things. They rejected AI entirely, complaining about it on LinkedIn and waiting for the bubble to pop. They watched, telling themselves they'd look into it next quarter. Or they bought subscription after subscription and watched the tools sit unused inside a month.
          </p>
          <p>None of that worked. So I built a fourth path.</p>
          <p>
            <strong className="text-foreground">ADAPT is a five-step diagnostic. Assess, Discover, Apply, Produce, Transform.</strong> It figures out where AI actually fits in YOUR specific business before you install anything. It's the difference between adopting a tool and ADAPTing it to the work you do. Adopting gets you a subscription. ADAPTing gets you your hours back, your margin held, and the project you've been sketching for three years, finally shipped.
          </p>
          <p>I help founders and small business owners use it.</p>
          <p>
            This personal brand at rovonnrussell.com is where I teach the framework, write about what's actually working, and offer <strong className="text-foreground">The Edge</strong>. A 90-second form that gets you a personal email back with the first AI workflow I'd install in your specific business. The Edge is free. The Advisory work is paid.
          </p>
          <p>
            With my team at <strong className="text-foreground">EntrepreNerds</strong>, we also build the larger systems for businesses that need a Virtual Employee installed, not just advised on. I lead the strategy. The team leads the build.
          </p>
          <p>
            I also run <strong className="text-foreground">Impact Loop</strong>, a studio that delivers ADAPT and cinematic storytelling for nonprofits, foundations, and CSR teams.
          </p>
          <p>If you want to know where to start, take The Edge.</p>
          <p className="text-foreground font-medium">Don't just adopt AI. ADAPT it.</p>
          <p>— Rovonn</p>
        </div>
        <div className="mt-12">
          <Button variant="hero" size="lg" asChild>
            <Link to="/the-edge">Get Your Edge <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
);

export default About;

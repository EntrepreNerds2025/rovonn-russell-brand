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
          <span className="italic text-accent-highlight">Impact Story Architecture.</span>
        </h1>
        <div className="prose max-w-none text-muted-foreground space-y-6 text-lg leading-relaxed">
          <p>
            Too much meaningful work goes unseen. Not because it isn't impactful — but because the story isn't designed to be heard.
          </p>
          <p>
            Rovonn Russell spent years producing visual stories for organizations, and noticed a pattern: even the most powerful missions fail to connect when the storytelling is fragmented, reactive, or unclear.
          </p>
          <p>
            That realization led to the creation of <strong className="text-foreground">Impact Story Architecture</strong> — a discipline that treats storytelling not as content, but as infrastructure. A system designed to communicate mission, results, and value with clarity and consistency.
          </p>
          <p>
            As an Impact Story Architect, Rovonn works with nonprofits, foundations, mission-driven businesses, and social impact organizations to design storytelling systems that build trust faster, attract opportunity, and amplify the work that matters.
          </p>
          <p>
            <strong className="text-foreground">Impact Loop</strong> — the production studio Rovonn also founded — operationalizes Impact Story Architecture through <strong className="text-foreground">The Storytelling Standard</strong>, a production playbook for documentary-style media, campaign content, and narrative-driven assets.
          </p>
          <p>
            The vision is simple: every organization doing meaningful work deserves a story system that matches the quality of their impact.
          </p>
        </div>
        <div className="mt-12">
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Start a Conversation <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
);

export default About;

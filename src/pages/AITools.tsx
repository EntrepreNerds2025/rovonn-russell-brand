import { Bot, BarChart3, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const tools = [
  {
    icon: Bot,
    title: "Impact Story Diagnostic",
    desc: "Answer questions about your organization and receive an AI-generated storytelling clarity score, messaging insights, and actionable improvement suggestions.",
    cta: "Take the Diagnostic",
  },
  {
    icon: BarChart3,
    title: "Authority Content Planner",
    desc: "Get a personalized content strategy plan that positions your organization as an authority in your space through strategic storytelling.",
    cta: "Plan Your Content",
  },
  {
    icon: Search,
    title: "Story Clarity Analyzer",
    desc: "Paste your current messaging or about page and receive an analysis of clarity, narrative strength, and areas for improvement.",
    cta: "Analyze Your Story",
  },
];

const AITools = () => {
  const [email, setEmail] = useState("");

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">AI Tools</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Interactive storytelling tools.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered tools designed to help you assess, plan, and improve your organization's storytelling — then connect with Rovonn for deeper strategy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div key={tool.title} className="border border-border rounded p-8 text-center hover:border-accent/30 transition-colors group">
                <tool.icon size={36} className="text-accent-highlight mx-auto mb-5" />
                <h2 className="font-serif text-xl font-semibold mb-3 group-hover:text-accent-highlight transition-colors">{tool.title}</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{tool.desc}</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full border border-border bg-background rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button variant="hero" className="w-full" size="default">
                    {tool.cta} <ArrowRight className="ml-2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AITools;

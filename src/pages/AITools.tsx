import { Bot, BarChart3, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToolSignupSubmit } from "@/hooks/use-crm-submit";

const tools = [
  {
    icon: Bot,
    title: "Impact Story Diagnostic",
    desc: "Answer questions about your organization and receive an AI-generated storytelling clarity score, messaging insights, and actionable improvement suggestions.",
    cta: "Take the Diagnostic",
    toolName: "impact_story_diagnostic",
  },
  {
    icon: BarChart3,
    title: "Authority Content Planner",
    desc: "Get a personalized content strategy plan that positions your organization as an authority in your space through strategic storytelling.",
    cta: "Plan Your Content",
    toolName: "authority_content_planner",
  },
  {
    icon: Search,
    title: "Story Clarity Analyzer",
    desc: "Paste your current messaging or about page and receive an analysis of clarity, narrative strength, and areas for improvement.",
    cta: "Analyze Your Story",
    toolName: "story_clarity_analyzer",
  },
];

const AITools = () => {
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const { mutate, isPending } = useToolSignupSubmit();

  const handleSubmit = (toolName: string) => {
    const email = emails[toolName];
    if (!email) return;
    mutate(
      { email, tool_name: toolName },
      {
        onSuccess: () => {
          setSubmitted((prev) => ({ ...prev, [toolName]: true }));
          setEmails((prev) => ({ ...prev, [toolName]: "" }));
        },
      }
    );
  };

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
                {submitted[tool.toolName] ? (
                  <p className="text-sm text-accent-highlight font-semibold">✓ You're signed up!</p>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full border border-border bg-background rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      value={emails[tool.toolName] || ""}
                      onChange={(e) => setEmails((prev) => ({ ...prev, [tool.toolName]: e.target.value }))}
                    />
                    <Button
                      variant="hero"
                      className="w-full"
                      size="default"
                      onClick={() => handleSubmit(tool.toolName)}
                      disabled={isPending}
                    >
                      {isPending ? "Signing up..." : tool.cta} {!isPending && <ArrowRight className="ml-2" size={14} />}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AITools;

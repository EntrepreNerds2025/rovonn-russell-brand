import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  { title: "What Is Impact Story Architecture?", category: "Framework", date: "Mar 2026", desc: "An introduction to the discipline of designing storytelling systems for mission-driven organizations." },
  { title: "Why Your Impact Report Isn't Working", category: "Storytelling Strategy", date: "Feb 2026", desc: "The gap between doing great work and communicating it — and how to close it." },
  { title: "Trust Is Built Through Story, Not Data", category: "Authority Building", date: "Feb 2026", desc: "How narrative creates the trust that statistics alone never can." },
  { title: "The 5-Part Framework for Impact Communication", category: "Framework", date: "Jan 2026", desc: "Clarity, Narrative, Proof, Visibility, Opportunity — broken down." },
  { title: "Storytelling in the Age of AI", category: "Impact Communication", date: "Jan 2026", desc: "Why human-centered storytelling matters more, not less, as AI reshapes content." },
  { title: "Campaign Storytelling That Actually Converts", category: "Campaign Storytelling", date: "Dec 2025", desc: "How to design story-driven campaigns that move people to action." },
];

const Insights = () => (
  <main>
    <section className="section-padding pt-32 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">Insights</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Thought leadership hub.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-16 leading-relaxed">
          Articles, frameworks, and insights on storytelling strategy, impact communication, and authority building.
        </p>
        <div className="space-y-6">
          {articles.map((a) => (
            <article key={a.title} className="border border-border rounded p-6 md:p-8 hover:border-accent/30 transition-colors group cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <FileText size={20} className="text-accent-highlight shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold tracking-wider uppercase text-accent-highlight">{a.category}</span>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <h2 className="font-serif text-lg md:text-xl font-semibold mb-1 group-hover:text-accent-highlight transition-colors">{a.title}</h2>
                    <p className="text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-muted-foreground group-hover:text-accent-highlight transition-colors shrink-0 mt-2" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Insights;

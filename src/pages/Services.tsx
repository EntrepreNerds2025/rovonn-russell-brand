import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const categories = [
  {
    title: "AI Advisorure Strategy",
    items: ["Narrative Design", "Messaging Clarity", "Story Frameworks", "Impact Story Diagnostic"],
  },
  {
    title: "Authority Content Strategy",
    items: ["Thought Leadership Systems", "Story-Driven Content", "Authority Positioning"],
  },
  {
    title: "Impact Media Production",
    items: ["Documentary Storytelling", "Initiative Storytelling", "Campaign Storytelling"],
  },
  {
    title: "Workshops & Speaking",
    items: ["Impact Storytelling Workshops", "Trust-Building Communication Training", "Conference Keynotes"],
  },
  {
    title: "Advisory",
    items: ["Strategic Storytelling Advisor", "Communications Advisor", "Narrative Consulting"],
  },
];

const Services = () => (
  <main>
    <section className="section-padding pt-32 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">Services</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">How we work together.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-16 leading-relaxed">
          From strategy to execution - every engagement is designed to help your organization communicate impact with clarity and authority.
        </p>
        <div className="space-y-8">
          {categories.map((cat, i) => (
            <div key={cat.title} className="border border-border rounded p-8 hover:border-accent/30 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-xs tracking-widest uppercase text-accent-highlight font-semibold">0{i + 1}</span>
                <h2 className="font-serif text-2xl font-semibold">{cat.title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 ml-8">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-accent-highlight shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Book a Strategy Conversation <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
);

export default Services;

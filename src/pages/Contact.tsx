import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", org: "", interest: "", message: "" });

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">Contact</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Let's start a <span className="italic text-accent-highlight">conversation.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Whether you're interested in strategy, speaking, consulting, or storytelling production — this is where it begins.
          </p>
          <div className="bg-card border border-border rounded p-8 md:p-10">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {(["name", "email"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">Organization</label>
                <input
                  className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">Interest</label>
                <select
                  className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="strategy">Strategy Conversation</option>
                  <option value="speaking">Speaking Inquiry</option>
                  <option value="consulting">Consulting</option>
                  <option value="production">Storytelling Production</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">Message</label>
              <textarea
                className="w-full border border-border bg-background rounded px-4 py-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button variant="hero" size="lg" className="w-full">
              Send Message <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;

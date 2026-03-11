import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";
import { useSpeakingInquirySubmit } from "@/hooks/use-crm-submit";

const topics = [
  {
    title: "Impact Story Architecture",
    desc: "How to design storytelling as a system — not just content — to build trust and attract opportunity.",
  },
  {
    title: "Trust in the Age of AI",
    desc: "Why authentic, human-centered storytelling matters more than ever in an AI-saturated world.",
  },
  {
    title: "How Organizations Build Authority Through Storytelling",
    desc: "The strategic framework behind organizations that are known, trusted, and supported.",
  },
  {
    title: "Storytelling for Nonprofits & Mission-Driven Brands",
    desc: "Practical approaches to communicating impact that resonates with donors, partners, and communities.",
  },
];

const Speaking = () => {
  const [form, setForm] = useState({ name: "", email: "", org: "", event: "", message: "" });
  const { mutate, isPending } = useSpeakingInquirySubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    mutate(form, {
      onSuccess: () => setForm({ name: "", email: "", org: "", event: "", message: "" }),
    });
  };

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">Speaking</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Invite Rovonn to <span className="italic text-accent-highlight">speak.</span>
              </h1>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Keynotes and workshops for conferences, leadership summits, and organizations ready to rethink how they communicate impact.
              </p>
              <h2 className="font-serif text-xl font-semibold mb-6">Key Topics</h2>
              <div className="space-y-4">
                {topics.map((t) => (
                  <div key={t.title} className="border border-border rounded p-5 hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic size={16} className="text-accent-highlight" />
                      <h3 className="font-semibold text-sm">{t.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded p-8">
                <h2 className="font-serif text-xl font-semibold mb-6">Booking Inquiry</h2>
                <div className="space-y-4">
                  {(["name", "email", "org", "event"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                        {field === "org" ? "Organization" : field === "event" ? "Event Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        required={field === "name" || field === "email"}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">Message</label>
                    <textarea
                      className="w-full border border-border bg-background rounded px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" className="w-full" size="lg" type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Inquiry"} {!isPending && <ArrowRight className="ml-2" size={16} />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Speaking;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useContactFormSubmit } from "@/hooks/use-crm-submit";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const isStudio = topic === "studio";

  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    interest: isStudio ? "studio" : "",
    message: "",
  });

  // Studio-specific intake fields (only used when topic=studio)
  const [studio, setStudio] = useState({
    projectType: "",
    timeline: "",
    budget: "",
    brief: "",
  });

  const { mutate, isPending } = useContactFormSubmit();

  // If user lands directly on /contact?topic=studio, pre-set the interest dropdown
  useEffect(() => {
    if (isStudio && form.interest === "") {
      setForm((f) => ({ ...f, interest: "studio" }));
    }
  }, [isStudio, form.interest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    // For Studio inquiries, pack intake fields into the message
    let composedMessage = form.message;
    if (isStudio) {
      composedMessage = [
        "[STUDIO INQUIRY]",
        studio.projectType ? `Project type: ${studio.projectType}` : null,
        studio.timeline ? `Timeline: ${studio.timeline}` : null,
        studio.budget ? `Budget range: ${studio.budget}` : null,
        studio.brief ? `Brief:\n${studio.brief}` : null,
        form.message ? `Additional notes:\n${form.message}` : null,
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    mutate(
      { ...form, message: composedMessage },
      {
        onSuccess: () => {
          setForm({ name: "", email: "", org: "", interest: isStudio ? "studio" : "", message: "" });
          setStudio({ projectType: "", timeline: "", budget: "", brief: "" });
        },
      }
    );
  };

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">
            {isStudio ? "Studio Inquiry" : "Contact"}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {isStudio ? (
              <>
                Tell me about your <span className="italic text-accent-highlight">project.</span>
              </>
            ) : (
              <>
                Let's start a <span className="italic text-accent-highlight">conversation.</span>
              </>
            )}
          </h1>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            {isStudio
              ? "Selective intake, five to eight projects per year. I'll respond within 48 hours with whether your project is a fit, and if so, what the next step looks like. No pitch sequence, no follow-up funnel."
              : "Whether you're interested in strategy, speaking, consulting, or storytelling production — this is where it begins."}
          </p>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded p-8 md:p-10">
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
                    required
                  />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                  {isStudio ? "Company" : "Organization"}
                </label>
                <input
                  className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                  Interest
                </label>
                <select
                  className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="studio">Studio (Cinematic Production)</option>
                  <option value="strategy">Strategy Conversation</option>
                  <option value="speaking">Speaking Inquiry</option>
                  <option value="consulting">Consulting</option>
                  <option value="production">Storytelling Production</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {isStudio && (
              <div className="space-y-4 mb-4 pb-2 border-t border-border pt-6">
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-accent-deep mb-2">
                  Project Details
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                      Project type
                    </label>
                    <select
                      className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      value={studio.projectType}
                      onChange={(e) => setStudio({ ...studio, projectType: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="Brand film">Brand film</option>
                      <option value="Founder narrative">Founder narrative</option>
                      <option value="Campaign centerpiece">Campaign centerpiece</option>
                      <option value="Executive thought leadership">Executive thought leadership</option>
                      <option value="Product launch film">Product launch film</option>
                      <option value="Other / not sure yet">Other / not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                      Timeline
                    </label>
                    <select
                      className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      value={studio.timeline}
                      onChange={(e) => setStudio({ ...studio, timeline: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="ASAP (within 4 weeks)">ASAP (within 4 weeks)</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="3+ months / flexible">3+ months / flexible</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                    Budget range
                  </label>
                  <select
                    className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    value={studio.budget}
                    onChange={(e) => setStudio({ ...studio, budget: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="$15K - $25K">$15K - $25K</option>
                    <option value="$25K - $50K">$25K - $50K</option>
                    <option value="$50K+">$50K+</option>
                    <option value="Need guidance on budget">Need guidance on budget</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                    Brief — what story are you trying to tell?
                  </label>
                  <textarea
                    className="w-full border border-border bg-background rounded px-4 py-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                    value={studio.brief}
                    onChange={(e) => setStudio({ ...studio, brief: e.target.value })}
                    placeholder="Who's it for, what's the moment, what does success look like?"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1 block">
                {isStudio ? "Anything else?" : "Message"}
              </label>
              <textarea
                className="w-full border border-border bg-background rounded px-4 py-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={isStudio ? "Optional: anything else I should know" : ""}
              />
            </div>
            <Button variant="hero" size="lg" className="w-full" type="submit" disabled={isPending}>
              {isPending
                ? "Sending..."
                : isStudio
                ? "Submit project inquiry"
                : "Send Message"}{" "}
              {!isPending && <ArrowRight className="ml-2" size={16} />}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;

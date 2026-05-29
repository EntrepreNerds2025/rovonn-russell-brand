import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlogFAQ } from "@/lib/blog";

interface FAQSectionProps {
  faqs: BlogFAQ[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
    const id = "faq-jsonld";
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      const node = document.getElementById(id);
      if (node) node.remove();
    };
  }, [faqs]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="border-t border-border pt-12 mt-12">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-3">
        Frequently Asked
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-8">
        Questions readers have asked.
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger className="text-left text-lg font-serif font-semibold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;

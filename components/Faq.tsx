import { shop } from "@/lib/config";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Just add items to your cart and tap 'Place order on WhatsApp'. Your order opens in WhatsApp pre-filled, and we confirm everything with you there.",
  },
  {
    q: "How do I pay?",
    a: "We share UPI / payment details on WhatsApp once your order is confirmed. Simple and secure.",
  },
  {
    q: "Where do you deliver?",
    a: `We deliver across ${shop.targetAreas.join(" and ")}, with doorstep delivery. Message us to check your area.`,
  },
  {
    q: "Are the products really preservative-free?",
    a: "Yes. Everything is 100% natural with no preservatives, chemicals, added colours or additives. Made fresh in small batches.",
  },
  {
    q: "How fresh are the products?",
    a: "We make in small batches and pack fresh only after you order, so nothing sits on a shelf.",
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <Reveal className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-turmeric">Questions</span>
        <h2 className="mt-2 font-brand text-3xl font-semibold text-maroon sm:text-4xl">
          Frequently asked
        </h2>
      </Reveal>
      <Reveal>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

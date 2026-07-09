import { shop } from "@/lib/config";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-8 sm:pt-12">
        <div className="rounded-3xl bg-forest px-6 py-10 text-cream shadow-soft sm:px-10 sm:py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/15 px-3 py-1 text-xs font-medium text-cream/90">
            <span className="h-1.5 w-1.5 rounded-full bg-turmeric" />
            Order in seconds on WhatsApp
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            {shop.tagline}
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-cream/80">
            {shop.subtagline}
          </p>
          <a
            href="#shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-turmeric px-6 py-3 text-sm font-semibold text-ink shadow-card transition active:scale-95"
          >
            Browse the pantry ↓
          </a>
        </div>

        {/* trust badges */}
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {shop.badges.map((b) => (
            <span
              key={b}
              className="whitespace-nowrap rounded-full border border-sand bg-white/60 px-3 py-1.5 text-xs font-medium text-jaggery"
            >
              ✓ {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

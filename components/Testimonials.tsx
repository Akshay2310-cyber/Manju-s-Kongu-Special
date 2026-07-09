import { testimonials } from "@/lib/config";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <Reveal className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-turmeric">
          Loved by families
        </span>
        <h2 className="mt-2 font-brand text-3xl font-semibold text-maroon sm:text-4xl">
          What our customers say
        </h2>
      </Reveal>

      <Reveal stagger className="grid gap-4 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={i}
            className="flex flex-col rounded-3xl border border-sand bg-white/70 p-5 shadow-card"
          >
            <div className="mb-2 text-turmeric">{"★★★★★"}</div>
            <blockquote className="flex-1 text-sm leading-relaxed text-ink/80">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-sm text-cream">
                {t.name.charAt(0)}
              </span>
              <div>
                <div className="text-sm font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-ink/50">on {t.product}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}

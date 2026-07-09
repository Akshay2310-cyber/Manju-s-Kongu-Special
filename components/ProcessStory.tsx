import Image from "next/image";
import { processSteps } from "@/lib/config";
import Reveal from "./Reveal";

export default function ProcessStory() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <Reveal className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-turmeric">
          Crafted with care
        </span>
        <h2 className="mt-2 font-brand text-3xl font-semibold text-maroon sm:text-4xl">
          Made the traditional way
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
          Every batch is made by hand at home, exactly the way it has been for generations.
        </p>
      </Reveal>

      <Reveal stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {processSteps.map((s, i) => (
          <div
            key={s.title}
            className="group relative overflow-hidden rounded-3xl bg-sand shadow-card"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={s.img}
                alt={s.title}
                fill
                sizes="(max-width:768px) 50vw, 220px"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
              <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-turmeric text-xs font-bold text-ink">
                {i + 1}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 text-cream">
              <div className="font-brand text-base font-semibold leading-tight">{s.title}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-cream/80">{s.text}</div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

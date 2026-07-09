"use client";

import { useEffect, useRef } from "react";
import { reels, shop } from "@/lib/config";

export default function Reels() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // play videos only while visible (saves data, feels alive)
  useEffect(() => {
    const vids = wrapRef.current?.querySelectorAll("video") ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.6 }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-12">
      <div className="mx-auto mb-6 max-w-5xl px-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-turmeric">
          Behind the scenes
        </span>
        <h2 className="mt-2 font-brand text-3xl font-semibold text-maroon sm:text-4xl">
          Watch how it&apos;s made
        </h2>
      </div>

      <div
        ref={wrapRef}
        className="no-scrollbar snap-row flex gap-4 overflow-x-auto px-4 pb-2 sm:px-[max(1rem,calc((100vw-64rem)/2))]"
      >
        {reels.map((r, i) => (
          <div
            key={i}
            className="relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-3xl bg-ink shadow-card sm:w-52"
          >
            <video
              className="h-full w-full object-cover"
              src={r.src}
              poster={r.poster}
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {r.caption}
            </span>
          </div>
        ))}
        {/* CTA card at end */}
        <a
          href={`https://wa.me/${shop.whatsappNumber}`}
          target="_blank"
          className="flex aspect-[9/16] w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-3xl bg-forest p-4 text-center text-cream shadow-card transition active:scale-95 sm:w-52"
        >
          <span className="text-3xl">🌿</span>
          <span className="font-brand text-lg font-semibold leading-tight">Taste it yourself</span>
          <span className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold">Order on WhatsApp</span>
        </a>
      </div>
    </section>
  );
}

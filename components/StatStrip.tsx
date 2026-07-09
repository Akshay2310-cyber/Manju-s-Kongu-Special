"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";

const STATS = [
  { value: 100, suffix: "%", label: "Natural & pure" },
  { value: 14, suffix: "+", label: "Products" },
  { value: 500, suffix: "+", label: "Happy orders" },
  { value: 0, suffix: "", label: "Preservatives", zero: true },
];

export default function StatStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState(STATS.map((s) => (s.zero ? 0 : 0)));
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          STATS.forEach((s, i) => {
            const obj = { n: 0 };
            anime({
              targets: obj,
              n: s.value,
              round: 1,
              easing: "easeOutExpo",
              duration: 1600,
              delay: i * 120,
              update: () =>
                setVals((prev) => {
                  const next = [...prev];
                  next[i] = obj.n;
                  return next;
                }),
            });
          });
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="rounded-2xl border border-sand bg-white/60 px-4 py-5 text-center">
            <div className="font-brand text-3xl font-bold text-maroon sm:text-4xl">
              {vals[i]}
              {s.suffix}
            </div>
            <div className="mt-1 text-xs font-medium text-ink/60">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

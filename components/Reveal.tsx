"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** stagger children instead of animating the wrapper as one block */
  stagger?: boolean;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "ul";
};

export default function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 20,
  as = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : el;

    // ensure hidden before animating
    anime.set(targets as any, { opacity: 0, translateY: y });

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            anime({
              targets: targets as any,
              opacity: [0, 1],
              translateY: [y, 0],
              easing: "cubicBezier(0.16,1,0.3,1)",
              duration: 700,
              delay: stagger ? anime.stagger(90, { start: delay }) : delay,
            });
            // reveal wrapper itself when animating children
            if (stagger) (el as HTMLElement).style.opacity = "1";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger, delay, y]);

  const Tag = as as any;
  return (
    <Tag ref={ref as any} className={className} style={stagger ? { opacity: 0 } : undefined}>
      {children}
    </Tag>
  );
}

"use client";

import { shop } from "@/lib/config";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-lg">🌿</span>
          <span className="font-display text-lg font-semibold leading-none text-forest">
            {shop.name}
          </span>
        </a>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open cart"
          className="relative flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-medium text-cream shadow-card transition active:scale-95"
        >
          <span>🛒</span>
          <span className="hidden xs:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 animate-pop place-items-center rounded-full bg-clay text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { shop } from "@/lib/config";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count, setOpen } = useCart();
  const [logoOk, setLogoOk] = useState(true);
  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <a href="#top" className="flex items-center">
          {logoOk ? (
            <Image
              src={shop.logoWordmark}
              alt={shop.name}
              width={716}
              height={343}
              className="h-11 w-auto object-contain sm:h-12"
              onError={() => setLogoOk(false)}
              priority
            />
          ) : (
            <span className="font-brand text-xl font-semibold leading-tight tracking-tight text-maroon">
              {shop.name}
            </span>
          )}
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

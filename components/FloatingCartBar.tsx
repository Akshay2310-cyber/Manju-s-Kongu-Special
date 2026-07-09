"use client";

import { shop } from "@/lib/config";
import { useCart } from "@/lib/cart";

export default function FloatingCartBar() {
  const { count, subtotal, setOpen } = useCart();
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-slide-up px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
      <button
        onClick={() => setOpen(true)}
        className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-2xl bg-forest px-5 py-4 text-cream shadow-soft transition active:scale-[0.99]"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-cream/20 text-xs font-bold">
            {count}
          </span>
          View cart
        </span>
        <span className="flex items-center gap-2 font-semibold">
          {shop.currency}
          {subtotal}
          <span className="text-turmeric">→</span>
        </span>
      </button>
    </div>
  );
}

"use client";

import Image from "next/image";
import { shop, type Product } from "@/lib/config";
import { useCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { cart, add, decrement } = useCart();
  const qty = cart[product.id] || 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-white/70 shadow-card transition hover:shadow-soft">
      {/* visual */}
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-sand to-cream">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 320px"
            className="object-cover"
          />
        ) : (
          <span className="text-6xl transition group-hover:scale-110">{product.emoji}</span>
        )}
        {product.tag && (
          <span className="absolute left-2 top-2 rounded-full bg-clay px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.tag}
          </span>
        )}
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-[15px] font-semibold leading-tight text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-ink/60">{product.desc}</p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="font-display text-lg font-semibold text-forest">
              {shop.currency}
              {product.price}
            </div>
            <div className="text-[11px] text-ink/50">{product.unit}</div>
          </div>

          {qty === 0 ? (
            <button
              onClick={() => add(product.id)}
              className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-cream transition active:scale-90"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-forest p-1 text-cream">
              <button
                onClick={() => decrement(product.id)}
                aria-label="Remove one"
                className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none transition active:scale-90"
              >
                −
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => add(product.id)}
                aria-label="Add one"
                className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none transition active:scale-90"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

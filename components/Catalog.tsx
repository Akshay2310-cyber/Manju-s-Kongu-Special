"use client";

import { useState } from "react";
import { categories, products, type CategoryId } from "@/lib/config";
import ProductCard from "./ProductCard";

type Filter = "all" | CategoryId;

export default function Catalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="shop" className="mx-auto max-w-3xl px-4 pb-40 pt-2">
      {/* category chips */}
      <div className="no-scrollbar sticky top-[57px] z-30 -mx-4 flex gap-2 overflow-x-auto bg-cream/85 px-4 py-3 backdrop-blur-md">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.emoji} {c.label}
          </Chip>
        ))}
      </div>

      {categories
        .filter((c) => filter === "all" || c.id === filter)
        .map((cat) => {
          const list = visible.filter((p) => p.category === cat.id);
          if (list.length === 0) return null;
          return (
            <div key={cat.id} className="mt-5">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-xl font-semibold text-ink">{cat.label}</h2>
                <span className="text-xs text-ink/50">{cat.blurb}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          );
        })}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
        active
          ? "border-forest bg-forest text-cream"
          : "border-sand bg-white/60 text-ink/70 hover:border-forest/40"
      }`}
    >
      {children}
    </button>
  );
}

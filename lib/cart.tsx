"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, shop, type Product } from "./config";

type CartState = Record<string, number>; // productId -> qty

type CartContextType = {
  cart: CartState;
  count: number;
  subtotal: number;
  items: { product: Product; qty: number }[];
  add: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "ammakitchen.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, hydrated]);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decrement = (id: string) =>
    setCart((c) => {
      const next = (c[id] || 0) - 1;
      const copy = { ...c };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  const remove = (id: string) =>
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });
  const clear = () => setCart({});

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: products.find((p) => p.id === id)!, qty }))
        .filter((x) => x.product),
    [cart]
  );

  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const subtotal = useMemo(
    () => items.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    [items]
  );

  const value: CartContextType = {
    cart,
    count,
    subtotal,
    items,
    add,
    decrement,
    remove,
    clear,
    open,
    setOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// Build the pre-filled WhatsApp order message + wa.me link
export function buildWhatsAppOrder(
  items: { product: Product; qty: number }[],
  subtotal: number,
  customer: { name: string; phone: string; address: string; notes: string }
): string {
  const lines: string[] = [];
  lines.push(`*New order — ${shop.name}*`);
  lines.push("");
  items.forEach(({ product, qty }, i) => {
    lines.push(
      `${i + 1}. ${product.name} (${product.unit}) × ${qty} = ${shop.currency}${product.price * qty}`
    );
  });
  lines.push("");
  lines.push(`*Subtotal: ${shop.currency}${subtotal}*`);
  lines.push("");
  lines.push(`👤 Name: ${customer.name || "-"}`);
  lines.push(`📞 Phone: ${customer.phone || "-"}`);
  lines.push(`📍 Address: ${customer.address || "-"}`);
  if (customer.notes.trim()) lines.push(`📝 Notes: ${customer.notes}`);
  return lines.join("\n");
}

export function waLink(message: string): string {
  return `https://wa.me/${shop.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

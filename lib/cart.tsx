"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts, shop, type Product } from "./config";

type CartState = Record<string, number>; // productId -> qty

type CartContextType = {
  products: Product[];
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
  // coupon
  couponCode: string | null;
  discount: number;
  total: number;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "mks.cart.v1";

export function CartProvider({
  products,
  children,
}: {
  products?: Product[];
  children: React.ReactNode;
}) {
  const list = products && products.length ? products : seedProducts;
  const [cart, setCart] = useState<CartState>({});
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

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
  const clear = () => {
    setCart({});
    setCouponCode(null);
    setDiscount(0);
  };

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: list.find((p) => p.id === id)!, qty }))
        .filter((x) => x.product),
    [cart, list]
  );

  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const subtotal = useMemo(
    () => items.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    [items]
  );

  const applyCoupon = async (code: string) => {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false, discount: 0, message: "Could not check code" }));
    if (res.ok) {
      setCouponCode(res.code || code.toUpperCase());
      setDiscount(res.discount);
    } else {
      setCouponCode(null);
      setDiscount(0);
    }
    return { ok: !!res.ok, message: res.message || "" };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
  };

  // re-validate coupon whenever the cart total changes
  useEffect(() => {
    if (!couponCode) return;
    let cancelled = false;
    fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setDiscount(res.discount);
        else {
          setCouponCode(null);
          setDiscount(0);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const total = Math.max(0, subtotal - discount);

  const value: CartContextType = {
    products: list,
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
    couponCode,
    discount,
    total,
    applyCoupon,
    removeCoupon,
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
  customer: { name: string; phone: string; address: string; notes: string },
  coupon?: { code: string | null; discount: number; total: number }
): string {
  const lines: string[] = [];
  lines.push(`*New order · ${shop.name}*`);
  lines.push("");
  items.forEach(({ product, qty }, i) => {
    lines.push(
      `${i + 1}. ${product.name} (${product.unit}) × ${qty} = ${shop.currency}${product.price * qty}`
    );
  });
  lines.push("");
  lines.push(`Subtotal: ${shop.currency}${subtotal}`);
  if (coupon && coupon.discount > 0) {
    lines.push(`Coupon ${coupon.code}: -${shop.currency}${coupon.discount}`);
    lines.push(`*Total: ${shop.currency}${coupon.total}*`);
  } else {
    lines.push(`*Total: ${shop.currency}${subtotal}*`);
  }
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

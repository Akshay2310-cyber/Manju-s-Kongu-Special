"use client";

import { useState } from "react";
import { shop } from "@/lib/config";
import { useCart, buildWhatsAppOrder, waLink } from "@/lib/cart";

export default function CartSheet() {
  const { open, setOpen, items, subtotal, count, add, decrement, remove, clear } = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [touched, setTouched] = useState(false);

  const canOrder = count > 0 && customer.name.trim() && customer.phone.trim() && customer.address.trim();
  const remaining = shop.freeDeliveryAbove > 0 ? shop.freeDeliveryAbove - subtotal : 0;

  const handleOrder = () => {
    setTouched(true);
    if (!canOrder) return;
    // open WhatsApp synchronously (keeps the user gesture, avoids popup block)
    const msg = buildWhatsAppOrder(items, subtotal, customer);
    window.open(waLink(msg), "_blank");
    // record the order in the backend (best-effort, non-blocking)
    const orderItems = items.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      unit: product.unit,
      price: product.price,
      qty,
    }));
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...customer, items: orderItems, subtotal, count }),
    }).catch(() => {});
    clear();
    setOpen(false);
  };

  return (
    <>
      {/* backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 animate-fade-in bg-ink/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] max-w-3xl flex-col rounded-t-3xl bg-cream shadow-soft transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* handle + header */}
        <div className="flex items-center justify-between border-b border-sand px-5 pb-3 pt-3">
          <h2 className="font-display text-xl font-semibold text-ink">Your order</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-sand text-lg text-ink/60 active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {count === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl">🧺</div>
              <p className="mt-3 text-ink/60">Your cart is empty.</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream active:scale-95"
              >
                Start shopping
              </button>
            </div>
          ) : (
            <>
              {/* items */}
              <ul className="space-y-3">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-sand text-2xl">
                      {product.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-ink">{product.name}</div>
                      <div className="text-xs text-ink/50">
                        {shop.currency}
                        {product.price} · {product.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-forest p-1 text-cream">
                      <button
                        onClick={() => decrement(product.id)}
                        className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none active:scale-90"
                        aria-label="Remove one"
                      >
                        −
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm font-semibold">{qty}</span>
                      <button
                        onClick={() => add(product.id)}
                        className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none active:scale-90"
                        aria-label="Add one"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-16 text-right font-semibold text-ink">
                      {shop.currency}
                      {product.price * qty}
                    </div>
                  </li>
                ))}
              </ul>

              {shop.freeDeliveryAbove > 0 && remaining > 0 && (
                <p className="mt-3 rounded-xl bg-turmeric/15 px-3 py-2 text-center text-xs font-medium text-jaggery">
                  Add {shop.currency}
                  {remaining} more for free delivery 🚚
                </p>
              )}

              {/* customer details */}
              <div className="mt-5 space-y-3">
                <h3 className="font-display text-base font-semibold text-ink">Delivery details</h3>
                <Field
                  label="Name"
                  value={customer.name}
                  onChange={(v) => setCustomer((c) => ({ ...c, name: v }))}
                  error={touched && !customer.name.trim()}
                  placeholder="Your name"
                />
                <Field
                  label="Phone"
                  value={customer.phone}
                  onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))}
                  error={touched && !customer.phone.trim()}
                  placeholder="10-digit mobile"
                  type="tel"
                />
                <Field
                  label="Address"
                  value={customer.address}
                  onChange={(v) => setCustomer((c) => ({ ...c, address: v }))}
                  error={touched && !customer.address.trim()}
                  placeholder="Flat / street / area / pincode"
                  textarea
                />
                <Field
                  label="Notes (optional)"
                  value={customer.notes}
                  onChange={(v) => setCustomer((c) => ({ ...c, notes: v }))}
                  placeholder="Anything we should know?"
                />
              </div>
            </>
          )}
        </div>

        {/* footer / checkout */}
        {count > 0 && (
          <div className="border-t border-sand bg-cream px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span className="font-display text-xl font-semibold text-ink">
                {shop.currency}
                {subtotal}
              </span>
            </div>
            <button
              onClick={handleOrder}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-card transition active:scale-[0.99] ${
                canOrder ? "bg-[#25D366]" : "bg-[#25D366]/60"
              }`}
            >
              <WhatsAppIcon /> Place order on WhatsApp
            </button>
            {touched && !canOrder && (
              <p className="mt-2 text-center text-xs text-clay">
                Please fill your name, phone & address.
              </p>
            )}
            <p className="mt-2 text-center text-[11px] leading-snug text-ink/50">
              {shop.deliveryNote}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  type?: string;
  textarea?: boolean;
}) {
  const base = `w-full rounded-xl border bg-white/80 px-3 py-2.5 text-[15px] outline-none transition placeholder:text-ink/30 focus:border-forest ${
    error ? "border-clay" : "border-sand"
  }`;
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink/60">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={base}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </label>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { shop } from "@/lib/config";
import { useCart } from "@/lib/cart";

const QUICK_REPLIES = [
  { label: "🛒 I'd like to place an order", msg: "Hi! I'd like to place an order." },
  { label: "💰 Share the price list", msg: "Hi! Can you please share your price list?" },
  { label: "🚚 Do you deliver to my area?", msg: "Hi! Do you deliver to my area? I'm in " },
  { label: "🎁 Any combo offers?", msg: "Hi! Do you have any combo offers or bulk discounts?" },
];

function wa(msg: string) {
  return `https://wa.me/${shop.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  // sit above the floating cart bar when it is visible
  const bottom = count > 0 ? "bottom-24" : "bottom-5";

  return (
    <div className={`fixed right-4 z-40 flex flex-col items-end gap-3 ${bottom} transition-all`}>
      {/* chat card */}
      {open && (
        <div className="w-[min(20rem,calc(100vw-2rem))] animate-slide-up overflow-hidden rounded-3xl bg-cream shadow-soft">
          <div className="flex items-center gap-3 bg-forest px-4 py-3 text-cream">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-cream">
              <Image src={shop.logoMark} alt={shop.name} width={40} height={40} className="h-10 w-10 rounded-full object-contain" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-brand text-base font-semibold leading-tight">{shop.name}</div>
              <div className="flex items-center gap-1 text-xs text-cream/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" /> Typically replies instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-7 w-7 place-items-center rounded-full bg-cream/15 text-sm active:scale-90"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 p-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-ink shadow-sm">
              Hi there! 👋 Welcome to {shop.name}. How can we help you today?
            </div>
            <div className="flex flex-col gap-2">
              {QUICK_REPLIES.map((q) => (
                <a
                  key={q.label}
                  href={wa(q.msg)}
                  target="_blank"
                  className="rounded-full border border-forest/25 bg-white px-3 py-2 text-left text-sm font-medium text-forest transition hover:bg-forest hover:text-cream active:scale-[0.98]"
                >
                  {q.label}
                </a>
              ))}
            </div>
            <a
              href={wa("Hi! I have a question.")}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white active:scale-95"
            >
              <WhatsAppIcon /> Start chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* launcher button */}
      <div className="relative">
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-60" />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Chat with us on WhatsApp"}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:brightness-105 active:scale-90"
        >
          {open ? <span className="text-2xl leading-none">✕</span> : <WhatsAppIcon size={30} />}
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pop rounded-full border-2 border-cream bg-clay" />
          )}
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

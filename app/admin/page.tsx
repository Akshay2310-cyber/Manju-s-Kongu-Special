"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { shop } from "@/lib/config";
import OrdersPanel from "@/components/admin/OrdersPanel";
import ProductsPanel from "@/components/admin/ProductsPanel";
import CouponsPanel from "@/components/admin/CouponsPanel";

const KEY_STORE = "mks_admin_key";
type Tab = "orders" | "products" | "coupons";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");

  const signIn = useCallback(async (k: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-key": k } });
      if (res.status === 401) {
        setError("Wrong password.");
        localStorage.removeItem(KEY_STORE);
        return;
      }
      if (!res.ok) {
        setError("Server error.");
        return;
      }
      setAuthed(true);
      setKey(k);
      localStorage.setItem(KEY_STORE, k);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORE);
    if (saved) {
      setKey(saved);
      signIn(saved);
    }
  }, [signIn]);

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn(key);
          }}
          className="w-full max-w-sm rounded-3xl border border-sand bg-white/70 p-7 shadow-soft"
        >
          <div className="mb-5 flex items-center gap-3">
            <Image src={shop.logo} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-contain" />
            <div>
              <div className="font-brand text-lg font-semibold text-maroon">{shop.name}</div>
              <div className="text-xs text-ink/60">Admin dashboard</div>
            </div>
          </div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Admin password</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
            placeholder="Enter password"
            className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-[15px] outline-none focus:border-forest"
          />
          {error && <p className="mt-2 text-xs text-clay">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream transition active:scale-95 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "Orders" },
    { id: "products", label: "Products" },
    { id: "coupons", label: "Coupons" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={shop.logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-contain" />
          <div>
            <div className="font-brand text-lg font-semibold leading-tight text-maroon">{shop.name}</div>
            <div className="text-xs text-ink/60">Admin dashboard</div>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem(KEY_STORE);
            setAuthed(false);
            setKey("");
          }}
          className="rounded-full border border-sand bg-white/70 px-4 py-2 text-sm font-medium text-ink/60 active:scale-95"
        >
          Logout
        </button>
      </header>

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition active:scale-95 ${
              tab === t.id ? "border-forest bg-forest text-cream" : "border-sand bg-white/70 text-ink/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && <OrdersPanel authKey={key} />}
      {tab === "products" && <ProductsPanel authKey={key} />}
      {tab === "coupons" && <CouponsPanel authKey={key} />}
    </main>
  );
}

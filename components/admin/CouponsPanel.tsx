"use client";

import { useCallback, useEffect, useState } from "react";
import { shop } from "@/lib/config";
import type { Coupon } from "@/lib/orders";

export default function CouponsPanel({ authKey }: { authKey: string }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Coupon>({ code: "", type: "percent", value: 10, min_subtotal: 0, active: true });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons", { headers: { "x-admin-key": authKey } });
      const data = await res.json();
      setCoupons(data.coupons || []);
    } finally {
      setLoading(false);
    }
  }, [authKey]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!form.code.trim() || !(form.value > 0)) {
      setError("Enter a code and a value.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": authKey },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ code: "", type: "percent", value: 10, min_subtotal: 0, active: true });
      load();
    } else setError("Save failed.");
  };

  const remove = async (code: string) => {
    setCoupons((c) => c.filter((x) => x.code !== code));
    await fetch(`/api/coupons/${code}`, { method: "DELETE", headers: { "x-admin-key": authKey } }).catch(() => {});
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* create */}
      <div className="rounded-3xl border border-sand bg-white/70 p-5">
        <h3 className="mb-3 font-brand text-lg font-semibold text-maroon">Create coupon</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/60">Code</span>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="FRESH10"
              className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm uppercase outline-none focus:border-forest"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/60">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })}
                className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
              >
                <option value="percent">Percent %</option>
                <option value="flat">Flat {shop.currency}</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/60">
                Value {form.type === "percent" ? "(%)" : `(${shop.currency})`}
              </span>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/60">Minimum order ({shop.currency}, optional)</span>
            <input
              type="number"
              value={form.min_subtotal}
              onChange={(e) => setForm({ ...form, min_subtotal: Number(e.target.value) })}
              className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream active:scale-95 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save coupon"}
          </button>
        </div>
      </div>

      {/* list */}
      <div>
        <h3 className="mb-3 font-brand text-lg font-semibold text-maroon">Coupons</h3>
        {loading ? (
          <div className="py-10 text-center text-ink/50">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-white/50 py-10 text-center text-ink/50">
            No coupons yet.
          </div>
        ) : (
          <div className="space-y-2">
            {coupons.map((c) => (
              <div key={c.code} className="flex items-center gap-3 rounded-2xl border border-sand bg-white/70 p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-brand text-base font-bold text-forest">{c.code}</span>
                    {!c.active && <span className="rounded bg-ink/10 px-1.5 text-[10px] text-ink/50">off</span>}
                  </div>
                  <div className="text-xs text-ink/55">
                    {c.type === "percent" ? `${c.value}% off` : `${shop.currency}${c.value} off`}
                    {c.min_subtotal > 0 ? ` · min ${shop.currency}${c.min_subtotal}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => remove(c.code)}
                  className="rounded-full border border-clay/30 px-3 py-1.5 text-xs font-medium text-clay active:scale-95"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

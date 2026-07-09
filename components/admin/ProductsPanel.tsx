"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { categories, shop } from "@/lib/config";
import type { AdminProduct } from "@/lib/orders";

type Draft = Partial<AdminProduct>;

export default function ProductsPanel({ authKey }: { authKey: string }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?all=1", { headers: { "x-admin-key": authKey } });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }, [authKey]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setProducts((p) => p.filter((x) => x.id !== id));
    await fetch(`/api/products/${id}`, { method: "DELETE", headers: { "x-admin-key": authKey } }).catch(() => {});
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink/60">{products.length} products</p>
        <button
          onClick={() => setEditing({ category: "masala", active: true, emoji: "📦", sort: products.length })}
          className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream active:scale-95"
        >
          + Add product
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-ink/50">Loading...</div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-sand bg-white/70 p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                {p.image ? (
                  <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-xl">{p.emoji}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-ink">{p.name}</span>
                  {!p.active && <span className="rounded bg-ink/10 px-1.5 text-[10px] text-ink/50">hidden</span>}
                </div>
                <div className="text-xs text-ink/50">
                  {shop.currency}
                  {p.price} · {p.unit} · {p.category}
                </div>
              </div>
              <button onClick={() => setEditing(p)} className="rounded-full border border-sand px-3 py-1.5 text-xs font-medium text-forest active:scale-95">
                Edit
              </button>
              <button onClick={() => remove(p.id)} className="rounded-full border border-clay/30 px-3 py-1.5 text-xs font-medium text-clay active:scale-95">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProductEditor
          authKey={authKey}
          draft={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  authKey,
  draft,
  onClose,
  onSaved,
}: {
  authKey: string;
  draft: Draft;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [d, setD] = useState<Draft>(draft);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof AdminProduct, v: any) => setD((x) => ({ ...x, [k]: v }));

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-key": authKey }, body: fd });
      const data = await res.json();
      if (data.url) set("image", data.url);
      else setError(data.error || "Upload failed");
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!d.name || !d.category) {
      setError("Name and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    const body = JSON.stringify({
      name: d.name,
      desc: d.desc || "",
      price: Number(d.price) || 0,
      unit: d.unit || "",
      category: d.category,
      emoji: d.emoji || "📦",
      image: d.image || null,
      tag: d.tag || null,
      active: d.active ?? true,
      sort: Number(d.sort) || 0,
    });
    const res = d.id
      ? await fetch(`/api/products/${d.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-key": authKey },
          body,
        })
      : await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-key": authKey },
          body,
        });
    setSaving(false);
    if (res.ok) onSaved();
    else setError("Save failed.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-soft sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-brand text-xl font-semibold text-maroon">{d.id ? "Edit product" : "New product"}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-sand text-ink/60">✕</button>
        </div>

        {/* image */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
            {d.image ? (
              <Image src={d.image} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center text-3xl">{d.emoji || "📦"}</span>
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-sand bg-white px-4 py-2 text-sm font-medium text-forest active:scale-95 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : d.image ? "Change photo" : "Upload photo"}
            </button>
            {d.image && (
              <button onClick={() => set("image", "")} className="ml-2 text-xs text-clay">
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" className="col-span-2" value={d.name || ""} onChange={(v) => set("name", v)} />
          <Field label="Description" className="col-span-2" value={d.desc || ""} onChange={(v) => set("desc", v)} textarea />
          <Field label={`Price (${shop.currency})`} value={String(d.price ?? "")} onChange={(v) => set("price", v)} type="number" />
          <Field label="Unit (e.g. 500 ml)" value={d.unit || ""} onChange={(v) => set("unit", v)} />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/60">Category</span>
            <select
              value={d.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Emoji" value={d.emoji || ""} onChange={(v) => set("emoji", v)} />
          <Field label="Tag (optional)" value={d.tag || ""} onChange={(v) => set("tag", v)} />
          <label className="col-span-2 flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={d.active ?? true} onChange={(e) => set("active", e.target.checked)} />
            Visible on the storefront
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-clay">{error}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="mt-4 w-full rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream active:scale-95 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save product"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  className?: string;
}) {
  const base = "w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none focus:border-forest";
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-ink/60">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className={base} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </label>
  );
}

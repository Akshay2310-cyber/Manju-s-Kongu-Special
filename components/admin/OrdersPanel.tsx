"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { shop } from "@/lib/config";
import { STATUS_META, STATUS_ORDER, type Order, type OrderStatus } from "@/lib/orders";

export default function OrdersPanel({ authKey }: { authKey: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-key": authKey } });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, [authKey]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": authKey },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const removeOrder = async (id: string) => {
    if (!confirm("Delete this order permanently?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await fetch(`/api/orders/${id}`, { method: "DELETE", headers: { "x-admin-key": authKey } }).catch(() => {});
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const active = orders.filter((o) => o.status !== "cancelled");
    return {
      total: orders.length,
      revenue: active.reduce((s, o) => s + o.total, 0),
      today: orders.filter((o) => new Date(o.created_at).toDateString() === today).length,
      newCount: orders.filter((o) => o.status === "new").length,
    };
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total orders" value={String(stats.total)} />
          <Stat label="Revenue" value={`${shop.currency}${stats.revenue.toLocaleString("en-IN")}`} accent />
          <Stat label="Today" value={String(stats.today)} />
          <Stat label="New" value={String(stats.newCount)} />
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Tab active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Tab>
          {STATUS_ORDER.map((s) => (
            <Tab key={s} active={filter === s} onClick={() => setFilter(s)}>
              {STATUS_META[s].label}
            </Tab>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name / phone / id"
            className="w-full rounded-full border border-sand bg-white/70 px-4 py-2 text-sm outline-none focus:border-forest sm:w-56"
          />
          <button onClick={load} className="shrink-0 rounded-full border border-sand bg-white/70 px-4 py-2 text-sm font-medium text-forest active:scale-95">
            ↻
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sand bg-white/50 py-16 text-center text-ink/50">
          {loading ? "Loading..." : "No orders yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              expanded={expanded === o.id}
              onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
              onStatus={setStatus}
              onDelete={removeOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-sand bg-white/70 px-4 py-4">
      <div className={`font-brand text-2xl font-bold ${accent ? "text-forest" : "text-maroon"}`}>{value}</div>
      <div className="mt-0.5 text-xs text-ink/60">{label}</div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
        active ? "border-forest bg-forest text-cream" : "border-sand bg-white/70 text-ink/70"
      }`}
    >
      {children}
    </button>
  );
}

function waCustomer(phone: string) {
  const d = phone.replace(/\D/g, "");
  return `https://wa.me/${d.length === 10 ? `91${d}` : d}`;
}

function OrderCard({
  order: o,
  expanded,
  onToggle,
  onStatus,
  onDelete,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (id: string, s: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const meta = STATUS_META[o.status];
  const when = new Date(o.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-white/70 shadow-card">
      <div className="flex cursor-pointer items-center gap-3 p-4" onClick={onToggle}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{o.name}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${meta.className}`}>
              {meta.label}
            </span>
          </div>
          <div className="mt-0.5 truncate text-xs text-ink/55">
            {o.id} · {when} · {o.count} item{o.count > 1 ? "s" : ""}
            {o.coupon_code ? ` · 🎟 ${o.coupon_code}` : ""}
          </div>
        </div>
        <div className="text-right">
          <div className="font-brand text-lg font-bold text-forest">
            {shop.currency}
            {o.total.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-ink/40">{expanded ? "▲" : "▼"}</div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-sand px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Items</h4>
              <ul className="space-y-1 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-2">
                    <span className="text-ink/80">
                      {it.name} <span className="text-ink/40">({it.unit})</span> × {it.qty}
                    </span>
                    <span className="font-medium text-ink">
                      {shop.currency}
                      {it.price * it.qty}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-sand pt-1 text-ink/60">
                  <span>Subtotal</span>
                  <span>
                    {shop.currency}
                    {o.subtotal}
                  </span>
                </li>
                {o.discount > 0 && (
                  <li className="flex justify-between text-forest">
                    <span>Discount ({o.coupon_code})</span>
                    <span>
                      -{shop.currency}
                      {o.discount}
                    </span>
                  </li>
                )}
                <li className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {shop.currency}
                    {o.total}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Customer</h4>
              <div className="space-y-1 text-sm text-ink/80">
                <div>📞 {o.phone}</div>
                <div>📍 {o.address}</div>
                {o.notes && <div>📝 {o.notes}</div>}
              </div>
              <a
                href={waCustomer(o.phone)}
                target="_blank"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white active:scale-95"
              >
                💬 Message customer
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="self-center text-xs text-ink/50">Set status:</span>
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => onStatus(o.id, s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                  o.status === s ? STATUS_META[s].className : "border-sand bg-white text-ink/60"
                }`}
              >
                {STATUS_META[s].label}
              </button>
            ))}
            <button
              onClick={() => onDelete(o.id)}
              className="ml-auto rounded-full border border-clay/30 px-3 py-1.5 text-xs font-medium text-clay active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

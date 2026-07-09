import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";
import type { OrderItem } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: a customer places an order (called at WhatsApp checkout)
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.name || !b?.phone || !b?.address || !Array.isArray(b?.items) || b.items.length === 0) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const items: OrderItem[] = b.items.map((i: any) => ({
      id: String(i.id),
      name: String(i.name),
      unit: String(i.unit || ""),
      price: Number(i.price) || 0,
      qty: Number(i.qty) || 0,
    }));
    const subtotal = Number(b.subtotal) || items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = Number(b.count) || items.reduce((s, i) => s + i.qty, 0);
    const order = await createOrder({
      name: String(b.name).slice(0, 120),
      phone: String(b.phone).slice(0, 30),
      address: String(b.address).slice(0, 500),
      notes: String(b.notes || "").slice(0, 500),
      items,
      subtotal,
      count,
    });
    return NextResponse.json({ ok: true, id: order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// Protected: dashboard lists all orders
export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

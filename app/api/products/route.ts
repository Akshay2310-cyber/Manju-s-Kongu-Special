import { NextResponse } from "next/server";
import { getAllProducts, getStoreProducts, saveProduct } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: storefront gets active products; admin (?all=1 + key) gets everything
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("all") === "1") {
      if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.json({ products: await getAllProducts() });
    }
    return NextResponse.json({ products: await getStoreProducts() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// POST: create / upsert a product (admin)
export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b?.name || !b?.category) {
      return NextResponse.json({ error: "Name and category required" }, { status: 400 });
    }
    const id = await saveProduct({
      id: b.id,
      name: String(b.name),
      desc: String(b.desc || ""),
      price: Number(b.price) || 0,
      unit: String(b.unit || ""),
      category: String(b.category),
      emoji: b.emoji ? String(b.emoji) : "📦",
      image: b.image ? String(b.image) : null,
      tag: b.tag ? String(b.tag) : null,
      active: b.active ?? true,
      sort: Number(b.sort) || 0,
    });
    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

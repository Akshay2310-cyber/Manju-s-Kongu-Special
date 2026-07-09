import { NextResponse } from "next/server";
import { deleteProduct, saveProduct } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Update a product (admin)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    await saveProduct({
      id: params.id,
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
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// Delete a product (admin)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";
import { STATUS_ORDER, type OrderStatus } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Protected: update an order's status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!STATUS_ORDER.includes(b?.status)) {
      return NextResponse.json({ error: "Bad status" }, { status: 400 });
    }
    await updateOrderStatus(params.id, b.status as OrderStatus);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

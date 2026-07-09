import { NextResponse } from "next/server";
import { getCoupons, saveCoupon } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ coupons: await getCoupons() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b?.code || !["percent", "flat"].includes(b?.type) || !(Number(b?.value) > 0)) {
      return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
    }
    await saveCoupon({
      code: String(b.code),
      type: b.type,
      value: Number(b.value),
      min_subtotal: Number(b.min_subtotal) || 0,
      active: b.active ?? true,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

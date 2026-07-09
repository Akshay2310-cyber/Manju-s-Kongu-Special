import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: a customer checks a coupon code against their cart subtotal
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const code = String(b?.code || "").trim();
    const subtotal = Number(b?.subtotal) || 0;
    if (!code) return NextResponse.json({ ok: false, discount: 0, message: "Enter a code" });
    const res = await validateCoupon(code, subtotal);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ ok: false, discount: 0, message: "Server error" }, { status: 500 });
  }
}

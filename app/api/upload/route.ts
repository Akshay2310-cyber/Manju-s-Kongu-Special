import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Upload a product photo to Vercel Blob (admin). Returns the public URL.
export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!file.type.startsWith("image/"))
      return NextResponse.json({ error: "Images only" }, { status: 400 });
    if (file.size > 8 * 1024 * 1024)
      return NextResponse.json({ error: "Max 8 MB" }, { status: 400 });
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const name = `products/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const blob = await put(name, file, { access: "public", contentType: file.type });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}

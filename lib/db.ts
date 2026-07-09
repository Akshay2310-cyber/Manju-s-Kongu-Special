import "server-only";
import { sql } from "@vercel/postgres";
import { products as seedProducts, type CategoryId, type Product } from "./config";
import {
  computeDiscount,
  type AdminProduct,
  type Coupon,
  type Order,
  type OrderItem,
  type OrderStatus,
} from "./orders";

// -------------------------------------------------------------------
//  Neon Postgres (via @vercel/postgres). Tables are prefixed "mks_"
//  so they never collide with other projects sharing the same DB.
//  Env: POSTGRES_URL (auto-injected by the Vercel <-> Neon connection).
// -------------------------------------------------------------------

let _ready: Promise<void> | null = null;

async function init() {
  await sql`CREATE TABLE IF NOT EXISTS mks_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '📦',
    image TEXT,
    tag TEXT,
    sort INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS mks_coupons (
    code TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    value INTEGER NOT NULL,
    min_subtotal INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS mks_orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    items JSONB NOT NULL,
    subtotal INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    coupon_code TEXT,
    count INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
  )`;

  // Seed products from config the first time only
  const { rows } = await sql`SELECT COUNT(*)::int AS n FROM mks_products`;
  if (rows[0].n === 0) {
    for (let i = 0; i < seedProducts.length; i++) {
      const p = seedProducts[i];
      await sql`INSERT INTO mks_products (id, name, description, price, unit, category, emoji, image, tag, sort, active)
        VALUES (${p.id}, ${p.name}, ${p.desc}, ${p.price}, ${p.unit}, ${p.category}, ${p.emoji}, ${p.image || null}, ${p.tag || null}, ${i}, TRUE)
        ON CONFLICT (id) DO NOTHING`;
    }
  }
}

function ready() {
  if (!_ready) _ready = init();
  return _ready;
}

// ---------- Products ----------

function toProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    desc: r.description,
    price: Number(r.price),
    unit: r.unit,
    category: r.category as CategoryId,
    emoji: r.emoji,
    image: r.image || undefined,
    tag: r.tag || undefined,
  };
}

export async function getStoreProducts(): Promise<Product[]> {
  await ready();
  const { rows } = await sql`SELECT * FROM mks_products WHERE active = TRUE ORDER BY sort ASC, name ASC`;
  return rows.map(toProduct);
}

export async function getAllProducts(): Promise<AdminProduct[]> {
  await ready();
  const { rows } = await sql`SELECT * FROM mks_products ORDER BY sort ASC, name ASC`;
  return rows.map((r) => ({ ...toProduct(r), active: !!r.active, sort: Number(r.sort) } as AdminProduct));
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function saveProduct(p: {
  id?: string;
  name: string;
  desc: string;
  price: number;
  unit: string;
  category: string;
  emoji?: string;
  image?: string | null;
  tag?: string | null;
  active?: boolean;
  sort?: number;
}): Promise<string> {
  await ready();
  const id = p.id || `${slugify(p.name) || "item"}-${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO mks_products (id, name, description, price, unit, category, emoji, image, tag, sort, active, updated_at)
    VALUES (${id}, ${p.name}, ${p.desc}, ${p.price}, ${p.unit}, ${p.category}, ${p.emoji || "📦"}, ${p.image || null}, ${p.tag || null}, ${p.sort ?? 0}, ${p.active ?? true}, now())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
      unit = EXCLUDED.unit, category = EXCLUDED.category, emoji = EXCLUDED.emoji,
      image = EXCLUDED.image, tag = EXCLUDED.tag, sort = EXCLUDED.sort,
      active = EXCLUDED.active, updated_at = now()`;
  return id;
}

export async function deleteProduct(id: string): Promise<void> {
  await ready();
  await sql`DELETE FROM mks_products WHERE id = ${id}`;
}

// ---------- Coupons ----------

function toCoupon(r: any): Coupon {
  return {
    code: r.code,
    type: r.type,
    value: Number(r.value),
    min_subtotal: Number(r.min_subtotal),
    active: !!r.active,
  };
}

export async function getCoupons(): Promise<Coupon[]> {
  await ready();
  const { rows } = await sql`SELECT * FROM mks_coupons ORDER BY created_at DESC`;
  return rows.map(toCoupon);
}

export async function saveCoupon(c: Coupon): Promise<void> {
  await ready();
  const code = c.code.trim().toUpperCase();
  await sql`INSERT INTO mks_coupons (code, type, value, min_subtotal, active)
    VALUES (${code}, ${c.type}, ${c.value}, ${c.min_subtotal || 0}, ${c.active ?? true})
    ON CONFLICT (code) DO UPDATE SET
      type = EXCLUDED.type, value = EXCLUDED.value,
      min_subtotal = EXCLUDED.min_subtotal, active = EXCLUDED.active`;
}

export async function deleteCoupon(code: string): Promise<void> {
  await ready();
  await sql`DELETE FROM mks_coupons WHERE code = ${code.toUpperCase()}`;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ ok: boolean; discount: number; code?: string; message: string }> {
  await ready();
  const { rows } = await sql`SELECT * FROM mks_coupons WHERE code = ${code.trim().toUpperCase()} AND active = TRUE`;
  if (rows.length === 0) return { ok: false, discount: 0, message: "Invalid or expired code" };
  const c = toCoupon(rows[0]);
  if (subtotal < c.min_subtotal)
    return { ok: false, discount: 0, message: `Add more to reach ₹${c.min_subtotal}` };
  const discount = computeDiscount(c, subtotal);
  return { ok: true, discount, code: c.code, message: `You saved ₹${discount}` };
}

// ---------- Orders ----------

function toOrder(r: any): Order {
  const items = typeof r.items === "string" ? JSON.parse(r.items) : r.items;
  return {
    id: r.id,
    created_at: new Date(r.created_at).toISOString(),
    name: r.name,
    phone: r.phone,
    address: r.address,
    notes: r.notes ?? "",
    items: (items || []) as OrderItem[],
    subtotal: Number(r.subtotal),
    discount: Number(r.discount || 0),
    total: Number(r.total),
    coupon_code: r.coupon_code || null,
    count: Number(r.count),
    status: r.status as OrderStatus,
  };
}

export async function createOrder(input: {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  coupon_code?: string | null;
  count: number;
}): Promise<Order> {
  await ready();
  const id = `MKS-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;
  const discount = input.discount || 0;
  const total = Math.max(0, input.subtotal - discount);
  await sql`INSERT INTO mks_orders (id, name, phone, address, notes, items, subtotal, discount, total, coupon_code, count, status)
    VALUES (${id}, ${input.name}, ${input.phone}, ${input.address}, ${input.notes || ""},
      ${JSON.stringify(input.items)}::jsonb, ${input.subtotal}, ${discount}, ${total},
      ${input.coupon_code || null}, ${input.count}, 'new')`;
  const { rows } = await sql`SELECT * FROM mks_orders WHERE id = ${id}`;
  return toOrder(rows[0]);
}

export async function listOrders(limit = 500): Promise<Order[]> {
  await ready();
  const { rows } = await sql`SELECT * FROM mks_orders ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map(toOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await ready();
  await sql`UPDATE mks_orders SET status = ${status} WHERE id = ${id}`;
}

export async function deleteOrder(id: string): Promise<void> {
  await ready();
  await sql`DELETE FROM mks_orders WHERE id = ${id}`;
}

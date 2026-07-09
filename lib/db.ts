import "server-only";
import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import type { Order, OrderItem, OrderStatus } from "./orders";

// -------------------------------------------------------------------
//  Storage:
//   - Local dev  -> a SQLite file (file:./data/orders.db), works instantly
//   - Production -> set TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) on Vercel.
//     Free DB in 2 min:  https://turso.tech  ->  create db  ->  copy URL+token
// -------------------------------------------------------------------

let _client: Client | null = null;
let _ready: Promise<void> | null = null;

function client(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./data/orders.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (url.startsWith("file:")) {
    try {
      mkdirSync("./data", { recursive: true });
    } catch {}
  }
  _client = createClient(authToken ? { url, authToken } : { url });
  return _client;
}

function ready(): Promise<void> {
  if (!_ready) {
    _ready = client()
      .execute(
        `CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          address TEXT NOT NULL,
          notes TEXT NOT NULL DEFAULT '',
          items TEXT NOT NULL,
          subtotal INTEGER NOT NULL,
          count INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'new'
        )`
      )
      .then(() => {});
  }
  return _ready;
}

function rowToOrder(r: any): Order {
  return {
    id: String(r.id),
    created_at: String(r.created_at),
    name: String(r.name),
    phone: String(r.phone),
    address: String(r.address),
    notes: String(r.notes ?? ""),
    items: JSON.parse(String(r.items || "[]")) as OrderItem[],
    subtotal: Number(r.subtotal),
    count: Number(r.count),
    status: String(r.status) as OrderStatus,
  };
}

export async function createOrder(input: {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  count: number;
}): Promise<Order> {
  await ready();
  const id = `MKS-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;
  const created_at = new Date().toISOString();
  await client().execute({
    sql: `INSERT INTO orders (id, created_at, name, phone, address, notes, items, subtotal, count, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
    args: [
      id,
      created_at,
      input.name,
      input.phone,
      input.address,
      input.notes || "",
      JSON.stringify(input.items),
      input.subtotal,
      input.count,
    ],
  });
  return { id, created_at, status: "new", notes: input.notes || "", ...input };
}

export async function listOrders(limit = 500): Promise<Order[]> {
  await ready();
  const res = await client().execute({
    sql: `SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`,
    args: [limit],
  });
  return res.rows.map(rowToOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await ready();
  await client().execute({
    sql: `UPDATE orders SET status = ? WHERE id = ?`,
    args: [status, id],
  });
}

// Shared order types (used by API, dashboard and checkout)

export type OrderItem = {
  id: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
};

export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

export type Order = {
  id: string;
  created_at: string; // ISO
  name: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  count: number;
  status: OrderStatus;
};

export type Coupon = {
  code: string;
  type: "percent" | "flat";
  value: number;
  min_subtotal: number;
  active: boolean;
};

// Admin view of a product (adds active/sort to the storefront Product)
export type AdminProduct = {
  id: string;
  name: string;
  desc: string;
  price: number;
  unit: string;
  category: string;
  emoji: string;
  image?: string;
  tag?: string;
  active: boolean;
  sort: number;
};

export function computeDiscount(c: Pick<Coupon, "type" | "value">, subtotal: number): number {
  if (c.type === "percent") return Math.round((subtotal * c.value) / 100);
  return Math.min(c.value, subtotal);
}

export const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-turmeric/20 text-jaggery border-turmeric/40" },
  confirmed: { label: "Confirmed", className: "bg-forest/15 text-forest border-forest/30" },
  delivered: { label: "Delivered", className: "bg-green-600/15 text-green-700 border-green-600/30" },
  cancelled: { label: "Cancelled", className: "bg-clay/15 text-clay border-clay/30" },
};

export const STATUS_ORDER: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];

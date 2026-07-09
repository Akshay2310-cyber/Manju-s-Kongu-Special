// =============================================================
//  EDIT EVERYTHING ABOUT YOUR SHOP HERE
//  (brand name, WhatsApp number, delivery note, products & prices)
// =============================================================

export const shop = {
  // Your brand — change the name/tagline freely
  name: "Amma's Kitchen",
  tagline: "Homemade masalas & organic sweetness",
  subtagline:
    "Stone-ground spices and pure country jaggery, made fresh in small batches at home.",

  // WhatsApp number that receives EVERY order (with country code, no +, no spaces).
  // Yours: 63648 58213 in India  ->  91 63648 58213
  whatsappNumber: "916364858213",

  // Shown at checkout so customers know what to expect
  deliveryNote:
    "Orders are confirmed on WhatsApp. We reply with payment (UPI) & delivery details.",

  // Small trust badges under the hero
  badges: ["100% Homemade", "No preservatives", "Fresh small batches", "Delivered to your door"],

  currency: "₹",
  // Free-delivery hint shown in the cart (set to 0 to hide)
  freeDeliveryAbove: 499,

  // Social / contact (optional — leave "" to hide)
  instagram: "",
  location: "Bengaluru, India",
};

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  unit: string; // e.g. "250 g", "1 kg"
  category: CategoryId;
  emoji: string; // simple visual until you add real photos
  image?: string; // optional: put a file in /public and set "/myphoto.jpg"
  tag?: string; // small badge e.g. "Bestseller"
};

export type CategoryId = "masala" | "sugar" | "vellam";

export const categories: { id: CategoryId; label: string; blurb: string; emoji: string }[] = [
  { id: "masala", label: "Homemade Masalas", blurb: "Roasted & stone-ground", emoji: "🌶️" },
  { id: "sugar", label: "Organic Sugar", blurb: "Chemical-free & natural", emoji: "🍚" },
  { id: "vellam", label: "Jaggery / Vellam", blurb: "Pure & unrefined", emoji: "🟤" },
];

export const products: Product[] = [
  // ---- Homemade Masalas ----
  { id: "sambar", name: "Sambar Powder", desc: "Roasted dals, red chilli & curry leaf. The heart of every sambar.", price: 120, unit: "250 g", category: "masala", emoji: "🍲", tag: "Bestseller" },
  { id: "rasam", name: "Rasam Powder", desc: "Peppery, tangy blend for a warm, comforting rasam.", price: 110, unit: "250 g", category: "masala", emoji: "🥣" },
  { id: "garam", name: "Garam Masala", desc: "Hand-blended warming spices for curries & biryani.", price: 140, unit: "200 g", category: "masala", emoji: "🌿" },
  { id: "chilli", name: "Red Chilli Powder", desc: "Sun-dried Guntur chillies, freshly ground. Bright & fiery.", price: 90, unit: "250 g", category: "masala", emoji: "🌶️" },
  { id: "turmeric", name: "Turmeric Powder", desc: "Single-origin, high-curcumin. Earthy and golden.", price: 80, unit: "200 g", category: "masala", emoji: "🟡" },
  { id: "idlipodi", name: "Idli Podi", desc: "Gunpowder of roasted dals & sesame. Mix with ghee.", price: 130, unit: "250 g", category: "masala", emoji: "🫓", tag: "Loved" },

  // ---- Organic Sugar ----
  { id: "cane-sugar", name: "Organic Cane Sugar", desc: "Unbleached, chemical-free crystals. Light golden.", price: 95, unit: "1 kg", category: "sugar", emoji: "🍚" },
  { id: "brown-sugar", name: "Organic Brown Sugar", desc: "Rich, moist & minimally processed. Great for baking.", price: 110, unit: "1 kg", category: "sugar", emoji: "🟫" },

  // ---- Jaggery / Vellam ----
  { id: "nattu-sakkarai", name: "Nattu Sakkarai", desc: "Country sugar — traditional, mineral-rich sweetener.", price: 130, unit: "500 g", category: "vellam", emoji: "🟤", tag: "Bestseller" },
  { id: "palm-jaggery", name: "Palm Jaggery (Karupatti)", desc: "Dark, deep-flavoured palm jaggery. Pure & unrefined.", price: 180, unit: "500 g", category: "vellam", emoji: "🍯" },
  { id: "cane-jaggery", name: "Cane Jaggery Block", desc: "Classic golden vellam block. No additives.", price: 90, unit: "500 g", category: "vellam", emoji: "🟨" },
];

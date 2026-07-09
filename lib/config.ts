// =============================================================
//  EDIT EVERYTHING ABOUT YOUR SHOP HERE
//  (brand name, WhatsApp number, delivery note, products & prices)
//
//  NOTE: prices below are PLACEHOLDERS (the menu poster has none).
//  Update every `price:` to your real rate before going live.
// =============================================================

import { generatedImages, generatedHero } from "./assets.generated";

export const shop = {
  // Brand (from your logo / menu)
  name: "Manju's Kongu Special",
  tagline: "Farm-fresh masalas & hand-pressed oils",
  subtagline:
    "From our home to yours. Pure, authentic and healthy, crafted with care the traditional Kongu way.",

  // Logo file. Drop your logo image in /public and set the name here.
  logo: "/logo.png",

  // WhatsApp number that receives EVERY order (country code, no + or spaces).
  // You asked for 63648 58213 -> 916364858213.
  // (Your poster shows 8296996751 / 7349128364. Change here if you prefer those.)
  whatsappNumber: "916364858213",

  deliveryNote:
    "Orders are confirmed on WhatsApp. We reply with payment (UPI) & doorstep delivery details.",

  badges: [
    "100% Natural & Pure",
    "No preservatives or chemicals",
    "Hygienically prepared",
    "Traditionally made",
    "Doorstep delivery",
  ],

  currency: "₹",
  freeDeliveryAbove: 999,

  instagram: "",
  // Where you deliver
  targetAreas: ["Gobichettipalayam", "Bengaluru"],
  location: "Gobichettipalayam & Bengaluru",

  // Your live site URL (used for social share previews). Update after deploy.
  siteUrl: "https://manju-s-kongu-special.vercel.app",
};

export const assets = {
  heroImage: generatedHero.image, // AI hero still (fallback)
  heroVideo: "/hero-web.mp4", // web-optimized HD Veo render
  heroPoster: "/hero-poster.jpg",
};

// "How it's made" story (real photos from the kitchen)
export const processSteps: { img: string; title: string; text: string }[] = [
  { img: "/process/select.jpg", title: "Hand-selected", text: "Ingredients chosen with strict quality checks, stones and damaged pods removed." },
  { img: "/process/sun.jpg", title: "Sun-dried", text: "Whole chillies and spices dried naturally under the sun the traditional way." },
  { img: "/process/roast.jpg", title: "Slow-roasted", text: "Roasted in small batches over gentle heat to lock in aroma and flavour." },
  { img: "/process/grind.jpg", title: "Stone-ground", text: "Freshly ground to the perfect texture, never bulk-processed." },
  { img: "/process/pack.jpg", title: "Packed with care", text: "Sealed fresh and hygienically, ready to travel from our home to yours." },
];

// Real behind-the-scenes clips (portrait reels)
export const reels: { src: string; poster: string; caption: string }[] = [
  { src: "/reels/r2.mp4", poster: "/reels/r2.jpg", caption: "Roasting chillies" },
  { src: "/reels/r3.mp4", poster: "/reels/r3.jpg", caption: "Roasting lentils" },
  { src: "/reels/r1.mp4", poster: "/reels/r1.jpg", caption: "Sun-drying" },
  { src: "/reels/r4.mp4", poster: "/reels/r4.jpg", caption: "Sorting by hand" },
];

// Customer reviews (from real WhatsApp feedback)
export const testimonials: { name: string; text: string; product: string }[] = [
  { name: "Happy customer", text: "The rasam masala was so good, with balanced spices and a perfect blend of aroma. Overall it was great and satisfying!", product: "Rasam Powder" },
  { name: "Happy customer", text: "Idli powder is also very tasty. Goes perfect with idli and dosa. Loved it!", product: "Idli Powder" },
  { name: "Regular buyer", text: "You can really taste the freshness. Feels just like homemade, exactly how amma makes it.", product: "Sambar Powder" },
];

export type CategoryId = "oil" | "masala" | "sweet";

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  unit: string;
  category: CategoryId;
  emoji: string;
  image?: string;
  tag?: string;
  imgPrompt?: string;
};

type RawCategory = {
  id: CategoryId;
  label: string;
  blurb: string;
  emoji: string;
  image?: string;
  imgPrompt?: string;
};

const rawCategories: RawCategory[] = [
  {
    id: "oil",
    label: "Wood-Pressed Oils",
    blurb: "Hand-pressed, chekku",
    emoji: "🫗",
    imgPrompt:
      "Several glass bottles of golden wood-pressed oils (coconut, groundnut, sesame) with fresh coconuts, groundnuts and sesame seeds around them, rustic wooden background, warm natural light, traditional Indian chekku oil, product food photography, high detail",
  },
  {
    id: "masala",
    label: "Authentic Masala Powders",
    blurb: "Sun-dried & stone-ground",
    emoji: "🌶️",
    imgPrompt:
      "Overhead flat lay of vibrant Indian spice powders (turmeric, chilli, coriander, sambar) in rustic wooden bowls on a dark surface, whole spices scattered around, warm natural light, artisanal homemade feel, food photography, high detail",
  },
  {
    id: "sweet",
    label: "Healthy Sweeteners",
    blurb: "Unrefined & natural",
    emoji: "🟤",
    imgPrompt:
      "Rustic blocks of golden brown country jaggery (nattu vellam) and a bowl of country sugar with fresh sugarcane stalks, warm earthy tones, traditional Indian, natural light, food photography, high detail",
  },
];

// Prices are placeholders. Replace with your real rates.
const rawProducts: Product[] = [
  // ---- Wood-Pressed Oils ----
  { id: "coconut-oil", name: "Coconut Oil", desc: "Wood-pressed. Natural & chemical-free. Great for cooking, skin & hair.", price: 400, unit: "500 ml", category: "oil", emoji: "🥥", tag: "Bestseller",
    imgPrompt: "A glass bottle of clear golden wood-pressed coconut oil with a fresh whole coconut and coconut halves beside it, rustic wooden surface, warm natural light, traditional chekku oil, product food photography" },
  { id: "groundnut-oil", name: "Ground Nut Oil", desc: "Heart-healthy and rich in nutrients. Ideal for daily cooking.", price: 350, unit: "1 L", category: "oil", emoji: "🥜",
    imgPrompt: "A glass bottle of golden wood-pressed groundnut oil with raw peanuts scattered around, rustic wooden surface, warm natural light, traditional chekku oil, product food photography" },
  { id: "gingelly-oil", name: "Gingelly (Sesame) Oil", desc: "Rich in antioxidants. Good for bones & skin, with a traditional taste.", price: 480, unit: "500 ml", category: "oil", emoji: "🫙",
    imgPrompt: "A glass bottle of amber wood-pressed sesame gingelly oil with sesame seeds scattered around, rustic wooden surface, warm natural light, traditional chekku oil, product food photography" },
  { id: "castor-oil", name: "Castor Oil", desc: "Cold-pressed and pure. Nourishes hair and skin, a traditional remedy.", price: 75, unit: "200 ml", category: "oil", emoji: "💧",
    imgPrompt: "A glass bottle of thick pale golden cold-pressed castor oil with castor seeds scattered beside it, rustic wooden surface, warm natural light, traditional Indian oil, product photography" },
  { id: "neem-oil", name: "Neem Oil", desc: "Supports scalp health and hair growth. Anti-bacterial, pure & natural.", price: 60, unit: "100 ml", category: "oil", emoji: "🌿",
    imgPrompt: "A glass bottle of neem oil with fresh green neem leaves around it, rustic wooden surface, natural light, traditional Indian herbal oil, product photography" },

  // ---- Authentic Masala Powders ----
  { id: "turmeric", name: "Organic Turmeric Powder", desc: "Pure, organic and natural, with rich colour and aroma.", price: 600, unit: "1 kg", category: "masala", emoji: "🟡",
    imgPrompt: "A wooden bowl of vivid golden yellow turmeric powder with fresh turmeric roots beside it, rustic dark surface, warm light, homemade Indian spice, product food photography" },
  { id: "chilli", name: "Chilli Powder", desc: "Spicy & flavourful, from premium-quality chillies.", price: 90, unit: "250 g", category: "masala", emoji: "🌶️", tag: "Bestseller",
    imgPrompt: "A wooden bowl of bright red chilli powder with whole dried red chillies scattered around, dark background, dramatic warm light, homemade Indian spice, product food photography" },
  { id: "coriander", name: "Coriander Powder", desc: "Aromatic & pure. Perfect for all recipes.", price: 90, unit: "250 g", category: "masala", emoji: "🌾",
    imgPrompt: "A wooden bowl of light brown coriander powder with coriander seeds scattered around, dark rustic surface, warm light, homemade Indian spice, product food photography" },
  { id: "sambar", name: "Sambar Powder", desc: "Authentic taste, a perfect blend of roasted spices.", price: 120, unit: "250 g", category: "masala", emoji: "🍲",
    imgPrompt: "A wooden bowl of deep red-brown sambar powder with curry leaves and dried red chillies beside it, dark rustic background, warm light, homemade Indian spice, product food photography" },
  { id: "garam", name: "Garam Masala", desc: "Rich & aromatic. Enhances taste naturally.", price: 140, unit: "200 g", category: "masala", emoji: "🫖",
    imgPrompt: "A wooden bowl of dark brown garam masala powder surrounded by whole spices: cardamom, cinnamon, cloves, star anise, rustic surface, warm light, product food photography" },
  { id: "curry-masala", name: "Curry Masala", desc: "Traditional blend, perfect for everyday cooking.", price: 120, unit: "250 g", category: "masala", emoji: "🥘",
    imgPrompt: "A wooden bowl of reddish-brown curry masala powder with whole spices scattered around, dark rustic surface, warm light, homemade Indian spice, product food photography" },
  { id: "idli-podi", name: "Idli Powder", desc: "Spicy & tangy. The perfect side companion. Mix with oil or ghee.", price: 130, unit: "250 g", category: "masala", emoji: "🫓", tag: "Loved",
    imgPrompt: "A wooden bowl of coarse reddish-brown idli podi gunpowder with sesame seeds and roasted lentils scattered, dark rustic surface, warm light, South Indian, product food photography" },

  // ---- Healthy Sweeteners ----
  { id: "nattu-vellam", name: "Organic Nattu Vellam", desc: "Country jaggery. 100% natural, rich in minerals, boosts immunity and aids digestion.", price: 90, unit: "500 g", category: "sweet", emoji: "🟤", tag: "Bestseller",
    imgPrompt: "Rustic golden brown country jaggery (nattu vellam) blocks stacked with fresh sugarcane stalks in the background, warm earthy tones, traditional South Indian, natural light, product food photography" },
  { id: "nattu-sakkarai", name: "Organic Naattu Sakkarai", desc: "Country sugar. Unrefined, chemical-free natural energy and a healthy choice.", price: 130, unit: "500 g", category: "sweet", emoji: "🟫",
    imgPrompt: "A wooden bowl of golden brown country sugar (naattu sakkarai) with fresh sugarcane stalks beside it, rustic wooden surface, warm earthy light, traditional Indian, product food photography" },
];

export const categories = rawCategories.map((c) => ({
  ...c,
  image: c.image || generatedImages[`cat-${c.id}`] || undefined,
}));

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: p.image || generatedImages[p.id] || undefined,
}));

// Look up any generated image by id (hero, cat-*, product ids, feature ids like "usp-natural").
export function assetImage(id: string): string | undefined {
  return generatedImages[id] || undefined;
}

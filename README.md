# Amma's Kitchen — WhatsApp storefront

A modern, mobile-first shop for homemade masalas & organic sugar/jaggery.
Customers browse, add to cart, fill their details, and tap **"Place order on
WhatsApp"** — this opens WhatsApp with the whole order pre-typed and sends it
straight to your number. No backend, no cost, no Meta approval.

## Where to edit things

**Everything you'll change lives in one file:** [`lib/config.ts`](lib/config.ts)

- `shop.name`, `shop.tagline` — your brand
- `shop.whatsappNumber` — the number that receives orders (currently `916364858213`)
- `products` — add/remove items, change names, prices, units, categories, emoji
- To use real photos: drop a file in `/public` (e.g. `sambar.jpg`) and set
  `image: "/sambar.jpg"` on that product.

## Run locally

```bash
npm install
npm run dev      # open http://localhost:3000
```

## Deploy to Vercel

**Option A — from the dashboard (easiest):**
1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo → Deploy. Zero config.

**Option B — from the terminal:**
```bash
npm i -g vercel
vercel            # first run links/creates the project
vercel --prod     # deploys to production
```

## How the WhatsApp order works

The order message is built in [`lib/cart.tsx`](lib/cart.tsx) (`buildWhatsAppOrder`)
and opened via `https://wa.me/<number>?text=<order>`. The customer's own WhatsApp
sends it to you, so every lead lands in your chats as your order log.

# Manju's Kongu Special · WhatsApp storefront

A modern, mobile-first, Apple-style bento storefront for farm-fresh masalas,
wood-pressed oils and healthy sweeteners. Customers browse, add to cart, fill
their details and tap **"Place order on WhatsApp"**, which opens WhatsApp with
the whole order pre-typed and sends it straight to your number. No backend, no
cost, no Meta approval.

## Everything you edit lives in one file

[`lib/config.ts`](lib/config.ts):

- `shop.name`, `shop.tagline`, `shop.logo`
- `shop.whatsappNumber`: the number that receives orders (currently `916364858213`)
- `products`: names, **prices** (currently placeholders, update them), units, categories
- `categories`: the three sections (oils / masalas / sweeteners)

## Your logo

Save your logo image as `public/logo.png` (or update `shop.logo` to whatever you
name it). Until it exists, the header shows a simple fallback badge.

## AI imagery (Google Gemini)

Product / category / hero images are generated once on your machine and saved as
static files in `public/generated`. The API key never reaches the browser.

```bash
cp .env.local.example .env.local     # then paste your key inside
npm run generate                     # generate all images
npm run generate -- --video          # also render a hero video (needs Veo access)
npm run generate -- --force          # re-generate even if a file already exists
```

Get a free key at https://aistudio.google.com/apikey. Generated files are committed
so Vercel serves them. Re-run `generate` whenever you add or rename products.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000  (use -- -p 3100 for another port)
```

## Deploy to Vercel

**From the dashboard:** push this folder to a GitHub repo, then vercel.com to
New Project to import to Deploy. Zero config.

**From the terminal:**
```bash
npm i -g vercel
vercel                 # first run links / creates the project
vercel --prod          # ships to production
```

## How the WhatsApp order works

The order message is built in [`lib/cart.tsx`](lib/cart.tsx) (`buildWhatsAppOrder`)
and opened via `https://wa.me/<number>?text=<order>`. The customer's own WhatsApp
sends it to you, so every lead lands in your chats as your order log.

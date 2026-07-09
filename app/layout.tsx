import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Playfair_Display } from "next/font/google";
import { shop, assets } from "@/lib/config";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const brand = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Image shown in WhatsApp / Instagram / social link previews.
const shareImage = assets.heroImage || "/logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(shop.siteUrl),
  title: `${shop.name} · ${shop.tagline}`,
  description: shop.subtagline,
  keywords: [
    "wood pressed oil",
    "homemade masala",
    "nattu vellam",
    "country sugar",
    "Gobichettipalayam",
    "Bengaluru",
    shop.name,
  ],
  openGraph: {
    title: `${shop.name} · ${shop.tagline}`,
    description: shop.subtagline,
    url: shop.siteUrl,
    siteName: shop.name,
    type: "website",
    locale: "en_IN",
    images: [{ url: shareImage, width: 1024, height: 1024, alt: shop.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${shop.name} · ${shop.tagline}`,
    description: shop.subtagline,
    images: [shareImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#8a2b2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${brand.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

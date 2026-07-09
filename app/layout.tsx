import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { shop } from "@/lib/config";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${shop.name} — ${shop.tagline}`,
  description: shop.subtagline,
  openGraph: {
    title: `${shop.name} — ${shop.tagline}`,
    description: shop.subtagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f5741",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

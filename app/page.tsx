import { CartProvider } from "@/lib/cart";
import { getStoreProducts } from "@/lib/db";
import { products as seed, type Product } from "@/lib/config";
import Header from "@/components/Header";
import BentoHero from "@/components/BentoHero";
import StatStrip from "@/components/StatStrip";
import Catalog from "@/components/Catalog";
import ProcessStory from "@/components/ProcessStory";
import Reels from "@/components/Reels";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CartSheet from "@/components/CartSheet";
import FloatingCartBar from "@/components/FloatingCartBar";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

// Products come from the DB (editable in /admin). Falls back to the seed
// config if the DB is unavailable, so the storefront never breaks.
export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = seed;
  try {
    const fromDb = await getStoreProducts();
    if (fromDb.length) products = fromDb;
  } catch {
    // keep seed fallback
  }

  return (
    <CartProvider products={products}>
      <Header />
      <main>
        <BentoHero />
        <StatStrip />
        <Catalog />
        <ProcessStory />
        <Reels />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
      <FloatingCartBar />
      <ChatWidget />
      <CartSheet />
    </CartProvider>
  );
}

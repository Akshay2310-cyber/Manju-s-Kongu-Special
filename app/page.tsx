import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import BentoHero from "@/components/BentoHero";
import Catalog from "@/components/Catalog";
import CartSheet from "@/components/CartSheet";
import FloatingCartBar from "@/components/FloatingCartBar";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <CartProvider>
      <Header />
      <main>
        <BentoHero />
        <Catalog />
      </main>
      <Footer />
      <FloatingCartBar />
      <ChatWidget />
      <CartSheet />
    </CartProvider>
  );
}

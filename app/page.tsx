import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import CartSheet from "@/components/CartSheet";
import FloatingCartBar from "@/components/FloatingCartBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <CartProvider>
      <Header />
      <main>
        <Hero />
        <Catalog />
      </main>
      <Footer />
      <FloatingCartBar />
      <CartSheet />
    </CartProvider>
  );
}

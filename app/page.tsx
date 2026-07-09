import { CartProvider } from "@/lib/cart";
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

export default function Home() {
  return (
    <CartProvider>
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

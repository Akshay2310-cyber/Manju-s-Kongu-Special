import { shop } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-sand bg-forest text-cream">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/15 text-lg">🌿</span>
          <span className="font-display text-lg font-semibold">{shop.name}</span>
        </div>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">{shop.subtagline}</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/80">
          <a
            href={`https://wa.me/${shop.whatsappNumber}`}
            target="_blank"
            className="hover:text-turmeric"
          >
            💬 Chat on WhatsApp
          </a>
          {shop.location && <span>📍 {shop.location}</span>}
          {shop.instagram && (
            <a href={shop.instagram} target="_blank" className="hover:text-turmeric">
              📷 Instagram
            </a>
          )}
        </div>
        <p className="mt-8 text-xs text-cream/40">
          © {shop.name}. All orders confirmed & delivered via WhatsApp.
        </p>
      </div>
    </footer>
  );
}

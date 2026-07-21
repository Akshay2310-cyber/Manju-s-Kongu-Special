import Image from "next/image";
import { shop, categories, assetImage } from "@/lib/config";

export default function Footer() {
  const footerImg = assetImage("footer");
  const waHref = `https://wa.me/${shop.whatsappNumber}`;

  return (
    <footer className="relative overflow-hidden bg-forest-dark text-cream">
      {footerImg && (
        <Image
          src={footerImg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/90 to-forest-dark" />

      <div className="relative mx-auto max-w-5xl px-5 py-12">
        {/* top: brand + WhatsApp CTA */}
        <div className="flex flex-col gap-6 border-b border-cream/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-cream">
              <Image src={shop.logoMark} alt={shop.name} width={48} height={48} className="h-12 w-12 rounded-full object-contain" />
            </span>
            <div>
              <div className="font-brand text-xl font-semibold leading-tight text-cream">{shop.name}</div>
              <div className="text-sm text-cream/70">{shop.tagline}</div>
            </div>
          </div>
          <a
            href={waHref}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-card transition active:scale-95"
          >
            <WhatsAppIcon /> Order on WhatsApp
          </a>
        </div>

        {/* columns */}
        <div className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-turmeric">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`#cat-${c.id}`} className="transition hover:text-turmeric">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-turmeric">
              We deliver to
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              {shop.targetAreas.map((a) => (
                <li key={a} className="flex items-center gap-1.5">
                  <span className="text-turmeric">📍</span> {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-turmeric">Why us</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>100% natural & pure</li>
              <li>No preservatives</li>
              <li>Traditionally made</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-turmeric">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <a href={waHref} target="_blank" className="transition hover:text-turmeric">
                  💬 Chat on WhatsApp
                </a>
              </li>
              {shop.instagram && (
                <li>
                  <a href={shop.instagram} target="_blank" className="transition hover:text-turmeric">
                    📷 Instagram
                  </a>
                </li>
              )}
              <li className="text-cream/60">Doorstep delivery</li>
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <span>© {shop.name} Foods. Homemade · Pure · Wholesome.</span>
          <span>Serving {shop.targetAreas.join(" & ")}</span>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

import Image from "next/image";
import { shop, assets, categories, assetImage } from "@/lib/config";

export default function BentoHero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pb-4 pt-6 sm:pt-10">
      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-3 md:grid-cols-4">
        {/* ---- Brand / hero tile ---- */}
        <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl bg-forest text-cream shadow-soft">
          {assets.heroVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-45"
              src={assets.heroVideo}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : assets.heroImage ? (
            <Image
              src={assets.heroImage}
              alt=""
              fill
              priority
              sizes="(max-width:768px) 100vw, 560px"
              className="object-cover opacity-45 transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(224,165,63,0.35),transparent_55%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest/40 to-transparent" />

          <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <span className="font-brand text-lg font-semibold tracking-wide text-turmeric sm:text-xl">
                {shop.name}
              </span>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cream/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-turmeric" />
                Order in seconds on WhatsApp
              </span>
            </div>
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.02] sm:text-6xl">
                {shop.tagline}
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/80 sm:text-base">
                {shop.subtagline}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 rounded-full bg-turmeric px-5 py-2.5 text-sm font-semibold text-ink shadow-card transition active:scale-95"
                >
                  Shop the pantry
                </a>
                <a
                  href={`https://wa.me/${shop.whatsappNumber}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-5 py-2.5 text-sm font-semibold text-cream backdrop-blur-sm transition active:scale-95"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Category tiles ---- */}
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#cat-${cat.id}`}
            className="group relative col-span-1 overflow-hidden rounded-3xl bg-sand shadow-card transition active:scale-[0.98]"
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width:768px) 50vw, 260px"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sand to-cream">
                <span className="text-5xl opacity-90 transition duration-500 group-hover:scale-110">
                  {cat.emoji}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="font-display text-lg font-semibold leading-tight text-cream">
                {cat.label}
              </div>
              <div className="text-xs text-cream/80">{cat.blurb}</div>
            </div>
          </a>
        ))}

        {/* ---- USP tile ---- */}
        <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl bg-turmeric p-4 text-cream shadow-card">
          {assetImage("usp-natural") ? (
            <Image
              src={assetImage("usp-natural")!}
              alt="Pure, natural ingredients"
              fill
              sizes="(max-width:768px) 50vw, 260px"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-jaggery/90 via-jaggery/40 to-jaggery/10" />
          <span className="relative text-2xl">🌾</span>
          <div className="relative">
            <div className="font-display text-xl font-semibold leading-tight">No preservatives</div>
            <div className="mt-0.5 text-xs text-cream/80">Ever. Just real ingredients.</div>
          </div>
        </div>
      </div>

      {/* ---- trust strip ---- */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {shop.badges.map((b) => (
          <span
            key={b}
            className="whitespace-nowrap rounded-full border border-sand bg-white/60 px-3 py-1.5 text-xs font-medium text-jaggery"
          >
            ✓ {b}
          </span>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import { shop, assets, categories, assetImage } from "@/lib/config";
import { Button } from "./ui/button";
import Reveal from "./Reveal";

export default function BentoHero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pb-4 pt-6 sm:pt-10">
      <Reveal
        as="div"
        stagger
        className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-3 md:grid-cols-4"
      >
        {/* ---- Brand / hero tile with HD video ---- */}
        <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl bg-forest text-cream shadow-soft">
          {assets.heroVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              src={assets.heroVideo}
              poster={assets.heroPoster || undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : assets.heroImage ? (
            <Image src={assets.heroImage} alt="" fill priority sizes="(max-width:768px) 100vw, 560px" className="object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(224,165,63,0.35),transparent_55%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/55 to-transparent" />

          <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
            <div>
              <h1 className="font-brand text-4xl font-semibold leading-[1.02] drop-shadow-lg sm:text-6xl">
                {shop.tagline}
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/90 drop-shadow sm:text-base">
                {shop.subtagline}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="#shop" className="btn-glow">
                  <Button variant="accent" size="lg">
                    Shop the pantry
                  </Button>
                </a>
                <a href={`https://wa.me/${shop.whatsappNumber}`} target="_blank">
                  <Button variant="outline" size="lg">
                    Chat with us
                  </Button>
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
              <Image src={cat.image} alt={cat.label} fill sizes="(max-width:768px) 50vw, 260px" className="object-cover transition duration-700 group-hover:scale-110" />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sand to-cream">
                <span className="text-5xl opacity-90 transition duration-500 group-hover:scale-110">{cat.emoji}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="font-brand text-lg font-semibold leading-tight text-cream">{cat.label}</div>
              <div className="text-xs text-cream/80">{cat.blurb}</div>
            </div>
          </a>
        ))}

        {/* ---- USP tile (with image) ---- */}
        <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl p-4 text-cream shadow-card">
          {assetImage("usp-natural") ? (
            <Image src={assetImage("usp-natural")!} alt="Pure, natural ingredients" fill sizes="(max-width:768px) 50vw, 260px" className="object-cover transition duration-700 group-hover:scale-110" />
          ) : (
            <div className="absolute inset-0 bg-turmeric" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
          <span className="relative text-2xl">🌾</span>
          <div className="relative">
            <div className="font-brand text-xl font-semibold leading-tight">No preservatives</div>
            <div className="mt-0.5 text-xs text-cream/85">Ever. Just real ingredients.</div>
          </div>
        </div>
      </Reveal>

      {/* ---- trust strip ---- */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
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

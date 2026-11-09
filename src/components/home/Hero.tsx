import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { home } from "@/content/home";

/** Héro plein écran : deux photos côte à côte (une seule sur mobile), titre et bouton en bas à gauche. */
export function Hero() {
  const { title, tagline, cta, images } = home.hero;
  return (
    <section className="relative min-h-svh overflow-hidden bg-ink" aria-labelledby="hero-title">
      <div className="neo-hero__media absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
        {images.map((img, i) => (
          <div key={img.src} className={i > 0 ? "relative hidden overflow-hidden sm:block" : "relative overflow-hidden"}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "50vw"}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="neo-hero__veil pointer-events-none absolute inset-0" />
      <div className="neo-hero__content absolute inset-x-0 bottom-0 z-[2] px-s50 pb-[clamp(48px,9vh,96px)] text-creme [text-shadow:0_2px_24px_rgb(16_22_27/0.45)]">
        <h1 id="hero-title" className="mb-3 text-hero leading-[0.95]">
          {title}
        </h1>
        <p className="text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.45]">{tagline}</p>
        <div className="mt-7">
          <Button href={cta.href} className="text-[1.075rem] [text-shadow:none]">
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

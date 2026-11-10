import Image from "next/image";
import { PhotoPlaceholder } from "@/components/ui/Media";
import type { Workshop } from "@/sanity/types";
import { cn } from "@/lib/cn";
import { WorkshopMore } from "./WorkshopMore";
import { RevealImage, TypeText } from "@/components/ui/Reveal";

/**
 * Un atelier de la page Ateliers (comme la V1) : visuel 4/5 sur 40 % et texte sur 60 %, écart de 88px,
 * côtés alternés d’une ligne à l’autre. Sous 782px, une colonne, visuel toujours au-dessus.
 */
export function WorkshopRow({ workshop, reverse = false }: { workshop: Workshop; reverse?: boolean }) {
  const { anchor, title, subtitle, hook, facts, paragraphs, image, placeholder } = workshop;
  return (
    <article
      aria-labelledby={anchor}
      className={cn(
        "grid gap-[50px] border-b border-filet py-[clamp(48px,7vw,96px)] last:border-b-0 min-[782px]:gap-[88px]",
        reverse ? "min-[782px]:grid-cols-[60fr_40fr]" : "min-[782px]:grid-cols-[40fr_60fr]",
      )}
    >
      <RevealImage className={cn(reverse && "min-[782px]:order-2")}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 1179}
            height={image.height ?? 1215}
            sizes="(min-width: 782px) 40vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          // TODO(sanity) : photo de l’atelier
          <PhotoPlaceholder tone={placeholder} className="aspect-[4/5] w-full" />
        )}
      </RevealImage>

      <div>
        {/* Pas de surtitre sur cette page (retiré le 10/11/2026, demande de Louis) */}
        <h2 id={anchor}>
          {title}
        </h2>
        <TypeText className="mt-1.5 font-serif text-[1.5rem] font-semibold italic text-garance" value={subtitle} />
        <TypeText className="mt-[1.2rem] text-[1.22rem] leading-[1.55] font-medium" value={hook} />

        <dl className="mt-[1.2rem] max-w-[600px] border-t border-ink">
          {facts.map((f) => (
            <div
              key={f.label}
              className="grid gap-0.5 border-b border-filet py-2.5 min-[521px]:grid-cols-[150px_minmax(0,1fr)] min-[521px]:gap-4"
            >
              <dt className="font-normal text-garance">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* Premier paragraphe visible, la suite derrière « En savoir plus » */}
        {paragraphs[0] && <TypeText className="mt-[1.2rem] leading-[1.75]" value={paragraphs[0]} />}
        {paragraphs.length > 1 && (
          <WorkshopMore anchor={anchor}>
            {paragraphs.slice(1).map((p, i) => (
              <TypeText key={i} className="mt-[1.2rem] leading-[1.75]" value={p} />
            ))}
          </WorkshopMore>
        )}
      </div>
    </article>
  );
}


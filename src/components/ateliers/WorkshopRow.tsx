import Image from "next/image";
import { Fragment } from "react";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { Kicker } from "@/components/ui/Typography";
import type { Paragraph, Workshop } from "@/content/ateliers";
import { cn } from "@/lib/cn";

/**
 * Un atelier de la page Ateliers (comme la V1) : visuel 4/5 sur 40 % et texte sur 60 %, écart de 88px,
 * côtés alternés d’une ligne à l’autre. Sous 782px, une colonne, visuel toujours au-dessus.
 */
export function WorkshopRow({ workshop, reverse = false }: { workshop: Workshop; reverse?: boolean }) {
  const { anchor, kicker, title, subtitle, hook, facts, paragraphs, image, placeholder } = workshop;
  return (
    <article
      aria-labelledby={anchor}
      className={cn(
        "grid gap-[50px] border-b border-filet py-[clamp(48px,7vw,96px)] last:border-b-0 min-[782px]:gap-[88px]",
        reverse ? "min-[782px]:grid-cols-[60fr_40fr]" : "min-[782px]:grid-cols-[40fr_60fr]",
      )}
    >
      <div className={cn(reverse && "min-[782px]:order-2")}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={1179}
            height={1215}
            sizes="(min-width: 782px) 40vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          // TODO(sanity) : photo de l’atelier
          <PhotoPlaceholder tone={placeholder} className="aspect-[4/5] w-full" />
        )}
      </div>

      <div>
        <Kicker>{kicker}</Kicker>
        <h2 id={anchor} className="mt-2">
          {title}
        </h2>
        <p className="mt-1.5 font-serif text-[1.5rem] font-semibold italic text-garance">{subtitle}</p>
        <p className="mt-[1.2rem] text-[1.22rem] leading-[1.55] font-medium">{hook}</p>

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

        {paragraphs.map((p, i) => (
          <p key={i} className="mt-[1.2rem] leading-[1.75]">
            <RichText value={p} />
          </p>
        ))}
      </div>
    </article>
  );
}

function RichText({ value }: { value: Paragraph }) {
  if (typeof value === "string") return value;
  return value.map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
    // Gras « relatif » comme la V1 : 400 sur un corps en 300
    if ("strong" in part) return <strong key={i} className="font-normal">{part.strong}</strong>;
    if ("br" in part) return <br key={i} />;
    return (
      <a key={i} href={part.href} target="_blank" rel="noreferrer noopener">
        {part.link}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  });
}

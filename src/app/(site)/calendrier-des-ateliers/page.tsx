import type { Metadata } from "next";
import Image from "next/image";
import { CalendarBoard } from "@/components/calendrier/CalendarBoard";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/sanity/lib/metadata";
import { getCalendrierPage } from "@/sanity/queries/calendrier";
import { RevealImage, TypeText } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCalendrierPage();
  return pageMetadata(seo, {
    title: "Calendrier des ateliers et festivals 2027 | Néotisse",
    description:
      "Calendrier des ateliers Néotisse : tissage, teinture végétale, conférences et festivals d’archéologie expérimentale dans les musées partenaires.",
    canonical: routes.calendrier,
  });
}

/**
 * Calendrier (V1, page 17) : en-tête (860px), « À venir » (1040px), calendrier mensuel (1240px),
 * puis « Comment participer à nos ateliers ? » (photo 40 % + texte 60 %, écart 80px).
 */
export default async function CalendrierPage() {
  const { title, intro, participation } = await getCalendrierPage();
  const { structures } = participation;

  return (
    <>
      <Section width="full" spacing="none" className="pt-[72px] pb-4">
        <div className="mx-auto grid max-w-[860px] gap-5">
          <RuledTitle as="h1">{title}</RuledTitle>
          <TypeText className="text-center text-lead" value={intro} />
        </div>
      </Section>

      <CalendarBoard />

      <Section spacing="none" className="mt-[1.2rem] pt-8 pb-28" labelledBy="participer-titre">
        <div className="grid items-center gap-y-[30px] min-[782px]:grid-cols-[40fr_60fr] min-[782px]:gap-x-20">
          <RevealImage>
          {participation.image ? (
            <Image
              src={participation.image.src}
              alt={participation.image.alt}
              width={participation.image.width ?? 1179}
              height={participation.image.height ?? 1324}
              sizes="(min-width: 782px) 40vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <PhotoPlaceholder tone="garance" className="aspect-[4/5] w-full" />
          )}
          </RevealImage>
          {/* Paragraphes en `text-wrap: pretty`, comme les styles globaux de la V1 */}
          <div className="grid gap-[1.2rem] [&_p]:text-pretty">
            <ThreadHeading id="participer-titre">{participation.title}</ThreadHeading>
            {participation.paragraphs.map((p, i) => (
              <TypeText key={i} value={p} />
            ))}
            <h3>{structures.title}</h3>
            <TypeText value={structures.text} />
            <div>
              <Button href={structures.button.href}>{structures.button.label}</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

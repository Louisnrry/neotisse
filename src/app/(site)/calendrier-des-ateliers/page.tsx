import type { Metadata } from "next";
import Image from "next/image";
import { CalendarBoard } from "@/components/calendrier/CalendarBoard";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { RichText } from "@/components/ui/RichText";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { calendrierPage } from "@/content/calendrier";
import { routes } from "@/lib/routes";

// TODO(sanity) : titre et description depuis le singleton `calendrierPage`.
export const metadata: Metadata = {
  title: { absolute: calendrierPage.seo.title },
  description: calendrierPage.seo.description,
  alternates: { canonical: routes.calendrier },
};

/**
 * Calendrier (V1, page 17) : en-tête (860px), « À venir » (1040px), calendrier mensuel (1240px),
 * puis « Comment participer à nos ateliers ? » (photo 40 % + texte 60 %, écart 80px).
 */
export default function CalendrierPage() {
  const { title, intro, participation } = calendrierPage;
  const { structures } = participation;

  return (
    <>
      <Section width="full" spacing="none" className="pt-[72px] pb-4">
        <div className="mx-auto grid max-w-[860px] gap-5">
          <RuledTitle as="h1">{title}</RuledTitle>
          <p className="text-center text-lead">{intro}</p>
        </div>
      </Section>

      <CalendarBoard />

      <Section spacing="none" className="mt-[1.2rem] pt-8 pb-28" labelledBy="participer-titre">
        <div className="grid items-center gap-y-[30px] min-[782px]:grid-cols-[40fr_60fr] min-[782px]:gap-x-20">
          <Image
            src={participation.image.src}
            alt={participation.image.alt}
            width={1179}
            height={1324}
            sizes="(min-width: 782px) 40vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
          {/* Paragraphes en `text-wrap: pretty`, comme les styles globaux de la V1 */}
          <div className="grid gap-[1.2rem] [&_p]:text-pretty">
            <ThreadHeading id="participer-titre">{participation.title}</ThreadHeading>
            {participation.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText value={p} />
              </p>
            ))}
            <h3>{structures.title}</h3>
            <p>
              <RichText value={structures.text} />
            </p>
            <div>
              <Button href={structures.button.href}>{structures.button.label}</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

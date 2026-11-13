import Image from "next/image";
import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { ThreadHeading } from "@/components/ui/Typography";
import { getAProposPage } from "@/sanity/queries/aPropos";
import { RevealImage, TypeText } from "@/components/ui/Reveal";

/** « Notre démarche » : photo 4/5 à gauche (42 %), texte à droite (58 %). */
export async function Demarche() {
  const { title, image, before, after, conviction } = (await getAProposPage()).demarche;
  return (
    <Section spacing="none" className="mt-[1.2rem] pt-12 pb-24" labelledBy="demarche-titre">
      <div className="grid items-start gap-[30px] md:grid-cols-[42fr_58fr] md:gap-[88px]">
        <RevealImage className="overflow-hidden rounded-[4px]">
          {image ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <PhotoPlaceholder tone="garance" className="aspect-[4/5] w-full" />
          )}
        </RevealImage>
        <div className="grid gap-[1.2rem]">
          <ThreadHeading id="demarche-titre">{title}</ThreadHeading>
          <TypeText value={before} />
          <TypeText value={[`${after} `, { strong: conviction }]} />
        </div>
      </div>
    </Section>
  );
}

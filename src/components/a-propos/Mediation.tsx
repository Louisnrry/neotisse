import Image from "next/image";
import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { ThreadHeading } from "@/components/ui/Typography";
import { getAProposPage } from "@/sanity/queries/aPropos";
import { RevealImage, TypeText } from "@/components/ui/Reveal";

/** « Une médiation… par le geste et la matière » : grand visuel 21/9 et encart blanc qui le chevauche à droite. */
export async function Mediation() {
  const { title, text, image } = (await getAProposPage()).mediation;
  return (
    <Section spacing="none" className="mt-[1.2rem] pt-12 pb-24" labelledBy="mediation-titre">
      <RevealImage className="overflow-hidden rounded-[4px]">
      {image ? (
        <div className="relative aspect-[21/9] w-full">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
        </div>
      ) : (
        <PhotoPlaceholder tone="garance-dark" className="aspect-[21/9] w-full" />
      )}
      </RevealImage>
      <div className="flex justify-end">
        <div className="relative -mt-10 grid w-full max-w-[640px] gap-4 rounded-[4px] bg-blanc p-[44px] shadow-[0_30px_60px_-34px_rgb(30_43_51/0.3)] min-[701px]:-mt-24">
          {/* Sans équilibrage des lignes : le titre occupe toute la largeur de l’encart (demande de Louis du 13/11/2026) */}
          <ThreadHeading id="mediation-titre" className="[text-wrap:wrap]">
            {title}
          </ThreadHeading>
          <TypeText value={text} />
        </div>
      </div>
    </Section>
  );
}

import Image from "next/image";
import { Section } from "@/components/ui/Layout";
import { ThreadHeading } from "@/components/ui/Typography";
import { aPropos } from "@/content/a-propos";

/** « Notre démarche » : photo 4/5 à gauche (42 %), texte à droite (58 %) avec une phrase en exergue. */
export function Demarche() {
  const { title, image, before, pull, after, conviction } = aPropos.demarche;
  return (
    <Section spacing="none" className="mt-[1.2rem] pt-12 pb-24" labelledBy="demarche-titre">
      <div className="grid items-start gap-[30px] md:grid-cols-[42fr_58fr] md:gap-[88px]">
        {/* TODO(sanity) : image de la page */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
        </div>
        <div className="grid gap-[1.2rem]">
          <ThreadHeading id="demarche-titre">{title}</ThreadHeading>
          <p>{before}</p>
          <p className="font-serif text-pull font-bold italic leading-[1.2] text-garance">{pull}</p>
          <p>
            {after} <strong>{conviction}</strong>
          </p>
        </div>
      </div>
    </Section>
  );
}

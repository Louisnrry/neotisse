import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { getAProposPage } from "@/sanity/queries/aPropos";

/** En-tête de page : H1 à filets, sous-titre italique et présentation centrée (colonne de 860px). */
export async function AboutIntro() {
  const { title, subtitle, text } = (await getAProposPage()).intro;
  return (
    <Section width="full" spacing="none" className="pt-[72px] pb-10">
      <div className="mx-auto grid max-w-[860px] gap-5">
        <RuledTitle as="h1">{title}</RuledTitle>
        <p className="text-center font-serif text-subtitle-lg font-semibold italic text-garance">{subtitle}</p>
        <p className="text-center text-lead">{text}</p>
      </div>
    </Section>
  );
}

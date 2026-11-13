import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { getAProposPage } from "@/sanity/queries/aPropos";
import { TypeText } from "@/components/ui/Reveal";

/** En-tête de page : H1 à filets et présentation centrée (colonne de 860px). */
export async function AboutIntro() {
  const { title, text } = (await getAProposPage()).intro;
  return (
    <Section width="full" spacing="none" className="pt-[72px] pb-10">
      <div className="mx-auto grid max-w-[860px] gap-5">
        <RuledTitle as="h1">{title}</RuledTitle>
        <TypeText className="text-center text-lead" value={text} />
      </div>
    </Section>
  );
}

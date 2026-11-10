import type { Metadata } from "next";
import { PartnerCard } from "@/components/partenaires/PartnerCard";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/sanity/lib/metadata";
import { getPartenairesPage } from "@/sanity/queries/partenaires";
import { getPartners } from "@/sanity/queries/partners";
import { TypeText } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPartenairesPage();
  return pageMetadata(seo, {
    title: "Partenaires : 7 musées et lieux qui nous accueillent",
    description:
      "Partenaires de Néotisse : musées, sites archéologiques, festivals et universités qui ont accueilli nos ateliers de tissage et nos conférences.",
    canonical: routes.partenaires,
  });
}

export default async function PartenairesPage() {
  const [{ title, intro, cta }, partners] = await Promise.all([getPartenairesPage(), getPartners()]);
  return (
    <>
      {/* En-tête : H1 à filets et intro centrée (colonne de 860px) */}
      <Section width="full" spacing="none" className="pt-[72px] pb-6">
        <div className="mx-auto grid max-w-[860px] gap-5">
          <RuledTitle as="h1">{title}</RuledTitle>
          <TypeText className="text-center text-lead" value={intro} />
        </div>
      </Section>

      {/* Grille des partenaires : colonnes de 16rem minimum, écart 28px */}
      <Section spacing="none" className="mt-[1.2rem] pt-8 pb-28">
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))] gap-7">
          {partners.map((p) => (
            <PartnerCard key={p.name} partner={p} />
          ))}
        </ul>
      </Section>

      {/* Devenir partenaire : fond pierre, comme la V1 */}
      <Section tone="pierre" width="full" spacing="none" className="mt-[1.2rem] py-24" labelledBy="devenir-partenaire">
        <div className="mx-auto grid max-w-[760px] gap-7">
          <ThreadHeading id="devenir-partenaire">{cta.title}</ThreadHeading>
          <TypeText className="text-center text-lead" value={cta.text} />
          <div className="flex justify-center">
            <Button href={cta.button.href}>{cta.button.label}</Button>
          </div>
        </div>
      </Section>
    </>
  );
}

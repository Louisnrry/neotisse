import type { Metadata } from "next";
import { PartnerCard } from "@/components/partenaires/PartnerCard";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { partenairesPage } from "@/content/partenaires";
import { partners } from "@/content/partners";
import { routes } from "@/lib/routes";

// TODO(sanity) : titre et description depuis le singleton `page` « partenaires ».
export const metadata: Metadata = {
  title: { absolute: partenairesPage.seo.title },
  description: partenairesPage.seo.description,
  alternates: { canonical: routes.partenaires },
};

export default function PartenairesPage() {
  const { title, intro, cta } = partenairesPage;
  return (
    <>
      {/* En-tête : H1 à filets et intro centrée (colonne de 860px) */}
      <Section width="full" spacing="none" className="pt-[72px] pb-6">
        <div className="mx-auto grid max-w-[860px] gap-5">
          <RuledTitle as="h1">{title}</RuledTitle>
          <p className="text-center text-lead">{intro}</p>
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
          <p className="text-center text-lead">{cta.text}</p>
          <div className="flex justify-center">
            <Button href={cta.button.href}>{cta.button.label}</Button>
          </div>
        </div>
      </Section>
    </>
  );
}

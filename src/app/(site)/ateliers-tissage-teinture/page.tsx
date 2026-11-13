import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/metadata";
import { WorkshopRow } from "@/components/ateliers/WorkshopRow";
import { Button } from "@/components/ui/Button";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { routes } from "@/lib/routes";
import { getAteliersPage } from "@/sanity/queries/ateliers";
import { TypeText } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAteliersPage();
  return pageMetadata(seo, {
    title: "Tissage et teinture : 5 ateliers passionnants | Néotisse",
    description:
      "Tissage aux tablettes, filage et teinture végétale : découvrez les 5 ateliers de Néotisse pour musées, sites archéologiques et jeune public.",
    canonical: routes.ateliers,
  });
}

export default async function AteliersPage() {
  const { title, intro, audience, workshops, cta } = await getAteliersPage();
  return (
    <>
      {/* En-tête de page : titre à filets, intro, index des 5 formats */}
      <div className="px-s50 pt-[72px] pb-6">
        <div className="mx-auto max-w-section">
          <RuledTitle as="h1">{title}</RuledTitle>
          <TypeText className="mt-6 text-center text-[1.2rem]" value={intro} />
          <TypeText className="mt-6 text-center font-semibold text-gris" value={audience} />
          <nav aria-label="Nos formats d’ateliers" className="mt-8">
            {/* Liens garance séparés par des filets verticaux (garance foncé au survol) ; empilés sans filets sous 700px */}
            <ul className="flex flex-col items-center gap-y-2 py-3.5 min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:justify-center">
              {workshops.map((w) => (
                <li key={w.anchor} className="min-[700px]:px-5 min-[700px]:py-1.5 min-[700px]:[&+li]:border-l min-[700px]:[&+li]:border-ink">
                  <a
                    href={`#${w.anchor}`}
                    className="font-semibold text-garance no-underline transition-colors duration-200 hover:text-garance-dark"
                  >
                    {w.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Les 5 ateliers, visuel et texte en alternance */}
      <div className="mt-[1.2rem] px-s50 pb-[92px]">
        <div className="mx-auto max-w-section">
          {workshops.map((w, i) => (
            <WorkshopRow key={w.anchor} workshop={w} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>

      {/* Bloc final fond rouge */}
      <section aria-labelledby="ateliers-cta" className="bg-garance px-s50 py-24 text-creme">
        <div className="mx-auto grid max-w-[760px] gap-7">
          {/* Titre et texte centrés (demande de Louis du 13/11/2026 ; la V1 alignait le titre à gauche) */}
          <ThreadHeading id="ateliers-cta" tone="creme" center>
            {cta.title}
          </ThreadHeading>
          <TypeText className="text-center text-[1.2rem]" value={cta.text} />
          <div className="flex justify-center">
            <Button href={cta.button.href} variant="on-red">
              {cta.button.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

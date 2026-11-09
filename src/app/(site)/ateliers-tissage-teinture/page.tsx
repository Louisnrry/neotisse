import type { Metadata } from "next";
import { WorkshopRow } from "@/components/ateliers/WorkshopRow";
import { Button } from "@/components/ui/Button";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { ateliers } from "@/content/ateliers";
import { routes } from "@/lib/routes";

// TODO(sanity) : titre et description depuis le singleton `page` « ateliers ».
export const metadata: Metadata = {
  title: { absolute: "Tissage et teinture : 5 ateliers passionnants | Néotisse" },
  description:
    "Tissage aux tablettes, filage et teinture végétale : découvrez les 5 ateliers de Néotisse pour musées, sites archéologiques et jeune public.",
  alternates: { canonical: routes.ateliers },
};

export default function AteliersPage() {
  const { title, intro, audience, workshops, cta } = ateliers;
  return (
    <>
      {/* En-tête de page : titre à filets, intro, index des 5 formats */}
      <div className="px-s50 pt-[72px] pb-6">
        <div className="mx-auto max-w-section">
          <RuledTitle as="h1">{title}</RuledTitle>
          <p className="mt-6 text-center text-[1.2rem]">{intro}</p>
          <p className="mt-6 text-center font-semibold text-gris">{audience}</p>
          <nav aria-label="Nos formats d’ateliers" className="mt-8">
            <ul className="flex flex-wrap justify-center gap-x-9 gap-y-2 border-y border-ink py-3.5">
              {workshops.map((w) => (
                <li key={w.anchor}>
                  <a href={`#${w.anchor}`} className="font-semibold text-ink no-underline hover:text-garance">
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
          {/* Titre aligné à gauche et texte centré, comme la V1 */}
          <ThreadHeading id="ateliers-cta" tone="creme">
            {cta.title}
          </ThreadHeading>
          <p className="text-center text-[1.2rem]">{cta.text}</p>
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

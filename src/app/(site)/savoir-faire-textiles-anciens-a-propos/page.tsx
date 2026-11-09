import type { Metadata } from "next";
import { AboutIntro } from "@/components/a-propos/AboutIntro";
import { Demarche } from "@/components/a-propos/Demarche";
import { Engagements } from "@/components/a-propos/Engagements";
import { Mediation } from "@/components/a-propos/Mediation";
import { Team } from "@/components/a-propos/Team";
import { WorkTogether } from "@/components/a-propos/WorkTogether";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/sanity/lib/metadata";
import { getAProposPage } from "@/sanity/queries/aPropos";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAProposPage();
  return pageMetadata(seo, {
    title: "Savoir-faire textiles anciens : 3 engagements uniques",
    description:
      "Savoir-faire textiles anciens : découvrez l’équipe et les engagements de Néotisse, qui fait revivre filage, tissage et teinture végétale à Montpellier.",
    canonical: routes.aPropos,
  });
}

export default function AProposPage() {
  return (
    <>
      <AboutIntro />
      <Demarche />
      <Engagements />
      <Mediation />
      <Team />
      <WorkTogether />
    </>
  );
}

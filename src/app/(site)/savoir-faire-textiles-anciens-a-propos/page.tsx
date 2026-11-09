import type { Metadata } from "next";
import { AboutIntro } from "@/components/a-propos/AboutIntro";
import { Demarche } from "@/components/a-propos/Demarche";
import { Engagements } from "@/components/a-propos/Engagements";
import { Mediation } from "@/components/a-propos/Mediation";
import { Team } from "@/components/a-propos/Team";
import { WorkTogether } from "@/components/a-propos/WorkTogether";
import { aPropos } from "@/content/a-propos";
import { routes } from "@/lib/routes";

// TODO(sanity) : titre et description depuis le singleton `page` « aPropos ».
export const metadata: Metadata = {
  title: { absolute: aPropos.seo.title },
  description: aPropos.seo.description,
  alternates: { canonical: routes.aPropos },
};

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

import { partenairesPage as localPage } from "@/content/partenaires";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { SEO, type Seo } from "./fragments";

const PARTENAIRES_QUERY = `*[_id == "partenairesPage"][0]{
  ${SEO}, title, intro, cta{ title, text, button{ label, href } }
}`;

type PartenairesContent = Omit<typeof localPage, "seo"> & { seo: Seo };

/** Page Partenaires (valeurs de la V1 pour les champs vides). Les cartes sont lues à part. */
export async function getPartenairesPage(): Promise<PartenairesContent> {
  const remote = await fetchSanity<Partial<PartenairesContent>>(PARTENAIRES_QUERY);
  return withFallback(remote, localPage as PartenairesContent);
}

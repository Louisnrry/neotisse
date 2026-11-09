import { livreDorPage as localPage } from "@/content/livre-dor";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { getSiteSettings } from "./settings";
import { SEO, type Seo } from "./fragments";

const LIVRE_DOR_QUERY = `*[_id == "livreDorPage"][0]{
  ${SEO}, title, intro,
  reviews{ title, step, more, empty },
  form{ title, cardTitle, submit, sending, robot }
}`;

export type LivreDorContent = Omit<typeof localPage, "seo"> & { seo: Seo };

/** Page Livre d’or (valeurs de la V1 pour les champs vides). Les avis sont lus à part. */
export async function getLivreDorPage(): Promise<LivreDorContent> {
  const [remote, settings] = await Promise.all([
    fetchSanity<Partial<LivreDorContent>>(LIVRE_DOR_QUERY),
    getSiteSettings(),
  ]);
  return { ...withFallback(remote, localPage as LivreDorContent), email: settings.contactEmail };
}

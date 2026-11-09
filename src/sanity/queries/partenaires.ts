import { EMPTY_LINK, withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import type { Link } from "../types";
import { SEO, type Seo } from "./fragments";

const PARTENAIRES_QUERY = `*[_id == "partenairesPage"][0]{
  ${SEO}, title, intro, cta{ title, text, button{ label, href } }
}`;

export type PartenairesContent = {
  seo: Seo;
  title: string;
  intro: string;
  cta: { title: string; text: string; button: Link };
};

const EMPTY: PartenairesContent = { seo: null, title: "", intro: "", cta: { title: "", text: "", button: EMPTY_LINK } };

/** Page Partenaires. Les cartes sont lues à part (`getPartners`). */
export async function getPartenairesPage(): Promise<PartenairesContent> {
  return withDefaults(await fetchSanity(PARTENAIRES_QUERY), EMPTY);
}

import { withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import type { Paragraph } from "../types";
import { SEO, type Seo } from "./fragments";

const LIVRE_DOR_QUERY = `*[_id == "livreDorPage"][0]{
  ${SEO}, title, intro,
  reviews{ title, step, more, empty },
  form{ title, cardTitle, submit, sending, robot, legal }
}`;

export type GuestbookFormTexts = { title: string; cardTitle: string; submit: string; sending: string; robot: string };

export type LivreDorContent = {
  seo: Seo;
  title: string;
  intro: string;
  reviews: { title: string; step: number; more: string; empty: string };
  form: GuestbookFormTexts;
  /** Mention sous le formulaire (données personnelles). */
  legal: Paragraph[];
};

const EMPTY: Omit<LivreDorContent, "legal"> = {
  seo: null,
  title: "",
  intro: "",
  reviews: { title: "", step: 5, more: "", empty: "" },
  form: { title: "", cardTitle: "", submit: "Envoyer", sending: "Envoi en cours…", robot: "" },
};

/** Page Livre d’or. Les avis sont lus à part (`getReviews`). */
export async function getLivreDorPage(): Promise<LivreDorContent> {
  const remote = await fetchSanity<{ form?: { legal?: PortableBlock[] | null } | null } & Record<string, unknown>>(
    LIVRE_DOR_QUERY,
  );
  const { legal, ...form } = remote?.form ?? {};
  return { ...withDefaults({ ...remote, form }, EMPTY), legal: toParagraphs(legal) };
}

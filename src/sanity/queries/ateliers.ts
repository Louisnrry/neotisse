import { EMPTY_LINK, withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { orderByPageList, orderedListQuery } from "../lib/ordering";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import type { Link, Workshop } from "../types";
import { IMAGE, imageOrUndefined, SEO, type SanityImage, type Seo } from "./fragments";

const WORKSHOP_FIELDS = `{
  anchor, kicker, title, subtitle, hook, "facts": facts[]{ label, value },
  paragraphs, "image": image${IMAGE}, "placeholder": tileColor
}`;

// Ordre choisi sur la page Ateliers (glisser-déposer) ; sinon le champ « Ordre d’affichage ».
const ATELIERS_QUERY = `{
  "page": *[_id == "ateliersPage"][0]{
    ${SEO}, title, intro, audience, cta{ title, text, button{ label, href } }
  },
  "workshops": ${orderedListQuery("workshop", "ateliersPage", "workshops", WORKSHOP_FIELDS)}
}`;

type RemoteWorkshop = Partial<Omit<Workshop, "paragraphs" | "image">> & {
  _id: string;
  paragraphs?: PortableBlock[] | null;
  image?: Partial<SanityImage> | null;
};

export type AteliersContent = {
  seo: Seo;
  title: string;
  intro: string;
  audience: string;
  workshops: Workshop[];
  cta: { title: string; text: string; button: Link };
};

const EMPTY_PAGE: Omit<AteliersContent, "workshops"> = {
  seo: null,
  title: "",
  intro: "",
  audience: "",
  cta: { title: "", text: "", button: EMPTY_LINK },
};

const EMPTY_WORKSHOP: Workshop = {
  anchor: "",
  kicker: "",
  title: "",
  subtitle: "",
  hook: "",
  facts: [],
  paragraphs: [],
  placeholder: "garance",
};

/** Page Ateliers et ses ateliers (ceux sans titre ou sans ancre sont ignorés). */
export async function getAteliersPage(): Promise<AteliersContent> {
  const remote = await fetchSanity<{ page: unknown; workshops: { refs: string[] | null; docs: (RemoteWorkshop | null)[] | null } | null }>(ATELIERS_QUERY);
  const workshops = orderByPageList(remote?.workshops ?? null)
    .filter((w): w is RemoteWorkshop => Boolean(w?.anchor && w.title))
    .map(({ paragraphs, image, ...w }) =>
      withDefaults({ ...w, paragraphs: toParagraphs(paragraphs), image: imageOrUndefined(image) }, EMPTY_WORKSHOP),
    );
  return { ...withDefaults(remote?.page, EMPTY_PAGE), workshops };
}

import { ateliers as localAteliers, type Workshop } from "@/content/ateliers";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import { IMAGE, imageOrUndefined, SEO, stripNulls, type SanityImage, type Seo } from "./fragments";

const WORKSHOP_FIELDS = `{
  anchor, kicker, title, subtitle, hook, "facts": facts[]{ label, value },
  paragraphs, "image": image${IMAGE}, "placeholder": tileColor
}`;

// Ordre choisi sur la page Ateliers (glisser-déposer) ; sinon le champ « Ordre d’affichage ».
const ATELIERS_QUERY = `{
  "page": *[_id == "ateliersPage"][0]{
    ${SEO}, title, intro, audience, cta{ title, text, button{ label, href } }
  },
  "workshops": coalesce(
    *[_id == "ateliersPage"][0].workshops[]->${WORKSHOP_FIELDS},
    *[_type == "workshop"] | order(order asc)${WORKSHOP_FIELDS}
  )
}`;

type RemoteWorkshop = Omit<Workshop, "paragraphs" | "image"> & {
  paragraphs?: PortableBlock[] | null;
  image?: Partial<SanityImage> | null;
};

type AteliersContent = Omit<typeof localAteliers, "workshops"> & { workshops: Workshop[]; seo?: Seo };

/**
 * Page Ateliers. Les ateliers saisis dans Sanity remplacent ceux de la V1 (même ancre) ;
 * ceux qui n’y sont pas encore restent affichés à la suite, le temps de la migration.
 */
export async function getAteliersPage(): Promise<AteliersContent> {
  const remote = await fetchSanity<{ page: Partial<AteliersContent> | null; workshops: RemoteWorkshop[] | null }>(
    ATELIERS_QUERY,
  );
  const fromSanity = (remote?.workshops ?? [])
    .filter((w) => w?.anchor && w.title)
    .map(({ paragraphs, image, ...w }) => {
      const local = localAteliers.workshops.find((l) => l.anchor === w.anchor);
      return withFallback(
        stripNulls({ ...w, paragraphs: toParagraphs(paragraphs), image: imageOrUndefined(image) }),
        (local ?? { placeholder: "garance" }) as Workshop,
      );
    });
  const anchors = new Set(fromSanity.map((w) => w.anchor));
  const workshops = [...fromSanity, ...localAteliers.workshops.filter((w) => !anchors.has(w.anchor))];

  const page = withFallback(remote?.page, localAteliers as AteliersContent);
  return { ...page, workshops };
}

import { calendrierPage as localPage } from "@/content/calendrier";
import type { Paragraph } from "@/components/ui/RichText";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import { IMAGE, imageOrUndefined, SEO, type SanityImage, type Seo } from "./fragments";

const CALENDRIER_QUERY = `*[_id == "calendrierPage"][0]{
  ${SEO}, title, intro, upcomingTitle, empty, agendaTitle,
  participationTitle, "participationImage": participationImage${IMAGE}, participationText,
  structuresTitle, structuresText, structuresCta{ label, href }
}`;

type Remote = {
  seo: Seo;
  title?: string;
  intro?: string;
  upcomingTitle?: string;
  empty?: string;
  agendaTitle?: string;
  participationTitle?: string;
  participationImage?: Partial<SanityImage> | null;
  participationText?: PortableBlock[] | null;
  structuresTitle?: string;
  structuresText?: PortableBlock[] | null;
  structuresCta?: { label?: string; href?: string } | null;
};

type CalendrierContent = Omit<typeof localPage, "seo" | "participation"> & {
  seo: Seo;
  participation: Omit<(typeof localPage)["participation"], "image" | "paragraphs" | "structures"> & {
    image: SanityImage;
    paragraphs: Paragraph[];
    structures: { title: string; text: Paragraph; button: { label: string; href: string } };
  };
};

/** Page Calendrier (valeurs de la V1 pour les champs vides). Les événements sont lus à part. */
export async function getCalendrierPage(): Promise<CalendrierContent> {
  const r = await fetchSanity<Remote>(CALENDRIER_QUERY);
  const structuresText = toParagraphs(r?.structuresText);
  // Même forme que le contenu local, pour réutiliser la fusion champ par champ.
  const remote = r && {
    seo: r.seo,
    title: r.title,
    intro: r.intro,
    upcoming: { title: r.upcomingTitle, empty: r.empty },
    agenda: { title: r.agendaTitle },
    participation: {
      image: imageOrUndefined(r.participationImage),
      title: r.participationTitle,
      paragraphs: toParagraphs(r.participationText),
      structures: {
        title: r.structuresTitle,
        // Le texte pour les structures tient en un seul paragraphe.
        text: structuresText.length ? structuresText.flatMap((p) => (typeof p === "string" ? [p] : p)) : undefined,
        button: r.structuresCta,
      },
    },
  };
  return withFallback(remote, localPage as unknown as CalendrierContent);
}

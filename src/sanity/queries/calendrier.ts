import { routes } from "@/lib/routes";
import { EMPTY_LINK, withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import type { ContentImage, Inline, Link, Paragraph } from "../types";
import { IMAGE, imageOrUndefined, SEO, type SanityImage, type Seo } from "./fragments";

const CALENDRIER_QUERY = `*[_id == "calendrierPage"][0]{
  ${SEO}, title, intro, upcomingTitle, empty, agendaTitle,
  participationTitle, "participationImage": participationImage${IMAGE}, participationText,
  structuresTitle, structuresText, structuresCta{ label, href }
}`;

type Remote = {
  seo?: Seo;
  title?: string | null;
  intro?: string | null;
  upcomingTitle?: string | null;
  empty?: string | null;
  agendaTitle?: string | null;
  participationTitle?: string | null;
  participationImage?: Partial<SanityImage> | null;
  participationText?: PortableBlock[] | null;
  structuresTitle?: string | null;
  structuresText?: PortableBlock[] | null;
  structuresCta?: Partial<Link> | null;
};

export type CalendrierContent = {
  seo: Seo;
  title: string;
  intro: string;
  upcoming: { title: string; empty: string; more: string };
  agenda: { title: string };
  /** Bouton secondaire de la modale événement. */
  dialogContact: Link;
  participation: {
    image?: ContentImage;
    title: string;
    paragraphs: Paragraph[];
    structures: { title: string; text: Paragraph; button: Link };
  };
};

/** Page Calendrier. Les événements sont lus à part (`getAllEvents`). */
export async function getCalendrierPage(): Promise<CalendrierContent> {
  const r = await fetchSanity<Remote>(CALENDRIER_QUERY);
  // Le texte pour les structures tient en un seul paragraphe.
  const structuresText: Inline[] = toParagraphs(r?.structuresText).flatMap((p, i) => [
    ...(i > 0 ? [" "] : []),
    ...(typeof p === "string" ? [p] : p),
  ]);
  return {
    seo: r?.seo ?? null,
    title: r?.title ?? "",
    intro: r?.intro ?? "",
    // Libellés d’interface, non éditables.
    upcoming: { title: r?.upcomingTitle ?? "", empty: r?.empty ?? "", more: "En savoir plus" },
    agenda: { title: r?.agendaTitle ?? "" },
    dialogContact: { label: "Prenez contact", href: routes.contact },
    participation: {
      image: imageOrUndefined(r?.participationImage),
      title: r?.participationTitle ?? "",
      paragraphs: toParagraphs(r?.participationText),
      structures: {
        title: r?.structuresTitle ?? "",
        text: structuresText,
        button: withDefaults(r?.structuresCta, EMPTY_LINK),
      },
    },
  };
}

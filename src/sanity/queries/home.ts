import { routes } from "@/lib/routes";
import { EMPTY_LINK, withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import type { ContentImage, Link, Tone } from "../types";
import { IMAGE, imageOrUndefined, SEO, type SanityImage, type Seo } from "./fragments";

const LINK = `{ label, href }`;

const HOME_QUERY = `*[_id == "homePage"][0]{
  ${SEO},
  hero{ title, tagline, cta${LINK}, "images": images[]${IMAGE} },
  partners{ title, cta${LINK} },
  univers{ kicker, title, paragraphs, cta${LINK} },
  events{ title, empty, cta${LINK} },
  workshops{
    title, intro, more, cta${LINK},
    "tiles": tiles[]->{
      "label": title,
      "href": $ateliers + "#" + anchor,
      "tone": tileColor,
      "image": image${IMAGE}
    }
  },
  reviews{ title, count, cta${LINK} },
  contact{ title, text, cta${LINK} }
}`;

export type HomeTile = { label: string; href: string; tone: Tone; image?: ContentImage };

export type HomeContent = {
  seo: Seo;
  hero: { title: string; tagline: string; cta: Link; images: ContentImage[] };
  partners: { title: string; cta: Link };
  univers: { kicker: string; title: string; paragraphs: string[]; cta: Link };
  events: { title: string; empty: string; cta: Link };
  workshops: { title: string; intro: string; tiles: HomeTile[]; more: string; cta: Link };
  reviews: { title: string; count: number; cta: Link };
  contact: { title: string; text: string; cta: Link };
};

const EMPTY: HomeContent = {
  seo: null,
  hero: { title: "", tagline: "", cta: EMPTY_LINK, images: [] },
  partners: { title: "", cta: EMPTY_LINK },
  univers: { kicker: "", title: "", paragraphs: [], cta: EMPTY_LINK },
  events: { title: "", empty: "", cta: EMPTY_LINK },
  workshops: { title: "", intro: "", tiles: [], more: "", cta: EMPTY_LINK },
  reviews: { title: "", count: 4, cta: EMPTY_LINK },
  contact: { title: "", text: "", cta: EMPTY_LINK },
};

type Remote = {
  hero?: ({ images?: (Partial<SanityImage> | null)[] | null } & Record<string, unknown>) | null;
  workshops?:
    | ({
        tiles?: ({ label?: string; href?: string; tone?: Tone; image?: Partial<SanityImage> | null } | null)[] | null;
      } & Record<string, unknown>)
    | null;
} & Record<string, unknown>;

/** Contenus de l’accueil. */
export async function getHomePage(): Promise<HomeContent> {
  const remote = await fetchSanity<Remote>(HOME_QUERY, { ateliers: routes.ateliers });
  // Photos sans fichier et tuiles vers un atelier supprimé (ou sans ancre) : ignorées.
  const cleaned = remote && {
    ...remote,
    hero: remote.hero && {
      ...remote.hero,
      images: (remote.hero.images ?? []).map(imageOrUndefined).filter(Boolean),
    },
    workshops: remote.workshops && {
      ...remote.workshops,
      tiles: (remote.workshops.tiles ?? [])
        .filter((t) => t?.label && t.href)
        .map((t) => ({ label: t!.label, href: t!.href, tone: t!.tone ?? "garance", image: imageOrUndefined(t!.image) })),
    },
  };
  return withDefaults(cleaned, EMPTY);
}

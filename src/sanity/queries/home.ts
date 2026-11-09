import { home as localHome } from "@/content/home";
import { routes } from "@/lib/routes";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { IMAGE, SEO, type Seo } from "./fragments";

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

export type HomeContent = typeof localHome & { seo?: Seo };

/** Contenus de l’accueil (valeurs de la V1 pour les champs vides). */
export async function getHomePage(): Promise<HomeContent> {
  type Remote = {
    hero?: { images?: ({ src?: string } | null)[] | null } & Record<string, unknown>;
    workshops?: { tiles?: ({ label?: string; href?: string } | null)[] | null } & Record<string, unknown>;
  } & Record<string, unknown>;
  const remote = await fetchSanity<Remote>(HOME_QUERY, { ateliers: routes.ateliers });
  // Photos sans fichier et tuiles vers un atelier supprimé (ou sans ancre) : ignorées.
  const cleaned = remote && {
    ...remote,
    hero: remote.hero && { ...remote.hero, images: remote.hero.images?.filter((img) => img?.src) },
    workshops: remote.workshops && {
      ...remote.workshops,
      tiles: remote.workshops.tiles?.filter((t) => t?.label && t.href),
    },
  };
  return withFallback(cleaned, localHome as HomeContent);
}

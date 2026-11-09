import { home as localHome } from "@/content/home";
import { routes } from "@/lib/routes";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { IMAGE, SEO, type Seo } from "./fragments";

const LINK = `{ label, href }`;

const HOME_QUERY = `*[_id == "homePage"][0]{
  ${SEO},
  hero{ title, tagline, cta${LINK}, "images": images[]${IMAGE}[defined(src)] },
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
    }[defined(label) && defined(href)]
  },
  reviews{ title, count, cta${LINK} },
  contact{ title, text, cta${LINK} }
}`;

export type HomeContent = typeof localHome & { seo?: Seo };

/** Contenus de l’accueil (valeurs de la V1 pour les champs vides). */
export async function getHomePage(): Promise<HomeContent> {
  const remote = await fetchSanity<Partial<HomeContent>>(HOME_QUERY, { ateliers: routes.ateliers });
  return withFallback(remote, localHome as HomeContent);
}

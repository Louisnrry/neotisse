import { withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import type { CookieBannerContent } from "../types";

const COOKIE_BANNER_QUERY = `*[_id == "cookieBanner"][0]{
  title, message, accept, deny, customize, save, alwaysActive,
  "categories": { "functional": functional{ title, description }, "statistics": statistics{ title, description } }
}`;

// Libellés minimaux pour que le bandeau reste utilisable si le document est incomplet.
const EMPTY: CookieBannerContent = {
  title: "",
  message: "",
  accept: "Accepter",
  deny: "Refuser",
  customize: "Personnaliser",
  save: "Enregistrer mes choix",
  alwaysActive: "Toujours activé",
  categories: {
    functional: { title: "Fonctionnel", description: "" },
    statistics: { title: "Statistiques", description: "" },
  },
};

/** Textes du bandeau cookies. */
export async function getCookieBanner(): Promise<CookieBannerContent> {
  return withDefaults(await fetchSanity(COOKIE_BANNER_QUERY), EMPTY);
}

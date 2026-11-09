/**
 * Lecture du contenu Sanity côté serveur.
 *
 * - `fetchSanity` interroge le contenu publié et le met en cache (Cache Components).
 *   Le cache est étiqueté automatiquement par `sanityFetch`.
 * - `<SanityLive />` (monté dans le layout du site) écoute l’API Live de Sanity :
 *   dès qu’un document est publié dans le Studio, les étiquettes concernées sont
 *   invalidées et la page se met à jour, sans redéploiement ni webhook.
 *
 * Pas de brouillons ni d’aperçu pour l’instant : uniquement le contenu publié.
 */
import { cacheLife } from "next/cache";
import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  strict: true,
});

/** Exécute une requête GROQ sur le contenu publié, avec mise en cache. */
export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  "use cache";
  try {
    const { data } = await sanityFetch({ query, params, perspective: "published", stega: false });
    return (data ?? null) as T | null;
  } catch (error) {
    // Sanity injoignable : le site reste affichable avec les contenus de secours,
    // et on réessaie quelques minutes plus tard plutôt que de garder l’échec en cache.
    cacheLife("minutes");
    console.error("[sanity] requête en échec", error);
    return null;
  }
}

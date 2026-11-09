import type { Metadata } from "next";
import type { Seo } from "../queries/fragments";

type Defaults = {
  /** Titre complet de la V1 (sans le gabarit « | Néotisse »). */
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
};

/**
 * Métadonnées d’une page : le bloc SEO saisi dans Sanity l’emporte,
 * sinon les valeurs reprises de la V1.
 */
export function pageMetadata(seo: Seo | undefined, defaults: Defaults): Metadata {
  const noindex = seo?.noindex ?? defaults.noindex ?? false;
  return {
    title: { absolute: seo?.title || defaults.title },
    description: seo?.description || defaults.description,
    alternates: { canonical: defaults.canonical },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

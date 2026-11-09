/** Morceaux de requêtes GROQ partagés. */

/** Image avec texte alternatif → `{ src, alt, width, height }`. */
export const IMAGE = `{
  "src": asset->url,
  alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

/** Bloc SEO d’une page. */
export const SEO = `seo{ title, description, noindex }`;

export type SanityImage = { src: string; alt: string; width?: number; height?: number };

export type Seo = { title?: string | null; description?: string | null; noindex?: boolean | null } | null;

/** Garde une image seulement si son fichier est bien chargé. */
export function imageOrUndefined(img: Partial<SanityImage> | null | undefined): SanityImage | undefined {
  return img?.src ? { src: img.src, alt: img.alt ?? "", width: img.width, height: img.height } : undefined;
}

/** Remplace les `null` renvoyés par GROQ par `undefined` (champs facultatifs). */
export function stripNulls<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null)) as T;
}

/**
 * Identifiant du document privé d’un avis (e-mail et IP) : `private.<identifiant de l’avis>`.
 * Sanity ne rend jamais publics les documents dont l’identifiant contient un point.
 */
export const reviewPrivateId = (reviewId: string) => `private.${reviewId.replace(/^drafts\./, "")}`;

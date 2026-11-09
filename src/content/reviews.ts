/**
 * Avis du livre d’or, en attendant Sanity (type `review`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ filtrée sur `status == "approved"`,
 * sans jamais exposer l’e-mail ni l’IP.
 * Données reprises du WordPress V1 : ce sont en partie des avis de test, à trier à la migration.
 */
export type Review = {
  id: string;
  name: string;
  title?: string;
  rating: number;
  text: string;
  /** ISO « AAAA-MM-JJ » */
  createdAt: string;
};

export const reviews: Review[] = [
  { id: "183", name: "nefertiti", title: "pyramide", rating: 5, text: "GENIAL TOP", createdAt: "2026-11-04" },
  {
    id: "176",
    name: "racha",
    title: "MERCI",
    rating: 5,
    text: "merci pour cette intervention qui m'a donné envie de m'investir dans le tissage",
    createdAt: "2026-11-04",
  },
  {
    id: "133",
    name: "jean dupont",
    title: "atelier reconstitution",
    rating: 4,
    text: "Grace à Neotisse j'en ai beaucoup appris sur le tissage de l'antiquité",
    createdAt: "2026-11-04",
  },
  {
    id: "134",
    name: "john doe",
    title: "atelier pour enfants",
    rating: 5,
    text: "Mes enfants ont adoré cette atelier merci à Neotisse",
    createdAt: "2026-11-04",
  },
  {
    id: "135",
    name: "andré zola",
    title: "festival",
    rating: 5,
    text: "notre festival a été ravi d'accueillir l'atelier de néotisse au sein de notre festival. Merci à eux pour le professionalisme et leur adaptation !!!",
    createdAt: "2026-11-04",
  },
  { id: "129", name: "louis", title: "INCROYABLE", rating: 5, text: "j'ai adoré", createdAt: "2026-11-03" },
];

/** Les `count` avis les plus récents (l’ordre du tableau est déjà antéchronologique). */
export function getLatestReviews(count: number) {
  return reviews.slice(0, count);
}

/** Note moyenne et nombre d’avis. */
export function getReviewStats() {
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average };
}

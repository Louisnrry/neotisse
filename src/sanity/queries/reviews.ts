import { todayInParis } from "@/lib/dates";
import { fetchSanity } from "../lib/live";
import type { Review } from "../types";
import { stripNulls } from "./fragments";

// Uniquement les champs publics : jamais l’e-mail ni l’IP.
const REVIEWS_QUERY = `*[_type == "review" && status == "approved"] | order(createdAt desc){
  "id": _id, name, title, rating, text, createdAt
}`;

/** Avis approuvés, du plus récent au plus ancien. */
export async function getReviews(): Promise<Review[]> {
  const remote = await fetchSanity<Review[]>(REVIEWS_QUERY);
  return (remote ?? [])
    .filter((r) => r?.name && r.text && r.createdAt)
    .map((r) =>
      // Date de l’avis à Paris, au format « AAAA-MM-JJ ».
      stripNulls({ ...r, rating: r.rating ?? 5, createdAt: todayInParis(new Date(r.createdAt)) }),
    );
}

/** Note moyenne et nombre d’avis. */
export function reviewStats(list: Review[]) {
  const count = list.length;
  const average = count ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average };
}

/**
 * Listes ordonnées (partenaires, ateliers, questions, équipe).
 *
 * Tous les documents publiés du type sont affichés :
 * d’abord ceux placés dans la liste de la page (dans l’ordre choisi par glisser-déposer),
 * puis les autres, triés par leur champ « Ordre d’affichage ».
 * Ainsi, un document créé dans le Studio apparaît toujours sur le site, même s’il n’a pas
 * été ajouté à la liste de la page.
 */

/**
 * Requête GROQ : `{ refs, docs }`.
 * @param fields projection GROQ des champs, de la forme `{ … }` (l’identifiant y est ajouté).
 */
export function orderedListQuery(type: string, pageId: string, listPath: string, fields: string) {
  const withId = fields.replace("{", "{ _id,");
  return `{
    "refs": *[_id == "${pageId}"][0].${listPath}[]._ref,
    "docs": *[_type == "${type}"] | order(coalesce(order, 1000) asc, _createdAt asc)${withId}
  }`;
}

/** Trie les documents : ceux de la liste de la page d’abord, dans son ordre, puis les autres. */
export function orderByPageList<T extends { _id: string }>(
  result: { refs?: (string | null)[] | null; docs?: (T | null)[] | null } | null,
): T[] {
  const docs = (result?.docs ?? []).filter((d): d is T => Boolean(d));
  const rank = new Map((result?.refs ?? []).filter(Boolean).map((id, i) => [id as string, i]));
  // Tri stable : les documents hors liste gardent l’ordre du champ « Ordre d’affichage ».
  return [...docs].sort((a, b) => (rank.get(a._id) ?? Infinity) - (rank.get(b._id) ?? Infinity));
}

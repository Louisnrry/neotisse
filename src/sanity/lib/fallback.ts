/**
 * Contenus de secours pendant la migration vers Sanity.
 *
 * Tant qu’un document ou un champ n’est pas rempli dans le Studio, le site affiche
 * la valeur reprise de la V1 (`src/content/*.ts`). Dès qu’il est saisi et publié,
 * la valeur Sanity l’emporte. Une fois la migration terminée, ces valeurs de secours
 * pourront être supprimées.
 */

type Plain = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isEmpty = (v: unknown) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);

/**
 * Fusionne une valeur venue de Sanity avec sa valeur de secours, champ par champ :
 * - objet : fusion récursive ;
 * - tableau : celui de Sanity s’il n’est pas vide, sinon celui de secours ;
 * - texte, nombre, booléen : celui de Sanity s’il est renseigné.
 */
export function withFallback<T>(remote: unknown, local: T): T {
  if (isEmpty(remote)) return local;
  if (isPlainObject(local) && isPlainObject(remote)) {
    const out: Plain = { ...local };
    for (const key of Object.keys(remote)) {
      out[key] = key in local ? withFallback(remote[key], local[key as keyof typeof local]) : remote[key];
    }
    return out as T;
  }
  return remote as T;
}

/** Liste Sanity si elle contient au moins un élément, sinon la liste de secours. */
export function listOr<T>(remote: T[] | null | undefined, local: readonly T[]): T[] {
  return remote && remote.length > 0 ? remote : [...local];
}

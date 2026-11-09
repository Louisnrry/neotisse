/**
 * Valeurs par défaut des contenus Sanity.
 *
 * Le site affiche exactement ce qui est publié dans le Studio. Ces valeurs par défaut
 * sont **vides** (textes vides, listes vides) : elles servent seulement à garantir la forme
 * des données, pour qu’un champ non rempli n’empêche pas la page de s’afficher.
 */

type Plain = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Complète une valeur venue de Sanity avec sa forme par défaut, champ par champ :
 * un champ absent (`null` / `undefined`) prend la valeur par défaut, les objets sont complétés récursivement.
 */
export function withDefaults<T>(remote: unknown, defaults: T): T {
  if (remote === null || remote === undefined) return defaults;
  if (isPlainObject(defaults) && isPlainObject(remote)) {
    const out: Plain = { ...defaults };
    for (const key of Object.keys(remote)) {
      out[key] = key in defaults ? withDefaults(remote[key], defaults[key as keyof typeof defaults]) : remote[key];
    }
    return out as T;
  }
  return remote as T;
}

/** Lien vide (bouton sans libellé : non affiché par `<Button>`). */
export const EMPTY_LINK = { label: "", href: "" };

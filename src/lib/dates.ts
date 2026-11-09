/**
 * Dates en français, règles de la V1 (helpers.php : neo_format_event_dates).
 * Toutes les dates sont des chaînes ISO « AAAA-MM-JJ », sans heure.
 */

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

type Parts = { y: number; m: number; d: number };

function parse(iso: string): Parts {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

const jour = (d: number) => (d === 1 ? "1er" : String(d));
const mois = (m: number) => MOIS[m - 1];

/** « 26 octobre 2027 », « 1er mai 2027 ». */
export function formatDate(iso: string) {
  const { y, m, d } = parse(iso);
  return `${jour(d)} ${mois(m)} ${y}`;
}

/** « octobre 2027 ». */
export function formatMonthYear(iso: string) {
  const { y, m } = parse(iso);
  return `${mois(m)} ${y}`;
}

/** Numéro du jour, sans « er » (grandes dates du calendrier). */
export function dayNumber(iso: string) {
  return parse(iso).d;
}

/**
 * Plage de dates d’un événement :
 * - un jour : « 26 octobre 2027 »
 * - deux jours consécutifs du même mois : « 9 et 10 octobre 2027 »
 * - même mois : « 3 au 7 octobre 2027 »
 * - deux mois : « 30 septembre au 2 octobre 2027 »
 * - deux années : « 30 décembre 2027 au 2 janvier 2028 »
 */
export function formatEventDates(start: string, end?: string | null) {
  if (!end || end === start) return formatDate(start);
  const a = parse(start);
  const b = parse(end);
  if (a.y === b.y && a.m === b.m) {
    const sep = b.d - a.d === 1 ? " et " : " au ";
    return `${jour(a.d)}${sep}${formatDate(end)}`;
  }
  if (a.y === b.y) return `${jour(a.d)} ${mois(a.m)} au ${formatDate(end)}`;
  return `${formatDate(start)} au ${formatDate(end)}`;
}

/** Date du jour à Paris, au format ISO « AAAA-MM-JJ ». */
export function todayInParis(now: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

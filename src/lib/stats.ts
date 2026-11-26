/** Tableau de bord du Studio : formes échangées entre la route `/api/statistiques/` et l’outil « Statistiques ». */

export const STATS_PERIODS = [30, 90, 180] as const;
export type StatsPeriod = (typeof STATS_PERIODS)[number];

/**
 * Un jour ou une semaine : visiteurs (personnes distinctes), visites et pages consultées.
 * `start` et `end` (AAAA-MM-JJ) bornent la partie comprise dans la période ; `partial` : jour ou semaine pas fini,
 * ou semaine coupée par le début de la période.
 */
export type Bucket = { start: string; end: string; users: number; sessions: number; views: number; partial: boolean };

/** Valeur de la période et de la période précédente de même durée. */
export type Pair = { current: number; previous: number };

export type Stats = {
  days: StatsPeriod;
  /** Heure de lecture, ISO. */
  generatedAt: string;
  /** Regroupement du graphique : par jour sur 30 jours, par semaine au-delà. */
  bucket: "day" | "week";
  /** Chiffres par jour ou par semaine, dans l’ordre, périodes vides comprises. */
  buckets: Bucket[];
  /** Mêmes chiffres pour la période précédente, dans le même ordre. */
  previousBuckets: Bucket[];
  /** Totaux de la période et de la précédente. Visiteurs : personnes distinctes (pas la somme des jours). */
  totals: { users: Pair; newUsers: Pair; sessions: Pair; views: Pair };
  sessions: Pair;
  /** Visites engagées venues des réseaux sociaux (canal Organic Social). */
  socialEngaged: Pair;
  /** Nombre d’envois par événement du plan de taggage. */
  events: Record<string, Pair>;
  /** Provenance des visites, regroupée (Google, Instagram, Facebook…). */
  origins: { label: string; kind: OriginKind; detail: string; sessions: Pair; engaged: number }[];
  /** Vues de la page Calendrier et d’où elles viennent (page du site, Google, réseaux…). */
  calendar: { views: Pair; sources: { label: string; kind: OriginKind; views: number }[] };
  pages: { path: string; views: number }[];
  devices: { name: string; sessions: number }[];
  /** `null` : dimensions personnalisées absentes de GA4, détail par fiche indisponible. */
  fiches: { name: string; hasLink: boolean; opened: number; clicked: number }[] | null;
  /** Trente dernières minutes. `null` : lecture en direct indisponible. */
  realtime: { users: number; events: { name: string; count: number }[] } | null;
};

/** Famille d’une provenance : sert aux totaux « Google » et « Réseaux sociaux » et aux couleurs. */
export type OriginKind = "google" | "reseaux" | "site" | "direct" | "autre";

export type StatsErrorCode = "not-configured" | "unauthorized" | "forbidden" | "bad-request" | "unavailable";

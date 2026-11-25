/** Tableau de bord du Studio : formes échangées entre la route `/api/statistiques/` et l’outil « Statistiques ». */

export const STATS_PERIODS = [7, 30, 90] as const;
export type StatsPeriod = (typeof STATS_PERIODS)[number];

/** Valeur de la période et de la période précédente de même durée. */
export type Pair = { current: number; previous: number };

export type Stats = {
  days: StatsPeriod;
  /** Heure de lecture, ISO. */
  generatedAt: string;
  /** Visites par jour, dans l’ordre, jours sans visite compris (AAAA-MM-JJ). */
  daily: { date: string; sessions: number }[];
  sessions: Pair;
  /** Visites engagées venues des réseaux sociaux (canal Organic Social). */
  socialEngaged: Pair;
  /** Nombre d’envois par événement du plan de taggage. */
  events: Record<string, Pair>;
  channels: { name: string; sessions: number; engaged: number }[];
  pages: { path: string; views: number }[];
  devices: { name: string; sessions: number }[];
  /** `null` : dimensions personnalisées absentes de GA4, détail par fiche indisponible. */
  fiches: { name: string; hasLink: boolean; opened: number; clicked: number }[] | null;
  /** Trente dernières minutes. `null` : lecture en direct indisponible. */
  realtime: { users: number; events: { name: string; count: number }[] } | null;
};

export type StatsErrorCode = "not-configured" | "unauthorized" | "forbidden" | "bad-request" | "unavailable";

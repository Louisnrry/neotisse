/**
 * Lecture de Google Analytics 4 (API Data) : **serveur uniquement**.
 * Le compte de service n’a qu’un droit de lecture sur la propriété GA4 ; sa clé n’est jamais envoyée au navigateur.
 */
import { createSign } from "node:crypto";
import { routes } from "@/lib/routes";
import type { DayStats, OriginKind, Pair, Stats, StatsPeriod } from "@/lib/stats";

if (typeof window !== "undefined") throw new Error("La lecture de GA4 se fait sur le serveur uniquement.");

type Config = { propertyId: string; clientEmail: string; privateKey: string };

export function getGa4Config(): Config | null {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  // Une variable d’environnement garde souvent les retours à la ligne sous la forme « \n ».
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return propertyId && clientEmail && privateKey ? { propertyId, clientEmail, privateKey } : null;
}

let cachedToken: { value: Promise<string>; expires: number } | null = null;

const b64 = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");

/** Jeton gardé 50 minutes (il en vaut 60), partagé par les lectures simultanées. */
function accessToken(config: Config) {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.value;
  const value = requestToken(config);
  cachedToken = { value, expires: Date.now() + 50 * 60_000 };
  // Un échec n’est pas gardé : la lecture suivante réessaie.
  value.catch(() => {
    cachedToken = null;
  });
  return value;
}

async function requestToken({ clientEmail, privateKey }: Config) {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(privateKey, "base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Jeton Google refusé (${response.status})`);
  return ((await response.json()) as { access_token: string }).access_token;
}

type Row = { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] };
type Report = { rows?: Row[]; metadata?: { timeZone?: string } };

async function call<T>(config: Config, method: string, body: object): Promise<T> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(config.propertyId)}:${method}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${await accessToken(config)}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) {
    throw new Error(`GA4 ${method} : ${response.status} ${(await response.text()).slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

const dim = (row: Row, i: number) => row.dimensionValues?.[i]?.value ?? "";
const num = (row: Row, i: number) => Number(row.metricValues?.[i]?.value ?? 0);
const names = (...list: string[]) => list.map((name) => ({ name }));

const EVENTS = ["view_event", "click_lieu", "submit_avis", "generate_lead", "click_social", "click_contact"];
const eventFilter = (values: string[]) => ({
  filter: { fieldName: "eventName", inListFilter: { values } },
});

/** Regroupe une source GA4 en provenance lisible. */
export function classifySource(source: string, channel: string): { label: string; kind: OriginKind } {
  const s = source.toLowerCase();
  if (s === "(direct)" || channel === "Direct") return { label: "Accès direct (adresse tapée, favori, message…)", kind: "direct" };
  if (/(^|\.)google\./.test(s) || s === "google") return { label: "Google", kind: "google" };
  if (s.includes("instagram")) return { label: "Instagram", kind: "reseaux" };
  if (/facebook|^fb$|^m\.facebook|^l\.facebook/.test(s)) return { label: "Facebook", kind: "reseaux" };
  if (/chatgpt|openai|perplexity|gemini|claude\.ai|copilot/.test(s)) return { label: "ChatGPT et autres assistants IA", kind: "autre" };
  if (channel.includes("Social")) return { label: "Autres réseaux", kind: "reseaux" };
  if (channel.includes("Search")) return { label: "Autres moteurs de recherche (Bing, Qwant…)", kind: "autre" };
  if (channel === "Email") return { label: "E-mail", kind: "autre" };
  if (channel === "Referral") return { label: "Autres sites (partenaires, articles…)", kind: "autre" };
  return { label: "Autre provenance", kind: "autre" };
}

/** Pages du site, pour dire depuis laquelle on est arrivé au calendrier. */
const PAGE_NAMES: Record<string, string> = {
  [routes.accueil]: "l’accueil",
  [routes.ateliers]: "la page Ateliers",
  [routes.partenaires]: "la page Partenaires",
  [routes.livreDor]: "le livre d’or",
  [routes.aPropos]: "la page À propos",
  [routes.contact]: "la page Contact",
};

/** Hôtes du site : un précédent sur l’un d’eux est un clic depuis une autre page du site. */
function isSiteHost(host: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : "";
  return host === site || host === "neotisse.fr" || host === "www.neotisse.fr" || host.endsWith(".netlify.app");
}

/** Provenance d’une vue du calendrier : la page du site d’où vient le clic, sinon la source de la visite. */
function classifyCalendarView(referrer: string, source: string, channel: string) {
  let url: URL | null = null;
  try {
    url = referrer ? new URL(referrer) : null;
  } catch {
    url = null;
  }
  if (url && isSiteHost(url.hostname)) {
    const path = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    if (path === routes.calendrier) return null; // même page (changement d’adresse sans changer de page)
    return { label: `En cliquant depuis ${PAGE_NAMES[path] ?? "une autre page du site"}`, kind: "site" as const };
  }
  return classifySource(source, channel);
}

/** Jour « AAAA-MM-JJ » dans le fuseau de la propriété GA4. */
const dayIn = (timeZone: string, date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);

export async function readStats(config: Config, days: StatsPeriod): Promise<Stats> {
  // Période : les `days` derniers jours, aujourd’hui compris. Précédente : les `days` jours d’avant.
  const current = { startDate: `${days - 1}daysAgo`, endDate: "today", name: "current" };
  const previous = { startDate: `${days * 2 - 1}daysAgo`, endDate: `${days}daysAgo`, name: "previous" };

  const [batch, totalsReport, calendarReport, fiches, realtime] = await Promise.all([
    call<{ reports: Report[] }>(config, "batchRunReports", {
      requests: [
        {
          dateRanges: [current, previous],
          dimensions: names("date"),
          metrics: names("activeUsers", "sessions", "screenPageViews"),
          limit: 400,
        },
        {
          dateRanges: [current, previous],
          dimensions: names("eventName"),
          metrics: names("eventCount"),
          dimensionFilter: eventFilter(EVENTS),
        },
        {
          dateRanges: [current, previous],
          dimensions: names("sessionSource", "sessionDefaultChannelGroup"),
          metrics: names("sessions", "engagedSessions"),
          limit: 200,
        },
        {
          dateRanges: [current],
          dimensions: names("pagePath"),
          metrics: names("screenPageViews"),
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 8,
        },
        { dateRanges: [current], dimensions: names("deviceCategory"), metrics: names("sessions") },
      ],
    }),
    // Totaux : les visiteurs d’une période ne sont pas la somme des visiteurs de chaque jour.
    call<Report>(config, "runReport", {
      dateRanges: [current, previous],
      metrics: names("activeUsers", "newUsers", "sessions", "screenPageViews"),
    }),
    // Vues du calendrier, avec la page précédente (clic interne) et la source de la visite.
    call<Report>(config, "runReport", {
      dateRanges: [current, previous],
      dimensions: names("pageReferrer", "sessionSource", "sessionDefaultChannelGroup"),
      metrics: names("screenPageViews"),
      dimensionFilter: { filter: { fieldName: "pagePath", stringFilter: { value: routes.calendrier } } },
      limit: 500,
    }),
    // Par fiche, en nombre de visites : rouvrir la même fiche ne compte qu’une fois.
    call<Report>(config, "runReport", {
      dateRanges: [current],
      dimensions: names("customEvent:fiche", "customEvent:lien", "eventName"),
      metrics: names("sessions"),
      dimensionFilter: eventFilter(["view_event", "click_lieu"]),
    }).catch((error: unknown) => {
      console.error("[statistiques] détail par fiche indisponible", error);
      return null;
    }),
    Promise.all([
      call<Report>(config, "runRealtimeReport", { metrics: names("activeUsers") }),
      call<Report>(config, "runRealtimeReport", { dimensions: names("eventName"), metrics: names("eventCount") }),
    ]).catch((error: unknown) => {
      console.error("[statistiques] lecture en direct indisponible", error);
      return null;
    }),
  ]);

  const [dailyReport, eventReport, channelReport, pageReport, deviceReport] = batch.reports;

  // Jours sans visite : absents de la réponse GA4, donc remis à zéro.
  const timeZone = dailyReport.metadata?.timeZone ?? "Europe/Paris";
  const byDay = new Map(
    (dailyReport.rows ?? []).map((row) => [dim(row, 0), { users: num(row, 0), sessions: num(row, 1), views: num(row, 2) }]),
  );
  const today = new Date(`${dayIn(timeZone, new Date())}T12:00:00Z`);
  // Jour i de la période (décalage 0) ou de la précédente (décalage `days`).
  const dayAt = (i: number, shift: number): DayStats => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (days - 1 - i) - shift);
    const iso = date.toISOString().slice(0, 10);
    return { date: iso, ...(byDay.get(iso.replaceAll("-", "")) ?? { users: 0, sessions: 0, views: 0 }) };
  };
  const daily = Array.from({ length: days }, (_, i) => dayAt(i, 0));
  const previousDaily = Array.from({ length: days }, (_, i) => dayAt(i, days));

  const totals: Stats["totals"] = {
    users: { current: 0, previous: 0 },
    newUsers: { current: 0, previous: 0 },
    sessions: { current: 0, previous: 0 },
    views: { current: 0, previous: 0 },
  };
  for (const row of totalsReport.rows ?? []) {
    const period = dim(row, 0) === "previous" ? "previous" : "current";
    totals.users[period] = num(row, 0);
    totals.newUsers[period] = num(row, 1);
    totals.sessions[period] = num(row, 2);
    totals.views[period] = num(row, 3);
  }

  const events: Record<string, Pair> = Object.fromEntries(EVENTS.map((e) => [e, { current: 0, previous: 0 }]));
  // Avec deux périodes, GA4 ajoute le nom de la période en dernière dimension.
  for (const row of eventReport.rows ?? []) {
    const pair = events[dim(row, 0)];
    if (pair) pair[dim(row, 1) === "previous" ? "previous" : "current"] = num(row, 0);
  }

  const sessions: Pair = { current: 0, previous: 0 };
  const socialEngaged: Pair = { current: 0, previous: 0 };
  const origins = new Map<string, Stats["origins"][number]>();
  for (const row of channelReport.rows ?? []) {
    const source = dim(row, 0);
    const channel = dim(row, 1);
    const period = dim(row, 2) === "previous" ? "previous" : "current";
    sessions[period] += num(row, 0);
    if (channel === "Organic Social") socialEngaged[period] += num(row, 1);
    const { label, kind } = classifySource(source, channel);
    const origin = origins.get(label) ?? { label, kind, detail: "", sessions: { current: 0, previous: 0 }, engaged: 0 };
    origin.sessions[period] += num(row, 0);
    if (period === "current") {
      origin.engaged += num(row, 1);
      // Sources réelles derrière un groupe (ex. « bing, qwant ») : affichées en petit.
      if (!["Google", "Instagram", "Facebook"].includes(label) || kind === "direct") {
        origin.detail = [...new Set([...origin.detail.split(", ").filter(Boolean), source])].join(", ");
      }
    }
    origins.set(label, origin);
  }

  const calendar: Stats["calendar"] = { views: { current: 0, previous: 0 }, sources: [] };
  const calendarSources = new Map<string, Stats["calendar"]["sources"][number]>();
  for (const row of calendarReport.rows ?? []) {
    const period = dim(row, 3) === "previous" ? "previous" : "current";
    const views = num(row, 0);
    calendar.views[period] += views;
    if (period === "previous") continue;
    const origin = classifyCalendarView(dim(row, 0), dim(row, 1), dim(row, 2));
    if (!origin) continue;
    const entry = calendarSources.get(origin.label) ?? { ...origin, views: 0 };
    entry.views += views;
    calendarSources.set(origin.label, entry);
  }
  calendar.sources = [...calendarSources.values()].sort((a, b) => b.views - a.views);

  let ficheRows: Stats["fiches"] = null;
  if (fiches) {
    const byName = new Map<string, NonNullable<Stats["fiches"]>[number]>();
    for (const row of fiches.rows ?? []) {
      const name = dim(row, 0);
      if (!name || name === "(not set)") continue;
      const fiche = byName.get(name) ?? { name, hasLink: false, opened: 0, clicked: 0 };
      if (dim(row, 1) === "oui") fiche.hasLink = true;
      if (dim(row, 2) === "view_event") fiche.opened += num(row, 0);
      else fiche.clicked += num(row, 0);
      byName.set(name, fiche);
    }
    ficheRows = [...byName.values()].sort((a, b) => b.opened - a.opened);
  }

  return {
    days,
    generatedAt: new Date().toISOString(),
    daily,
    previousDaily,
    totals,
    sessions,
    socialEngaged,
    events,
    origins: [...origins.values()]
      .filter((o) => o.sessions.current > 0 || o.sessions.previous > 0)
      .sort((a, b) => b.sessions.current - a.sessions.current),
    calendar,
    pages: (pageReport.rows ?? []).map((row) => ({ path: dim(row, 0), views: num(row, 0) })),
    devices: (deviceReport.rows ?? [])
      .map((row) => ({ name: dim(row, 0), sessions: num(row, 0) }))
      .sort((a, b) => b.sessions - a.sessions),
    fiches: ficheRows,
    realtime: realtime && {
      users: realtime[0].rows?.[0] ? num(realtime[0].rows[0], 0) : 0,
      events: (realtime[1].rows ?? [])
        .map((row) => ({ name: dim(row, 0), count: num(row, 0) }))
        .filter((e) => e.name === "page_view" || EVENTS.includes(e.name)),
    },
  };
}

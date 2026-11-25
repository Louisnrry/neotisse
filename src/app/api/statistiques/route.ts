/**
 * Chiffres du tableau de bord du Studio (outil « Statistiques »).
 *
 * Accès : le Studio envoie le jeton Sanity de la personne connectée ; la route vérifie auprès de Sanity
 * qu’elle a un rôle dans le projet Néotisse. La clé GA4 reste sur le serveur, la réponse ne contient que des totaux.
 */
import { getGa4Config, readStats } from "@/lib/ga4";
import { STATS_PERIODS, type Stats, type StatsErrorCode, type StatsPeriod } from "@/lib/stats";
import { projectId } from "@/sanity/env";

const CACHE_MS = 60_000;
const cache = new Map<StatsPeriod, { at: number; stats: Stats }>();

const headers = { "Cache-Control": "private, no-store" };
const fail = (code: StatsErrorCode, status: number) => Response.json({ code }, { status, headers });

/** « ok » si le jeton appartient à un membre du projet. */
async function checkMember(authorization: string | null): Promise<"ok" | StatsErrorCode> {
  if (!authorization || !/^Bearer \S+$/.test(authorization)) return "unauthorized";
  try {
    const response = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/users/me`, {
      headers: { Authorization: authorization },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 401 || response.status === 403) return "unauthorized";
    if (!response.ok) return "unavailable";
    const user = (await response.json()) as { id?: string; roles?: unknown[] };
    if (!user.id) return "unauthorized";
    return user.roles?.length ? "ok" : "forbidden";
  } catch {
    return "unavailable";
  }
}

const statusOf: Record<StatsErrorCode, number> = {
  unauthorized: 401,
  forbidden: 403,
  "bad-request": 400,
  "not-configured": 503,
  unavailable: 502,
};

export async function GET(request: Request) {
  const access = await checkMember(request.headers.get("authorization"));
  if (access !== "ok") return fail(access, statusOf[access]);

  const days = Number(new URL(request.url).searchParams.get("jours")) as StatsPeriod;
  if (!STATS_PERIODS.includes(days)) return fail("bad-request", 400);

  const config = getGa4Config();
  if (!config) return fail("not-configured", 503);

  const hit = cache.get(days);
  if (hit && Date.now() - hit.at < CACHE_MS) return Response.json(hit.stats, { headers });
  try {
    const stats = await readStats(config, days);
    cache.set(days, { at: Date.now(), stats });
    return Response.json(stats, { headers });
  } catch (error) {
    console.error("[statistiques] lecture de GA4 en échec", error);
    return fail("unavailable", 502);
  }
}

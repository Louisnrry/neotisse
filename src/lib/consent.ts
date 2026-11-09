/**
 * Consentement aux cookies (CLAUDE.md § 7.5).
 *
 * Le choix est gardé dans un cookie propriétaire `neotisse_consent` pendant 365 jours,
 * comme le bandeau Complianz de la V1 (durée inférieure aux 13 mois autorisés par la CNIL).
 * Petit magasin compatible `useSyncExternalStore` : le bandeau et le chargement des
 * statistiques lisent le même état.
 */

export type Consent = {
  /** Mesure d’audience (Google Analytics). Désactivée par défaut. */
  statistics: boolean;
  /** Date du choix, ISO. */
  date: string;
};

type State = {
  consent: Consent | null;
  /** Bandeau rouvert par « Gérer mes cookies ». */
  reopened: boolean;
  /** Faux côté serveur : le cookie n’a pas encore été lu. */
  ready: boolean;
};

const COOKIE_NAME = "neotisse_consent";
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

const listeners = new Set<() => void>();
let state: State | null = null;
const serverState: State = { consent: null, reopened: false, ready: false };

function readCookie(): Consent | null {
  const raw = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Consent>;
    if (typeof parsed.statistics !== "boolean" || typeof parsed.date !== "string") return null;
    return { statistics: parsed.statistics, date: parsed.date };
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getConsentState(): State {
  if (state === null) state = { consent: readCookie(), reopened: false, ready: true };
  return state;
}

export function getServerConsentState(): State {
  return serverState;
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Enregistre le choix et ferme le bandeau. */
export function saveConsent(statistics: boolean) {
  const consent: Consent = { statistics, date: new Date().toISOString() };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  if (!statistics) removeAnalyticsCookies();
  state = { consent, reopened: false, ready: true };
  emit();
}

/** Rouvre le bandeau (lien « Gérer mes cookies »). */
export function reopenConsent() {
  state = { ...getConsentState(), reopened: true };
  emit();
}

/** Retrait du consentement : supprime les cookies Google Analytics déjà posés. */
function removeAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  document.cookie.split("; ").forEach((part) => {
    const name = part.split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_") && name !== "_gid") return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    });
  });
}

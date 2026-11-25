/**
 * Mesure d’audience Google Analytics 4 (CLAUDE.md § 7.5).
 *
 * - Rien n’est chargé ni envoyé avant l’accord « Statistiques » du bandeau.
 * - Au retrait de l’accord, les envois s’arrêtent tout de suite (`ga-disable-…`) et les cookies `_ga` sont supprimés.
 * - Un seul point d’entrée pour les événements : `track()`. Aucun champ de formulaire n’est envoyé.
 * - Navigation entre les pages : GA4 la détecte seul (mesure améliorée), ne pas envoyer de `page_view` à la main.
 */
import { getConsentState, subscribeConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const COOKIE_SECONDS = 13 * 30 * 24 * 60 * 60; // moins de 13 mois

/** Plan de taggage : chaque événement et ses seules propriétés permises. */
type Events = {
  view_event: { fiche: string; event_type: string; lien: "oui" | "non" };
  click_lieu: { fiche: string; link_url: string; lien: "oui" };
  submit_avis: { rating: number };
  click_social: { network: "instagram" | "facebook" };
  click_contact: { contact_type: "email" | "telephone" };
};

type GaWindow = Window & { dataLayer?: unknown[] } & Record<string, unknown>;

let started = false;
let enabled = false;

// Les paramètres se lisent par `arguments` : gtag.js ignore les tableaux ordinaires.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  const w = window as unknown as GaWindow;
  w.dataLayer = w.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

/** Page d’arrivée, gardée en mémoire seulement : ses UTM servent si l’accord vient plus tard, sur une autre page. */
const landingSearch = typeof window === "undefined" ? "" : window.location.search;

/** Adresse de la première vue : la page courante, avec les UTM de l’arrivée si elle n’en a pas. */
function firstPageLocation() {
  const url = new URL(window.location.href);
  const hasUtm = [...url.searchParams.keys()].some((key) => key.startsWith("utm_"));
  if (!hasUtm) {
    new URLSearchParams(landingSearch).forEach((value, key) => {
      if (key.startsWith("utm_")) url.searchParams.set(key, value);
    });
  }
  return url.href;
}

function start(id: string) {
  const w = window as unknown as GaWindow;
  w[`ga-disable-${id}`] = false;
  enabled = true;
  if (!started) {
    started = true;
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    gtag("js", new Date());
    gtag("config", id, {
      send_page_view: false,
      cookie_expires: COOKIE_SECONDS,
      // La durée court depuis l’accord : elle n’est pas prolongée à chaque visite.
      cookie_update: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }
  gtag("event", "page_view", { page_location: firstPageLocation() });
}

function stop(id: string) {
  (window as unknown as GaWindow)[`ga-disable-${id}`] = true;
  enabled = false;
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

/** Envoie un événement du plan de taggage, seulement si la mesure est acceptée. */
export function track<K extends keyof Events>(name: K, params: Events[K]) {
  if (enabled) gtag("event", name, params);
}

/** Clics sur les réseaux, l’e-mail et le téléphone, où qu’ils soient dans la page. */
function onClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  if (link.protocol === "mailto:") track("click_contact", { contact_type: "email" });
  else if (link.protocol === "tel:") track("click_contact", { contact_type: "telephone" });
  else if (/(^|\.)instagram\.com$/.test(link.hostname)) track("click_social", { network: "instagram" });
  else if (/(^|\.)facebook\.com$/.test(link.hostname)) track("click_social", { network: "facebook" });
}

/** Suit le choix du bandeau ; renvoie la fonction d’arrêt. Sans identifiant GA4, ne fait rien. */
export function initAnalytics() {
  const id = GA_ID;
  if (!id || window.location.pathname.startsWith("/styleguide")) return () => {};
  const sync = () => {
    const accepted = getConsentState().consent?.statistics === true;
    if (accepted && !enabled) start(id);
    else if (!accepted && enabled) stop(id);
  };
  sync();
  const unsubscribe = subscribeConsent(sync);
  document.addEventListener("click", onClick);
  return () => {
    unsubscribe();
    document.removeEventListener("click", onClick);
  };
}

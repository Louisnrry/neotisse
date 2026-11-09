/**
 * Événements, en attendant Sanity (type `event`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ. Données reprises du WordPress V1.
 */
import { todayInParis } from "@/lib/dates";

export type EventType = "atelier" | "festival" | "conference" | "autre";

export const eventTypeLabels: Record<EventType, string> = {
  atelier: "Atelier",
  festival: "Festival",
  conference: "Conférence",
  autre: "Autre",
};

export type NeoEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  hours?: string;
  place?: string;
  placeUrl?: string;
  placeUrlLabel?: string;
  type: EventType;
  /** 2–3 phrases, affichées sur l’accueil */
  excerpt?: string;
  /** Texte complet (modale du calendrier) : un paragraphe par entrée */
  body: string[];
  image?: { src: string; alt: string };
};

export const events: NeoEvent[] = [
  {
    id: "festival-archeologie-experimentale-occitanie",
    title: "Festival d’Archéologie Expérimentale d’Occitanie",
    startDate: "2027-10-09",
    endDate: "2027-10-10",
    place: "Musée de l’Aurignacien",
    placeUrl: "https://www.musee-aurignacien.com/",
    placeUrlLabel: "Site du musée de l’Aurignacien",
    type: "festival",
    excerpt:
      "Un événement inédit : l’association Néotisse et le musée de l’Aurignacien s’associent pour le tout premier Festival d’Archéologie Expérimentale d’Occitanie. Pendant deux jours, venez à la rencontre d’étudiants, de chercheurs et d’artisans passionnés.",
    body: [
      "Les 9 et 10 octobre 2027, l’association Néotisse et le musée de l’Aurignacien s’associent pour vous faire découvrir la richesse de l’archéologie expérimentale à l’occasion du tout premier Festival d’Archéologie Expérimentale d’Occitanie !",
      "Pendant deux jours, venez à la rencontre d’étudiants, de chercheurs et d’artisans passionnés qui vous feront découvrir cette discipline essentielle à la compréhension des sociétés du passé.",
      "Démonstrations, expérimentations et échanges vous permettront d’explorer les techniques et les savoir-faire anciens, de comprendre les gestes de nos ancêtres et de découvrir comment l’expérimentation contribue à faire avancer la recherche archéologique.",
      "Un rendez-vous inédit pour petits et grands, curieux, passionnés d’histoire ou simples visiteurs, qui souhaitent découvrir l’archéologie autrement, au plus près des gestes, des matières et des expériences !",
      "Rendez-vous les 9 et 10 octobre 2027 pour faire revivre les savoir-faire du passé et expérimenter l’archéologie autrement !",
    ],
  },
  {
    id: "atelier-participatif-musee-tautavel",
    title: "Atelier participatif au musée de Tautavel",
    startDate: "2027-10-26",
    place: "Musée de Tautavel",
    placeUrl: "https://www.450000ans.com/",
    placeUrlLabel: "Site du musée de Tautavel",
    type: "atelier",
    // Texte provisoire de la V1 (lorem ipsum) : à remplacer par l’association.
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    ],
  },
];

/** Événements en cours ou à venir (fin ≥ aujourd’hui à Paris), triés par date de début. */
export function getUpcomingEvents(today = todayInParis()) {
  return events
    .filter((e) => (e.endDate ?? e.startDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** Prochain événement, ou `null`. */
export function getNextEvent(today = todayInParis()) {
  return getUpcomingEvents(today)[0] ?? null;
}

/** Extrait pour l’accueil : l’extrait saisi, sinon le début du texte (45 mots, comme la V1). */
export function eventTeaser(e: NeoEvent) {
  if (e.excerpt) return e.excerpt;
  const words = e.body.join(" ").split(/\s+/);
  return words.length > 45 ? `${words.slice(0, 45).join(" ")}…` : words.join(" ");
}

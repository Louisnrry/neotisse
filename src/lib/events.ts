/** Outils autour des événements (libellés, extraits). */
import type { EventType, NeoEvent, Paragraph } from "@/sanity/types";

export const eventTypeLabels: Record<EventType, string> = {
  atelier: "Atelier",
  festival: "Festival",
  conference: "Conférence",
  autre: "Autre",
};

/** Texte brut d’un paragraphe enrichi (extraits, données structurées). */
export function paragraphText(p: Paragraph): string {
  if (typeof p === "string") return p;
  return p
    .map((part) => {
      if (typeof part === "string") return part;
      if ("strong" in part) return part.strong;
      if ("link" in part) return part.link;
      return " ";
    })
    .join("");
}

/** Extrait pour l’accueil : l’extrait saisi, sinon le début du texte (45 mots, comme la V1). */
export function eventTeaser(e: NeoEvent) {
  if (e.excerpt) return e.excerpt;
  const words = e.body.map(paragraphText).join(" ").split(/\s+/);
  return words.length > 45 ? `${words.slice(0, 45).join(" ")}…` : words.join(" ");
}

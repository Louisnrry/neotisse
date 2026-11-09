import Link from "next/link";
import { Fragment } from "react";

/** Morceau de texte enrichi : texte simple, gras, lien ou retour à la ligne. */
export type Inline = string | { strong: string } | { link: string; href: string } | { br: true };
/** Paragraphe : texte simple ou suite de morceaux enrichis (converti depuis le texte enrichi Sanity). */
export type Paragraph = string | Inline[];

/**
 * Texte enrichi venu de Sanity (voir `src/sanity/lib/portableText.ts`).
 * Gras « relatif » comme la V1 : 400 sur un corps en 300.
 * Lien interne (« /… ») → `next/link` ; e-mail, téléphone, ancre → lien simple ;
 * site externe → nouvel onglet, signalé aux lecteurs d’écran.
 */
export function RichText({ value }: { value: Paragraph }) {
  if (typeof value === "string") return value;
  return value.map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
    if ("strong" in part)
      return (
        <strong key={i} className="font-normal">
          {part.strong}
        </strong>
      );
    if ("br" in part) return <br key={i} />;
    if (part.href.startsWith("/"))
      return (
        <Link key={i} href={part.href}>
          {part.link}
        </Link>
      );
    // E-mail, téléphone, ancre : lien simple, dans le même onglet.
    if (!/^https?:/.test(part.href))
      return (
        <a key={i} href={part.href}>
          {part.link}
        </a>
      );
    return (
      <a key={i} href={part.href} target="_blank" rel="noreferrer noopener">
        {part.link}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  });
}

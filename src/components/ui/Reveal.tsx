"use client";

import { Children, Fragment, useEffect, type ReactNode } from "react";
import { motion, stagger, useAnimate, useInView, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Paragraph } from "./RichText";

/**
 * Animations d’apparition au défilement (Motion), jouées une seule fois, à l’entrée à l’écran.
 * - Le texte est toujours rendu côté serveur (référencement) ; seul son affichage est animé.
 * - Sans JavaScript, la balise <noscript> du layout racine affiche tout (`data-reveal`).
 * - Reduced-motion : état final affiché tout de suite (durées à 0).
 * Détails et réglages : docs/DESIGN.md § 10 ter.
 */

/** Courbe douce, sans rebond : rapide au départ, très lente à l’arrivée. */
const EASE = [0.22, 1, 0.36, 1] as const;
/** Déclenche quand l’élément est un peu entré à l’écran. */
const VIEWPORT = { once: true, amount: 0.3 } as const;

/* ---------------------------------------------------------------- Titres */

type HeadingTag = "h1" | "h2" | "h3" | "p";

/** Texte brut d’un titre, si ses enfants ne sont que du texte (sinon `null` : fondu d’un bloc). */
function plainText(children: ReactNode): string | null {
  const parts = Children.toArray(children);
  return parts.every((p) => typeof p === "string" || typeof p === "number") ? parts.join("") : null;
}

/**
 * Titre animé : les mots montent en fondu l’un après l’autre pendant que les filets
 * (titre à filets) ou le fil rouge s’étendent lentement depuis le titre.
 * Les traits sont des pseudo-éléments CSS (`ruled`, `thread`) dont l’échelle suit
 * `--rule-progress` / `--thread-progress`, animées ici par Motion.
 */
export function AnimatedHeading({
  as = "h2",
  kind,
  id,
  className,
  children,
}: {
  as?: HeadingTag;
  kind: "ruled" | "thread";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const text = plainText(children);

  // Les traits sont réglés par une variable CSS (voir les utilitaires `ruled` et `thread` de globals.css).
  const line = (v: number): Record<`--${string}`, number> =>
    kind === "ruled" ? { "--rule-progress": v } : { "--thread-progress": v };
  const container: Variants = {
    hidden: line(0),
    visible: {
      ...line(1),
      transition: reduce
        ? { duration: 0 }
        : { duration: 1.6, ease: EASE, delay: kind === "thread" ? 0.35 : 0, delayChildren: 0.1, staggerChildren: 0.07 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: "0.35em" },
    visible: { opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 0.8, ease: EASE } },
  };

  // Mots séparés par les espaces ordinaires seulement : une espace insécable (« Contact ? »)
  // garde ses deux voisins dans le même mot.
  const words = text?.split(/( +)/);
  const content = words ? (
    words.map((w, i) =>
      /^ +$/.test(w) || w === "" ? (
        <Fragment key={i}>{w}</Fragment>
      ) : (
        <motion.span key={i} variants={item} data-reveal-item className="inline-block">
          {w}
        </motion.span>
      ),
    )
  ) : (
    <motion.span variants={item} data-reveal-item className="inline-block">
      {children}
    </motion.span>
  );

  return (
    <Tag
      id={id}
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={container}
    >
      {/* Titre à filets : un seul élément entre les deux traits (flex). */}
      {kind === "ruled" ? <span>{content}</span> : content}
    </Tag>
  );
}

/* ---------------------------------------------------------------- Images */

/** Image ou cadre photo qui apparaît en fondu en remontant de 24px. */
export function RevealImage({ className, children }: { className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal=""
      data-reveal-item
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- Paragraphes */

/** Délai entre deux lettres, et durée maximale d’écriture d’un paragraphe (secondes). */
const LETTER_STEP = 0.016;
const MAX_DURATION = 1.2;

/** Une lettre par `<span data-c>`, espaces laissés en texte pour que les lignes se coupent normalement. */
function letters(text: string, keyPrefix: string) {
  return text.split(/( +)/).map((chunk, i) =>
    /^ +$/.test(chunk) ? (
      <Fragment key={`${keyPrefix}-${i}`}>{chunk}</Fragment>
    ) : (
      Array.from(chunk).map((c, j) => (
        <span key={`${keyPrefix}-${i}-${j}`} data-c="">
          {c}
        </span>
      ))
    ),
  );
}

/** Même rendu que <RichText>, découpé en lettres (gras et liens conservés). */
function richLetters(value: Paragraph) {
  if (typeof value === "string") return letters(value, "t");
  return value.map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{letters(part, `${i}`)}</Fragment>;
    if ("br" in part) return <br key={i} />;
    if ("strong" in part)
      return (
        <strong key={i} className="font-normal">
          {letters(part.strong, `${i}`)}
        </strong>
      );
    // Liens : mêmes règles que <RichText> (interne → next/link, externe → nouvel onglet).
    const label = letters(part.link, `${i}`);
    if (part.href.startsWith("/"))
      return (
        <Link key={i} href={part.href}>
          {label}
        </Link>
      );
    if (!/^https?:/.test(part.href))
      return (
        <a key={i} href={part.href}>
          {label}
        </a>
      );
    return (
      <a key={i} href={part.href} target="_blank" rel="noreferrer noopener">
        {label}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  });
}

function hasLink(value: Paragraph) {
  return typeof value !== "string" && value.some((p) => typeof p === "object" && "link" in p);
}

function plain(value: Paragraph) {
  if (typeof value === "string") return value;
  return value
    .map((p) => (typeof p === "string" ? p : "strong" in p ? p.strong : "br" in p ? "\n" : p.link))
    .join("");
}

/**
 * Paragraphe qui s’écrit lettre par lettre, vite (16 ms par lettre, 1,2 s au plus),
 * à son entrée à l’écran. Réservé aux textes courts (intros, textes de sections, accroches).
 * Les lecteurs d’écran lisent le texte entier (copie masquée) ; si le paragraphe contient
 * un lien, le texte découpé reste lisible tel quel pour garder le lien utilisable.
 */
export function TypeText({
  as: Tag = "p",
  value,
  className,
}: {
  as?: "p" | "div" | "span";
  value: Paragraph | null | undefined;
  className?: string;
}) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const inView = useInView(scope, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !scope.current) return;
    const chars = scope.current.querySelectorAll<HTMLElement>("[data-c]");
    if (chars.length === 0) return;
    if (reduce) {
      chars.forEach((c) => (c.style.opacity = "1"));
      return;
    }
    const step = Math.min(LETTER_STEP, MAX_DURATION / chars.length);
    animate(chars, { opacity: 1 }, { duration: 0.12, ease: "linear", delay: stagger(step) });
  }, [inView, reduce, animate, scope]);

  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const linked = hasLink(value);
  return (
    <Tag ref={scope as never} data-reveal="" data-type="" className={cn(className)}>
      {linked ? (
        richLetters(value)
      ) : (
        <>
          <span className="sr-only">{plain(value)}</span>
          <span aria-hidden="true">{richLetters(value)}</span>
        </>
      )}
    </Tag>
  );
}

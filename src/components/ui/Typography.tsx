import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AnimatedHeading } from "./Reveal";

type Tone = "ink" | "creme";
type TitleTag = "h1" | "h2" | "h3" | "p";

const sizeByTag: Record<TitleTag, string> = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  // Titre à filets employé comme surtitre de section, quand un H2 suit
  p: "text-h2",
};

/**
 * Titre à filets (animé à l’entrée à l’écran, voir Reveal.tsx) : texte centré entre deux lignes horizontales de 2px.
 * Encre sur fond clair, crème sur fond rouge ou encre.
 * Utiliser `as="p"` quand il sert de surtitre et qu’un H2 suit (un seul H1 par page).
 */
export function RuledTitle({
  as: Tag = "h2",
  tone = "ink",
  className,
  id,
  children,
}: {
  as?: TitleTag;
  tone?: Tone;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <AnimatedHeading
      as={Tag}
      kind="ruled"
      id={id}
      className={cn(
        "ruled min-w-0 font-display font-normal leading-[1.08]",
        sizeByTag[Tag],
        tone === "creme" ? "text-creme" : "text-ink",
        className,
      )}
    >
      {children}
    </AnimatedHeading>
  );
}

/** Titre suivi du fil rouge (trait 64×4px). Crème sur fond rouge ou encre. */
export function ThreadHeading({
  as: Tag = "h2",
  tone = "ink",
  center = false,
  className,
  id,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  tone?: Tone;
  center?: boolean;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <AnimatedHeading
      as={Tag}
      kind="thread"
      id={id}
      className={cn(
        "thread",
        center && "thread-center text-center",
        tone === "creme" ? "text-creme [--thread-color:var(--color-creme)]" : "text-ink",
        className,
      )}
    >
      {children}
    </AnimatedHeading>
  );
}

/** Surtitre : petites capitales garance, trait de 3px au-dessus. */
export function Kicker({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p
      className={cn(
        "inline-block border-t-[3px] border-garance pt-3 text-kicker font-bold uppercase tracking-[0.14em] text-garance",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Sous-titre en Cormorant italique garance. */
export function Subtitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn("font-serif text-[clamp(1.3rem,2vw,1.6rem)] font-semibold italic leading-[1.3] text-garance", className)}>
      {children}
    </p>
  );
}

/** Grande citation en italique garance. */
export function PullQuote({
  className,
  cite,
  children,
}: {
  className?: string;
  cite?: string;
  children: ReactNode;
}) {
  return (
    <figure className={className}>
      <blockquote className="max-w-[22em] font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold italic leading-[1.2] text-garance">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-4 text-small font-semibold text-gris">{cite}</figcaption>}
    </figure>
  );
}

/** Petite capitale grise (métadonnées : mois, type d’événement…). */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("text-kicker font-bold uppercase tracking-[0.12em] text-gris", className)}>{children}</span>
  );
}

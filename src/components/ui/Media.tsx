import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PlaceholderTone = "garance" | "garance-dark" | "ink" | "lin";

const placeholderTones: Record<PlaceholderTone, string> = {
  garance: "bg-garance text-creme/70",
  "garance-dark": "bg-garance-dark text-creme/70",
  ink: "bg-ink text-creme/60",
  lin: "bg-lin text-ink/50",
};

/**
 * Cadre photo provisoire : aplat de couleur uni (comme la V1, où la trame est masquée par l’aplat),
 * en attendant les vraies photos (Sanity). `trame` ajoute la fine trame rayée.
 * Donner un ratio via `className` (ex. `aspect-[4/5]`).
 */
export function PhotoPlaceholder({
  tone = "garance",
  label = "Photo à venir",
  trame = false,
  className,
}: {
  tone?: PlaceholderTone;
  label?: string;
  trame?: boolean;
  className?: string;
}) {
  return (
    <div role="img" aria-label={label} className={cn("grid place-items-center rounded-[4px]", trame && "bg-trame", placeholderTones[tone], className)}>
      <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden="true">
        <path d="M4 5h16v14H4z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 16l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="15.5" cy="9" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

/** Carte blanche à filet rouge en haut (avis, formulaire du livre d’or, calendrier). */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("border border-filet border-t-4 border-t-garance bg-blanc", className)}>{children}</div>;
}

/** Note en étoiles (affichage seul). */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={cn("inline-flex gap-0.5 text-garance", className)} role="img" aria-label={`Note : ${value} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
          <path
            d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"
            fill={i < value ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

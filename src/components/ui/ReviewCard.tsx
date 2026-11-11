import { Stars } from "@/components/ui/Media";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/dates";
import type { Review } from "@/sanity/types";

/**
 * Carte d’avis (accueil et livre d’or, piste « B » choisie par Louis le 11/11/2026, sans pastille d’initiales) :
 * fond pierre, filet garance de 4px en haut ; en-tête avec le nom (600) et la date (gris) à gauche, les étoiles
 * à droite ; titre de l’avis en police de titre ; texte de l’avis.
 */
export function ReviewCard({ review: r, className }: { review: Review; className?: string }) {
  return (
    <article
      aria-label={r.title ? `${r.title}, par ${r.name}` : `Avis de ${r.name}`}
      className={cn("flex h-full flex-col border-t-4 border-garance bg-pierre p-6", className)}
    >
      <header className="flex items-start justify-between gap-4">
        <p className="min-w-0 leading-[1.35] [overflow-wrap:anywhere]">
          <span className="block font-semibold">{r.name}</span>
          <span className="block text-small text-gris">{formatDate(r.createdAt)}</span>
        </p>
        <Stars rating={r.rating} className="shrink-0 pt-0.5" />
      </header>
      {r.title && (
        <h3 className="mt-4 font-display text-[1.35rem] leading-[1.2] font-normal [overflow-wrap:anywhere]">{r.title}</h3>
      )}
      <p className={cn("leading-[1.7] whitespace-pre-line [overflow-wrap:anywhere]", r.title ? "mt-2" : "mt-4")}>
        {r.text}
      </p>
    </article>
  );
}

/** Ligne « Note moyenne : ★★★★★ 4,9 sur 5 · 7 avis » au-dessus des avis. */
export function ReviewSummary({ average, count, className }: { average: number; count: number; className?: string }) {
  const label = (Math.round(average * 10) / 10).toString().replace(".", ",");
  return (
    <p className={cn("flex flex-wrap items-center gap-2.5 border-b border-ink pt-3.5 pb-[18px] font-semibold", className)}>
      <span>Note moyenne :</span>
      <Stars rating={average} />
      <span>
        {label} sur 5 · {count} avis
      </span>
    </p>
  );
}

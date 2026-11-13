"use client";

import { useEffect, useRef, useState } from "react";
import { ReviewCard, ReviewSummary } from "@/components/ui/ReviewCard";
import type { Review } from "@/sanity/types";

const buttonClass =
  "cursor-pointer rounded-[4px] border border-garance px-7 py-3.5 font-sans text-[0.95rem] leading-none font-bold tracking-[0.04em] text-garance transition-colors duration-200 hover:bg-garance hover:text-blanc";

/**
 * Liste des avis du livre d’or : note moyenne, puis les avis en cartes (même carte que l’accueil,
 * choix de Louis du 11/11/2026, qui remplace la copie du rendu WP Customer Reviews de la V1), un par ligne sur toute la largeur de la colonne (demande de Louis du 11/11/2026).
 * Affichés `step` par `step` (3 par défaut, demande de Louis du 13/11/2026) avec le bouton « Plus d’avis » :
 * le focus passe sur le premier avis ajouté, sans faire défiler la page.
 * Dès qu’on a déplié, « Voir moins » replie la liste aux `step` premiers avis, remonte en haut de la liste
 * et rend le focus au bouton « Plus d’avis ».
 */
export function ReviewList({
  reviews,
  average,
  step,
  moreLabel,
  lessLabel,
}: {
  reviews: Review[];
  average: number;
  step: number;
  moreLabel: string;
  lessLabel: string;
}) {
  const [shown, setShown] = useState(step);
  const root = useRef<HTMLDivElement>(null);
  const firstNew = useRef<HTMLLIElement>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  const pending = useRef<"more" | "less" | null>(null);

  useEffect(() => {
    if (pending.current === "more") {
      firstNew.current?.focus({ preventScroll: true });
    } else if (pending.current === "less") {
      root.current?.scrollIntoView({ block: "start" });
      moreButton.current?.focus({ preventScroll: true });
    }
    pending.current = null;
  }, [shown]);

  function showMore() {
    pending.current = "more";
    setShown((n) => n + step);
  }

  function showLess() {
    pending.current = "less";
    setShown(step);
  }

  const hasMore = shown < reviews.length;
  const canCollapse = shown > step;

  return (
    <div ref={root} className="scroll-mt-[110px]">
      <ReviewSummary average={average} count={reviews.length} />

      <ul className="mt-6 grid gap-5">
        {reviews.slice(0, shown).map((r, i) => (
          <li
            key={r.id}
            ref={i === shown - step && i > 0 ? firstNew : undefined}
            tabIndex={i >= step ? -1 : undefined}
            className="focus:outline-none"
          >
            <ReviewCard review={r} />
          </li>
        ))}
      </ul>

      {(hasMore || canCollapse) && (
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {hasMore && (
            <button ref={moreButton} type="button" onClick={showMore} className={buttonClass}>
              {moreLabel}
            </button>
          )}
          {canCollapse && (
            <button type="button" onClick={showLess} className={buttonClass}>
              {lessLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

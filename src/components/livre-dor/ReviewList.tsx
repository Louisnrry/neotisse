"use client";

import { useEffect, useRef, useState } from "react";
import { ReviewCard, ReviewSummary } from "@/components/ui/ReviewCard";
import type { Review } from "@/sanity/types";

/**
 * Liste des avis du livre d’or : note moyenne, puis les avis en cartes (même carte que l’accueil,
 * choix de Louis du 11/11/2026, qui remplace la copie du rendu WP Customer Reviews de la V1), un par ligne sur toute la largeur de la colonne (demande de Louis du 11/11/2026).
 * Affichés `step` par `step` avec le bouton « Plus d’avis » (comme `avis.js` de la V1) :
 * le focus passe sur le premier avis ajouté, sans faire défiler la page.
 */
export function ReviewList({
  reviews,
  average,
  step,
  moreLabel,
}: {
  reviews: Review[];
  average: number;
  step: number;
  moreLabel: string;
}) {
  const [shown, setShown] = useState(step);
  const firstNew = useRef<HTMLLIElement>(null);
  const focusPending = useRef(false);

  useEffect(() => {
    if (focusPending.current) {
      firstNew.current?.focus({ preventScroll: true });
      focusPending.current = false;
    }
  }, [shown]);

  function showMore() {
    focusPending.current = true;
    setShown((n) => n + step);
  }

  const hasMore = shown < reviews.length;

  return (
    <div>
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

      {hasMore && (
        <>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={showMore}
              className="cursor-pointer rounded-[4px] border border-garance px-7 py-3.5 font-sans text-[0.95rem] leading-none font-bold tracking-[0.04em] text-garance transition-colors duration-200 hover:bg-garance hover:text-blanc"
            >
              {moreLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Stars } from "@/components/ui/Media";
import type { Review } from "@/content/reviews";
import { formatDate } from "@/lib/dates";

/**
 * Liste des avis du livre d’or (CLAUDE.md § 6.5) : note moyenne, puis les avis séparés par des filets,
 * affichés `step` par `step` avec le bouton « Plus d’avis » (comme `avis.js` de la V1).
 * Le focus passe sur le premier avis ajouté, sans faire défiler la page.
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
  const focusIndex = useRef<number | null>(null);

  useEffect(() => {
    if (focusIndex.current !== null) {
      firstNew.current?.focus({ preventScroll: true });
      focusIndex.current = null;
    }
  }, [shown]);

  function showMore() {
    focusIndex.current = shown;
    setShown((n) => n + step);
  }

  return (
    <div>
      <p className="flex flex-wrap items-center gap-2.5 border-b border-ink pt-3.5 pb-[18px] text-small font-semibold">
        <span>Note moyenne&nbsp;:</span>
        <Stars rating={average} />
        <span>{reviews.length} avis</span>
      </p>

      <ul>
        {reviews.slice(0, shown).map((r, i) => (
          <li
            key={r.id}
            ref={i === shown - step && i > 0 ? firstNew : undefined}
            tabIndex={i >= step ? -1 : undefined}
            className="border-b border-filet py-[22px] focus:outline-none"
          >
            <article aria-label={r.title ? `${r.title}, par ${r.name}` : `Avis de ${r.name}`}>
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-small text-gris">
                <Stars rating={r.rating} />
                <span>{formatDate(r.createdAt)}</span>
                <span>
                  par <span className="font-semibold text-ink">{r.name}</span>
                </span>
              </p>
              {r.title && <h3 className="mt-2 text-[1.5rem] leading-[1.2]">{r.title}</h3>}
              <blockquote className="mt-3 border-l-[3px] border-garance py-1 pl-5 leading-[1.7]">
                <p>{r.text}</p>
              </blockquote>
            </article>
          </li>
        ))}
      </ul>

      {shown < reviews.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={showMore}
            className="cursor-pointer border border-garance px-7 py-3.5 font-sans text-[0.95rem] leading-none font-bold tracking-[0.04em] text-garance transition-colors duration-200 hover:bg-garance hover:text-blanc"
          >
            {moreLabel}
          </button>
        </div>
      )}
    </div>
  );
}

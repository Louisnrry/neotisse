"use client";

import { useEffect, useRef, useState } from "react";
import type { Review } from "@/sanity/types";
import { formatDate } from "@/lib/dates";

/**
 * Étoiles de la V1 (extension WP Customer Reviews) : sprite `etoiles.png` de 85×17px,
 * étoiles vides en fond, étoiles pleines par-dessus sur `rating / 5` de la largeur,
 * teintées comme la V1 (`hue-rotate(-30deg) saturate(1.6)`).
 */
function SpriteStars({ rating, className }: { rating: number; className?: string }) {
  const pct = Math.round((Math.max(0, Math.min(5, rating)) / 5) * 1000) / 10;
  const label = Number.isInteger(rating) ? String(rating) : rating.toFixed(1).replace(".", ",");
  return (
    <span role="img" aria-label={`Note : ${label} sur 5`} className={className}>
      <span className="block h-[17px] w-[85px] overflow-hidden bg-[url(/images/avis/etoiles.png)] bg-no-repeat pr-1 [box-sizing:content-box]">
        <span
          className="block h-[17px] bg-[url(/images/avis/etoiles.png)] bg-[position:0_-15px] bg-no-repeat [filter:hue-rotate(-30deg)_saturate(1.6)]"
          style={{ width: `${pct}%` }}
        />
      </span>
    </span>
  );
}

/** Séparateur entre deux avis, comme la V1 : filet `filet` + pointillés gris, 32px au-dessus, 10px dessous. */
function Dotline() {
  return <div aria-hidden="true" className="mt-8 mb-[10px] border-t border-b border-t-filet border-b-[#ccc] border-b-dotted" />;
}

/**
 * Liste des avis du livre d’or, reproduite **à l’identique de la V1** (rendu réel de WP Customer Reviews,
 * décision de Louis du 09/11/2026) : note moyenne, puis chaque avis précédé d’un double séparateur ;
 * étoiles + date en italique + « par Nom » en italique ; titre en Cormorant 0.8em ; texte en 14px.
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
      {/* Note moyenne (V1 : 0.8em, 600, interligne 24px, filet encre en bas) */}
      <p className="border-b border-ink pt-3.5 pb-[18px] text-[0.8em] leading-6 font-semibold">
        <span>Note moyenne&nbsp;: </span>&nbsp;
        <SpriteStars rating={Math.round(average * 100) / 100} className="relative top-[2px] inline-block align-baseline" />
        &nbsp;<span>{reviews.length} avis</span>
      </p>

      <ul>
        {reviews.slice(0, shown).map((r, i) => (
          <li
            key={r.id}
            ref={i === shown - step && i > 0 ? firstNew : undefined}
            tabIndex={i >= step ? -1 : undefined}
            className="focus:outline-none"
          >
            <Dotline />
            <article
              aria-label={r.title ? `${r.title}, par ${r.name}` : `Avis de ${r.name}`}
              className="border-b border-filet py-[22px]"
            >
              {/* Étoiles, date et auteur sur une ligne (empilés sous 601px, comme la V1) */}
              <div className="[&>*]:block min-[601px]:[&>*]:inline-block min-[601px]:[&>*]:align-middle [&>*]:leading-6">
                <SpriteStars rating={r.rating} className="min-[601px]:relative min-[601px]:-top-px min-[601px]:mr-[5px]" />
                <span className="mr-[6px] text-[0.9em] text-gris italic">{formatDate(r.createdAt)}</span>
                <span className="mr-[6px] text-[0.8em] text-gris italic">
                  &nbsp;par&nbsp;<span className="inline-block font-semibold text-ink">{r.name}</span>
                </span>
              </div>
              {r.title && (
                <h3 className="mt-2 font-serif text-[0.8em] leading-6 font-semibold tracking-normal [text-wrap:wrap]">
                  {r.title}
                </h3>
              )}
              <blockquote className="mt-3 border-l-[3px] border-garance py-1 pl-5 text-[14px] leading-[1.7] font-normal [overflow-wrap:anywhere]">
                <p className="inline">{r.text}</p>
              </blockquote>
            </article>
          </li>
        ))}
      </ul>

      {hasMore && (
        <>
          <Dotline />
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={showMore}
              className="cursor-pointer border border-garance px-7 py-3.5 font-sans text-[0.95rem] leading-none font-bold tracking-[0.04em] text-garance transition-colors duration-200 hover:bg-garance hover:text-blanc"
            >
              {moreLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

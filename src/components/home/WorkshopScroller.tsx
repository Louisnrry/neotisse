"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PhotoPlaceholder } from "@/components/ui/Media";
import type { HomeTile } from "@/sanity/queries/home";

/**
 * « Nos ateliers de médiation textile » (accueil), d’après la maquette « Refonte de site » de Louis.
 *
 * - **À partir de 900px** : la section est **épinglée** à l’écran. Chaque atelier occupe 70 % de hauteur
 *   d’écran de défilement : son texte et sa carte apparaissent en fondu en remontant légèrement, la carte
 *   suivante se pose sur la précédente. Le **fil vertical en 3 parties**, à gauche, se remplit avec le défilement.
 * - **Sous 900px** : les ateliers sont empilés (carte puis texte), chacun apparaît en fondu en remontant.
 *
 * Clavier : tabuler vers le lien d’un atelier caché fait défiler la page jusqu’à lui.
 * Détails : docs/DESIGN.md § 9 bis.
 */

/** Défilement consacré à chaque atelier, en % de la hauteur d’écran. */
const STEP_VH = 70;
const EASE = [0.22, 1, 0.36, 1] as const;

export function WorkshopScroller({ tiles }: { tiles: HomeTile[] }) {
  if (tiles.length === 0) return null;
  return (
    <>
      <Pinned tiles={tiles} />
      <Stacked tiles={tiles} />
    </>
  );
}

/* ------------------------------------------------------------ Grand écran : section épinglée */

function Pinned({ tiles }: { tiles: HomeTile[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const n = tiles.length;
  const [active, setActive] = useState(0);

  // 0 quand le haut de la zone touche le haut de l’écran, 1 quand son bas touche le bas.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n))));
  });

  /** Fait défiler jusqu’à l’atelier `i` (au milieu de sa portion), pour le clavier. */
  const reveal = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const distance = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + distance * ((i + 0.5) / n);
    // Après le défilement automatique du navigateur vers l’élément qui reçoit le focus.
    setTimeout(() => window.scrollTo({ top, behavior: "instant" }), 0);
  };

  const duration = reduce ? 0 : 0.9;

  return (
    <div ref={ref} className="relative max-[899px]:hidden" style={{ height: `${n * STEP_VH + 100}svh` }}>
      <div className="sticky top-0 flex h-svh items-center">
        <Progress progress={scrollYProgress} count={n} />

        <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-[clamp(48px,7vw,112px)]">
          {/* Textes : tous dans la même case de grille, un seul visible */}
          <div className="grid">
            {tiles.map((tile, i) => {
              const state = i === active ? "in" : i < active ? "past" : "future";
              return (
                <motion.div
                  key={tile.href}
                  className="col-start-1 row-start-1"
                  style={{ pointerEvents: state === "in" ? "auto" : "none" }}
                  initial={false}
                  animate={state}
                  variants={{
                    future: { opacity: 0, y: 32 },
                    in: { opacity: 1, y: 0, transition: { duration, ease: EASE, delay: reduce ? 0 : 0.12 } },
                    past: { opacity: 0, y: -20 },
                  }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                >
                  <TileText tile={tile} index={i} count={n} onFocus={() => reveal(i)} />
                </motion.div>
              );
            })}
          </div>

          {/* Cartes : empilées, la suivante se pose sur la précédente en remontant */}
          {/* Hauteur : 74 % de l’écran, entre 420 et 760px, pour laisser la place à la navbar */}
          <div className="relative h-[clamp(420px,74svh,760px)] w-full">
            {tiles.map((tile, i) => {
              const state = i === active ? "in" : i < active ? "past" : "future";
              return (
                <motion.div
                  key={tile.href}
                  className="absolute inset-0"
                  style={{ zIndex: i + 1 }}
                  initial={false}
                  animate={state}
                  variants={{
                    future: { opacity: 0, y: 56 },
                    in: { opacity: 1, y: 0, scale: 1 },
                    past: { opacity: 1, y: 0, scale: 0.97 },
                  }}
                  transition={{ duration, ease: EASE }}
                >
                  <TileCard tile={tile} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Fil vertical en autant de parties que d’ateliers : chaque partie se remplit pendant son atelier. */
function Progress({ progress, count }: { progress: MotionValue<number>; count: number }) {
  return (
    <div
      aria-hidden="true"
      // Calé sur le bord gauche de l’écran (la zone est centrée) : 50 % - 50vw = bord de l’écran.
      className="absolute top-1/2 left-[calc(50%-50vw+clamp(12px,2vw,32px))] flex -translate-y-1/2 flex-col gap-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <Segment key={i} progress={progress} index={i} count={count} />
      ))}
    </div>
  );
}

function Segment({ progress, index, count }: { progress: MotionValue<number>; index: number; count: number }) {
  const fill = useTransform(progress, (p) => Math.min(1, Math.max(0, p * count - index)));
  return (
    <span className="relative block h-12 w-[3px] overflow-hidden bg-filet">
      <motion.span className="absolute inset-0 origin-top bg-garance" style={{ scaleY: fill }} />
    </span>
  );
}

/* ------------------------------------------------------------ Petit écran : ateliers empilés */

function Stacked({ tiles }: { tiles: HomeTile[] }) {
  const reduce = useReducedMotion();
  const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: reduce ? 0 : 0.9, ease: EASE },
  } as const;
  return (
    <ol className="grid gap-16 min-[900px]:hidden">
      {tiles.map((tile, i) => (
        <li key={tile.href} className="grid gap-7">
          <motion.div {...reveal} className="relative aspect-[4/5] w-full">
            <TileCard tile={tile} />
          </motion.div>
          <motion.div {...reveal}>
            <TileText tile={tile} index={i} count={tiles.length} />
          </motion.div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------ Contenu d’un atelier */

function TileText({
  tile,
  index,
  count,
  onFocus,
}: {
  tile: HomeTile;
  index: number;
  count: number;
  onFocus?: () => void;
}) {
  return (
    <div className="grid max-w-[34rem] gap-5">
      <p className="text-kicker font-bold tracking-[0.14em] text-garance tabular-nums">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
      <h3 className="thread text-h2">{tile.label}</h3>
      {tile.hook && <p className="text-[1.1rem] leading-[1.7] text-gris">{tile.hook}</p>}
      <p>
        <Link href={tile.href} onFocus={onFocus} className="group font-semibold no-underline">
          Découvrir l’atelier
          <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
          <span className="sr-only"> : {tile.label}</span>
        </Link>
      </p>
    </div>
  );
}

/** Carte : photo de l’atelier, ou aplat de sa couleur. Cliquable (le lien du texte reste celui du clavier). */
function TileCard({ tile }: { tile: HomeTile }) {
  return (
    <Link href={tile.href} tabIndex={-1} aria-hidden="true" className="group absolute inset-0 block overflow-hidden rounded-[8px]">
      {tile.image ? (
        <Image
          src={tile.image.src}
          alt=""
          fill
          sizes="(min-width: 900px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
        />
      ) : (
        <PhotoPlaceholder tone={tile.tone} label="" className="h-full w-full" />
      )}
    </Link>
  );
}

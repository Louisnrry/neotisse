"use client";

import { animate, type AnimationPlaybackControls, type AnimationSequence } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { introLetters, introViewBox } from "./intro-glyphs";
import { introShouldPlay } from "./intro-script";

// Nettoyage différé : en mode strict (dev), React démonte puis remonte aussitôt le composant ;
// on n’enlève les classes que si le composant n’est pas remonté juste après.
let pendingTeardown: number | undefined;

const vb = introViewBox;
const [first] = introLetters;

/** Décalage (unités de la police) qui centre le « N » seul au milieu du mot. */
const nCenterShift = vb.x + vb.width / 2 - (first.x1 + first.x2) / 2;

/** Point de coupe entre « Néo » et « tisse » (unités de la police). */
const cutX = (introLetters[2].x2 + introLetters[3].x1) / 2;

/** Durées (secondes). Total ≈ 4,3 s jusqu’à la page visible. */
const T = {
  nStart: 0.15,
  nDraw: 0.9,
  nSlideAt: 1.0,
  nSlide: 0.6,
  restStart: 1.25,
  letterDraw: 0.45,
  stagger: 0.13,
  fill: 0.35,
  cutAt: 2.75, // le fil crème se trace
  openAt: 3.1, // les moitiés s’écartent (1,25 s, voir globals.css)
  finishAfterOpen: 1.3,
} as const;

const easeDraw = [0.65, 0, 0.35, 1] as const;

/**
 * Intro animée de l’accueil.
 * « Néotisse » en Eagle Lake s’écrit à la plume sur fond garance : le « N » d’abord, centré,
 * puis il glisse pour laisser la place au reste du mot, qui s’écrit lettre par lettre.
 * Un fil crème se trace entre « Néo » et « tisse », puis les deux moitiés s’écartent
 * pour révéler le héro. Clic, touche, molette ou glissé pour passer.
 *
 * Le mot est dessiné deux fois (une copie par moitié d’écran, superposées au pixel près)
 * pour que chaque moitié emporte sa partie du mot en s’écartant.
 */
export function Intro() {
  const introRef = useRef<HTMLDivElement>(null);

  // Arrivée sur l’accueil par un lien interne (pas de rechargement, donc pas de script du <head>) :
  // on pose la classe avant le premier affichage pour éviter tout flash du héro.
  useLayoutEffect(() => {
    if (introShouldPlay()) document.documentElement.classList.add("intro-play");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const el = introRef.current;
    window.clearTimeout(pendingTeardown);
    if (!el) return;
    if (!root.classList.contains("intro-play")) return;
    const intro: HTMLDivElement = el;

    const timers: number[] = [];
    let opened = false;
    let done = false;

    // Place la coupe des deux moitiés entre « Néo » et « tisse », selon la taille réelle du mot.
    const placeCut = () => {
      const svg = intro.querySelector("svg");
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const px = box.left + ((cutX - vb.x) / vb.width) * box.width;
      intro.style.setProperty("--cut", `${px}px`);
    };

    const off = () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("resize", placeCut);
    };

    function finish() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      controls.stop();
      root.classList.remove("intro-play", "intro-open");
      off();
    }

    function open() {
      if (opened) return;
      opened = true;
      intro.classList.add("is-cut");
      root.classList.add("intro-open");
      timers.push(window.setTimeout(finish, T.finishAfterOpen * 1000));
    }

    // Passer l’intro : le mot finit de s’écrire en accéléré pendant que la page s’ouvre.
    function skip() {
      if (opened) return;
      controls.stop();
      animate(all("[data-letter]"), { pathLength: 1, fillOpacity: 1 }, { duration: 0.3 });
      animate(nGroups, { x: 0 }, { duration: 0.3, ease: easeDraw });
      open();
    }

    // Les deux copies du mot : on anime toujours les éléments des deux moitiés ensemble.
    const all = (sel: string) => Array.from(intro.querySelectorAll<SVGElement>(sel));
    const nGroups = all("[data-n]");
    const letter = (i: number) => all(`[data-letter="${i}"]`);

    const sequence: AnimationSequence = [
      // 1. Le N se trace, seul et centré, puis se remplit.
      [letter(0), { pathLength: [0, 1] }, { at: T.nStart, duration: T.nDraw, ease: easeDraw }],
      [letter(0), { fillOpacity: [0, 1] }, { at: T.nStart + T.nDraw - 0.15, duration: T.fill }],
      // 2. Il glisse vers sa place pour laisser la place au reste du mot.
      [nGroups, { x: [nCenterShift, 0] }, { at: T.nSlideAt, duration: T.nSlide, ease: easeDraw }],
      // 3. « éotisse » s’écrit lettre par lettre.
      ...introLetters.slice(1).flatMap((_, k): AnimationSequence => {
        const i = k + 1;
        const at = T.restStart + k * T.stagger;
        return [
          [letter(i), { pathLength: [0, 1] }, { at, duration: T.letterDraw, ease: "easeInOut" }],
          [letter(i), { fillOpacity: [0, 1] }, { at: at + T.letterDraw - 0.12, duration: T.fill }],
        ];
      }),
    ];

    const controls: AnimationPlaybackControls = animate(sequence);

    placeCut();
    window.addEventListener("resize", placeCut);
    intro.addEventListener("click", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    timers.push(window.setTimeout(() => intro.classList.add("is-cut"), T.cutAt * 1000));
    timers.push(window.setTimeout(open, T.openAt * 1000));
    timers.push(window.setTimeout(finish, 8000)); // garde-fou

    return () => {
      intro.removeEventListener("click", skip);
      timers.forEach(clearTimeout);
      controls.stop();
      off();
      pendingTeardown = window.setTimeout(() => root.classList.remove("intro-play", "intro-open"), 0);
    };
  }, []);

  return (
    <div ref={introRef} className="neo-intro" aria-hidden="true">
      <div className="neo-intro__half neo-intro__half--l">
        <IntroWord />
      </div>
      <div className="neo-intro__half neo-intro__half--r">
        <IntroWord />
      </div>
      <span className="neo-intro__thread" />
    </div>
  );
}

/** « Néotisse » en tracés Eagle Lake, invisible au départ (trait à 0, remplissage à 0). */
function IntroWord() {
  return (
    <div className="neo-intro__word">
      <svg viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`} focusable="false">
        {introLetters.map((l, i) => {
          const path = (
            <path
              key={i}
              data-letter={i}
              d={l.d}
              pathLength={1}
              fill="currentColor"
              fillOpacity={0}
              stroke="currentColor"
              strokeWidth={14}
              strokeLinejoin="round"
              strokeDasharray="0 1"
            />
          );
          // Le N est dans un groupe qu’on déplace : il démarre centré.
          return i === 0 ? (
            <g key={i} data-n="" style={{ transform: `translateX(${nCenterShift}px)` }}>
              {path}
            </g>
          ) : (
            path
          );
        })}
      </svg>
    </div>
  );
}

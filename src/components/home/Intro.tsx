"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { introShouldPlay } from "./intro-script";

// Nettoyage différé : en mode strict (dev), React démonte puis remonte aussitôt le composant ;
// on n’enlève les classes que si le composant n’est pas remonté juste après.
let pendingTeardown: number | undefined;

/**
 * Intro animée de l’accueil (reprend intro.js de la V1) :
 * « Néotisse » coupé en deux sur deux moitiés garance, un fil crème se trace au point de coupe,
 * puis les moitiés s’écartent pour révéler le héro. Clic, touche, molette ou glissé pour passer.
 */
export function Intro() {
  const introRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);

  // Arrivée sur l’accueil par un lien interne (pas de rechargement, donc pas de script du <head>) :
  // on pose la classe avant le premier affichage pour éviter tout flash du héro.
  useLayoutEffect(() => {
    if (introShouldPlay()) document.documentElement.classList.add("intro-play");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const intro = introRef.current;
    window.clearTimeout(pendingTeardown);
    if (!intro) return;
    if (!root.classList.contains("intro-play")) return;

    const timers: number[] = [];
    let started = false;
    let opened = false;
    let done = false;
    let cancelled = false;

    // Centre le point de coupe entre « Néo » et « tisse » (mots de largeurs différentes).
    const center = () => {
      const l = leftRef.current?.getBoundingClientRect().width ?? 0;
      const r = rightRef.current?.getBoundingClientRect().width ?? 0;
      intro.style.setProperty("--shift", `${-(r - l) / 2}px`);
    };

    const off = () => {
      window.removeEventListener("keydown", open);
      window.removeEventListener("wheel", open);
      window.removeEventListener("touchmove", open);
      window.removeEventListener("resize", center);
    };

    function finish() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      root.classList.remove("intro-play", "intro-open");
      off();
    }

    function open() {
      if (opened) return;
      opened = true;
      root.classList.add("intro-open");
      timers.push(window.setTimeout(finish, 1400));
    }

    const go = () => {
      if (started || cancelled) return;
      started = true;
      center();
      intro.classList.add("is-ready");
      timers.push(window.setTimeout(() => intro.classList.add("is-cut"), 1000));
      timers.push(window.setTimeout(open, 1650));
    };

    intro.addEventListener("click", open);
    window.addEventListener("keydown", open);
    window.addEventListener("wheel", open, { passive: true });
    window.addEventListener("touchmove", open, { passive: true });
    window.addEventListener("resize", center);

    document.fonts?.ready.then(go);
    timers.push(window.setTimeout(go, 1200));
    timers.push(window.setTimeout(finish, 6000));

    return () => {
      cancelled = true;
      intro.removeEventListener("click", open);
      timers.forEach(clearTimeout);
      off();
      pendingTeardown = window.setTimeout(() => root.classList.remove("intro-play", "intro-open"), 0);
    };
  }, []);

  return (
      <div ref={introRef} className="neo-intro" aria-hidden="true">
        <div className="neo-intro__half neo-intro__half--l">
          <span ref={leftRef} className="neo-intro__word">
            Néo
          </span>
        </div>
        <div className="neo-intro__half neo-intro__half--r">
          <span ref={rightRef} className="neo-intro__word">
            tisse
          </span>
        </div>
        <span className="neo-intro__thread" />
      </div>
  );
}

"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Défilement doux du site avec Lenis (molette et pavé tactile ; le doigt garde le défilement natif).
 * - Inertie légère (1 s) : fluide sans donner l’impression d’être en retard.
 * - Ancres d’une même page : défilement doux, en respectant `scroll-margin-top` (place pour l’en-tête).
 * - Changement de page : arrivée instantanée en haut.
 * - En pause quand la page est verrouillée (intro, menu mobile, modale du calendrier).
 * - Les fenêtres qui défilent seules (`<dialog>`, `role="dialog"` : modale, menu, bandeau de cookies)
 *   gardent leur défilement natif.
 * - `prefers-reduced-motion` : Lenis désactive lui-même le lissage.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoRaf: true,
      prevent: (node) =>
        node instanceof HTMLElement && (node.tagName === "DIALOG" || node.getAttribute("role") === "dialog"),
    });
    lenisRef.current = lenis;

    const root = document.documentElement;
    const syncLock = () => {
      const locked =
        root.classList.contains("intro-play") ||
        root.classList.contains("overflow-hidden") ||
        document.querySelector("dialog[open]") !== null;
      if (locked) lenis.stop();
      else lenis.start();
    };
    const watchRoot = new MutationObserver(syncLock);
    watchRoot.observe(root, { attributes: true, attributeFilter: ["class"] });
    const watchDialogs = new MutationObserver(syncLock);
    watchDialogs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    syncLock();

    return () => {
      watchRoot.disconnect();
      watchDialogs.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Nouvelle page : Lenis repart du haut sans animation (sinon il reprendrait l’ancienne position).
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}

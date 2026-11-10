"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Suite du texte d’un atelier (page Ateliers), repliée derrière « En savoir plus ».
 * - Le bouton déplie et replie le texte (« Voir moins »), en douceur.
 * - Arriver sur l’atelier par l’index en haut de page (lien `#ancre`) ou par une URL `…#ancre`
 *   déplie directement son texte.
 * - Replié, le texte reste dans la page (référencement) mais n’est ni visible ni atteignable au clavier (`inert`).
 */
export function WorkshopMore({ anchor, children }: { anchor: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  useEffect(() => {
    const target = `#${anchor}`;
    // Lien vers l’ancre (index de la page, ou ailleurs) : Lenis gère le défilement sans changer l’URL,
    // donc on écoute le clic plutôt que `hashchange`.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link?.getAttribute("href") === target) setOpen(true);
    };
    const onHash = () => {
      if (window.location.hash === target) setOpen(true);
    };
    onHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, [anchor]);

  return (
    <>
      <motion.div
        id={id}
        inert={!open}
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="group mt-[1.2rem] inline-flex cursor-pointer items-center gap-2 font-semibold text-garance hover:text-garance-dark"
      >
        {open ? "Voir moins" : "En savoir plus"}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </>
  );
}

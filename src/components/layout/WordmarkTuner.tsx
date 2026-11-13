"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export type WordmarkTune = { height: number; offsetY: number; guides: boolean };

/**
 * Panneau de réglage TEMPORAIRE (développement uniquement) : taille et position verticale
 * du mot « Néotisse » de la navbar, pour trouver les bonnes valeurs à reporter dans Header.tsx.
 */
export function WordmarkTuner({ value, onChange }: { value: WordmarkTune; onChange: (v: WordmarkTune) => void }) {
  const [open, setOpen] = useState(true);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const css = `height: ${value.height}px; transform: translateY(${value.offsetY}px);`;

  if (!mounted) return null;
  // Rendu dans <body> : l’en-tête se décale (translate) quand il se cache, ce qui emporterait le panneau.
  return createPortal(
    <div
      className="fixed right-4 bottom-4 z-[300] w-72 rounded-lg border border-filet p-4 text-[13px] text-ink shadow-xl"
      style={{ fontFamily: "system-ui, sans-serif", background: "#fff", boxShadow: "0 10px 30px rgb(0 0 0 / 0.2)" }}
    >
      <div className="flex items-center justify-between">
        <strong>Réglage « Néotisse »</strong>
        <button type="button" onClick={() => setOpen(!open)} className="text-gris underline">
          {open ? "Réduire" : "Ouvrir"}
        </button>
      </div>
      {open && (
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span>
              Taille (hauteur du mot) : <b>{value.height}px</b>
            </span>
            <input
              type="range"
              min={16}
              max={72}
              step={1}
              value={value.height}
              onChange={(e) => onChange({ ...value, height: Number(e.target.value) })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>
              Décalage vertical : <b>{value.offsetY}px</b> {value.offsetY < 0 ? "(monte)" : value.offsetY > 0 ? "(descend)" : ""}
            </span>
            <input
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={value.offsetY}
              onChange={(e) => onChange({ ...value, offsetY: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.guides}
              onChange={(e) => onChange({ ...value, guides: e.target.checked })}
            />
            Repères (milieu de la barre + boîte du mot)
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-pierre px-2 py-1 text-[11px]">{css}</code>
            <button
              type="button"
              className="rounded border border-ink px-2 py-1"
              onClick={() => navigator.clipboard?.writeText(`taille ${value.height}px, décalage ${value.offsetY}px`)}
            >
              Copier
            </button>
          </div>
          <button
            type="button"
            className="self-start text-gris underline"
            onClick={() => onChange({ height: 40, offsetY: 0, guides: value.guides })}
          >
            Réinitialiser (40px, 0)
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}

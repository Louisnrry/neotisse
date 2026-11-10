"use client";

import { useEffect, useState } from "react";

/**
 * Panneau de réglage de l’interlettrage des titres, **en développement seulement**
 * (monté dans `src/app/(site)/layout.tsx` si `NODE_ENV === "development"`).
 * Les curseurs changent en direct les variables CSS `--title-tracking` (titres)
 * et `--ruled-tracking` (titres à filets) lues par `globals.css`.
 * Le réglage est gardé dans le navigateur (localStorage) d’une page à l’autre ;
 * pour l’adopter sur le site, reporter les valeurs comme valeurs par défaut dans `globals.css`.
 */

type Setting = { key: "title" | "ruled"; label: string; cssVar: string; base: number };

const SETTINGS: Setting[] = [
  { key: "title", label: "Titres", cssVar: "--title-tracking", base: 0.009 },
  { key: "ruled", label: "Titres à filets", cssVar: "--ruled-tracking", base: 0.054 },
];

const MIN = -0.05;
const MAX = 0.15;
const STEP = 0.001;
const STORAGE_KEY = "neotisse-tracking-tuner";

type Values = Record<Setting["key"], number>;
const defaults: Values = { title: 0.009, ruled: 0.054 };

function format(v: number) {
  return `${Number(v.toFixed(3))}em`;
}

export function TrackingTuner() {
  const [values, setValues] = useState<Values>(defaults);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Reprend le dernier réglage (si le navigateur l’autorise).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du localStorage au montage
      if (saved && typeof saved.title === "number" && typeof saved.ruled === "number") setValues(saved);
    } catch {}
  }, []);

  // Applique les valeurs à toute la page.
  useEffect(() => {
    const root = document.documentElement;
    SETTINGS.forEach((s) => root.style.setProperty(s.cssVar, format(values[s.key])));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {}
  }, [values]);

  // Retire les variables si le panneau disparaît (retour aux valeurs de globals.css).
  useEffect(
    () => () => SETTINGS.forEach((s) => document.documentElement.style.removeProperty(s.cssVar)),
    [],
  );

  const copy = async () => {
    const text = SETTINGS.map((s) => `${s.cssVar}: ${format(values[s.key])};`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-[300] cursor-pointer border border-ink bg-creme px-3 py-2 font-sans text-[0.8rem] font-bold text-ink shadow-lg"
      >
        Interlettrage
      </button>
    );

  return (
    <div
      role="region"
      aria-label="Réglage de l’interlettrage des titres (développement)"
      className="fixed right-4 bottom-4 z-[300] w-[300px] max-w-[calc(100vw-2rem)] border border-ink border-t-4 border-t-garance bg-creme p-4 font-sans text-[0.85rem] text-ink shadow-lg"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-bold">Interlettrage des titres</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Réduire le panneau"
          className="cursor-pointer px-1 text-[1.1rem] leading-none"
        >
          ×
        </button>
      </div>

      <div className="grid gap-4">
        {SETTINGS.map((s) => {
          const v = values[s.key];
          const pct = Math.round(((v - s.base) / s.base) * 100);
          return (
            <label key={s.key} className="grid gap-1.5">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{s.label}</span>
                <span className="tabular-nums">
                  {format(v)}{" "}
                  <span className="text-gris">
                    ({pct > 0 ? "+" : ""}
                    {pct} %)
                  </span>
                </span>
              </span>
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={v}
                onChange={(e) => setValues((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))}
                className="w-full accent-garance"
              />
            </label>
          );
        })}
      </div>

      <p className="mt-3 text-[0.75rem] text-gris">
        Pourcentages par rapport aux valeurs actuelles du site (0.009em et 0.054em).
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setValues(defaults)}
          className="flex-1 cursor-pointer border border-ink px-2 py-1.5 font-semibold hover:bg-ink hover:text-blanc"
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={copy}
          className="flex-1 cursor-pointer bg-garance px-2 py-1.5 font-semibold text-creme hover:bg-garance-dark"
        >
          {copied ? "Copié !" : "Copier les valeurs"}
        </button>
      </div>
    </div>
  );
}

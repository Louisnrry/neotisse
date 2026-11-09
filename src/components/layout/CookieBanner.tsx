"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cookieBannerContent as t } from "@/content/cookies";
import { cn } from "@/lib/cn";
import { getConsentState, getServerConsentState, saveConsent, subscribeConsent } from "@/lib/consent";

/**
 * Bandeau « Cookies & confidentialité » (CLAUDE.md § 7.5).
 * Copie du bandeau Complianz de la V1 : encart crème en bas à gauche, filet garance de 4px,
 * « Accepter » / « Refuser » / « Personnaliser », puis catégories Fonctionnel et Statistiques
 * et « Enregistrer mes choix ». Affiché tant qu’aucun choix n’est fait, et rouvert par
 * le lien « Gérer mes cookies » du pied de page.
 */
export function CookieBanner() {
  // Côté serveur (et pendant l’hydratation) l’état est « fermé » : le cookie n’est lu que dans le navigateur.
  const { consent, reopened, ready } = useSyncExternalStore(subscribeConsent, getConsentState, getServerConsentState);
  if (!ready || (consent !== null && !reopened)) return null;
  // Chaque ouverture repart de la vue simple, avec le choix déjà enregistré.
  return <Banner initialStatistics={consent?.statistics ?? false} focusOnOpen={reopened} />;
}

function Banner({ initialStatistics, focusOnOpen }: { initialStatistics: boolean; focusOnOpen: boolean }) {
  const [customizing, setCustomizing] = useState(false);
  const [statistics, setStatistics] = useState(initialStatistics);
  const firstButton = useRef<HTMLButtonElement>(null);
  const id = useId();

  // Rouvert depuis le pied de page : le focus va sur le premier bouton (comme la V1).
  useEffect(() => {
    if (focusOnOpen) firstButton.current?.focus();
  }, [focusOnOpen]);

  return (
    <div
      role="dialog"
      aria-labelledby={`${id}-titre`}
      aria-describedby={`${id}-message`}
      className={cn(
        "fixed bottom-0 z-[300] grid max-h-[calc(100vh-20px)] w-full gap-[10px] overflow-y-auto",
        "border-t-4 border-garance bg-creme px-6 pt-6 pb-5 font-sans text-ink",
        "shadow-[rgba(0,0,0,0.19)_0px_10px_20px,rgba(0,0,0,0.23)_0px_6px_6px]",
        "md:bottom-[10px] md:left-[10px] md:w-auto md:min-w-[440px] md:max-w-full",
      )}
    >
      {/* En-tête : grille 100px / titre / 100px comme la V1 (titre masqué sous 426px, comme la V1). */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center min-[400px]:grid-cols-[100px_1fr_100px]">
        <p
          id={`${id}-titre`}
          className="col-start-2 justify-self-center font-serif text-[1.55rem] leading-[1.1] font-bold max-[425px]:hidden"
        >
          {t.title}
        </p>
      </div>

      {/* Séparateur sans hauteur : garde l’espacement de la V1. */}
      <div aria-hidden="true" />

      <div className="w-full overflow-x-hidden overflow-y-auto max-h-[55vh] min-[350px]:min-w-[300px]">
        <p id={`${id}-message`} className="mb-[5px] text-[14px] leading-[1.6] break-words max-[425px]:mr-[5px] md:w-[398px]">
          {t.message}
        </p>

        {customizing && (
          <div className="animate-fondu md:w-[398px]">
            <Category
              title={t.categories.functional.title}
              description={t.categories.functional.description}
              control={<span className="text-[12px] font-medium text-[#008000]">{t.alwaysActive}</span>}
            />
            <Category
              title={t.categories.statistics.title}
              description={t.categories.statistics.description}
              control={<Switch label={t.categories.statistics.title} checked={statistics} onChange={setStatistics} />}
            />
          </div>
        )}
      </div>

      <div aria-hidden="true" />

      <div className="flex flex-col gap-[10px] md:flex-row">
        <button ref={firstButton} type="button" className={cn(btn, accept)} onClick={() => saveConsent(true)}>
          {t.accept}
        </button>
        <button type="button" className={cn(btn, deny)} onClick={() => saveConsent(false)}>
          {t.deny}
        </button>
        {customizing ? (
          <button type="button" className={cn(btn, settings)} onClick={() => saveConsent(statistics)}>
            {t.save}
          </button>
        ) : (
          <button
            type="button"
            className={cn(btn, settings, "underline underline-offset-4 hover:text-garance")}
            onClick={() => setCustomizing(true)}
          >
            {t.customize}
          </button>
        )}
      </div>

      {/* Ligne de liens vide sur la V1 : garde les 10px sous les boutons. */}
      <div aria-hidden="true" />
    </div>
  );
}

// Boutons : mesures du bandeau de la V1 (45px de haut, 15px, 500, interlettrage 0.04em, bordure 1px).
const btn =
  "min-h-[45px] w-full cursor-pointer border p-[10px] text-center text-[15px] leading-[20px] font-medium tracking-[0.04em] whitespace-nowrap transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
const accept = "border-garance bg-garance text-creme hover:border-garance-dark hover:bg-garance-dark";
const deny = "border-garance bg-creme text-garance hover:bg-garance hover:text-creme";
const settings = "border-creme bg-creme text-ink";

function Category({ title, description, control }: { title: string; description: string; control: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    // Marge sous chaque catégorie, dernière comprise (sur la V1, la catégorie Marketing masquée suit Statistiques).
    <div className="mb-[10px] bg-[rgba(239,239,239,0.5)]">
      <div className="grid grid-cols-[1fr_auto_15px] items-center gap-[10px] p-[10px] max-[425px]:grid-cols-1">
        <span id={`${id}-titre`} className="justify-self-start text-[14px] font-medium">
          {title}
        </span>
        {control}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`${id}-description`}
          aria-labelledby={`${id}-titre`}
          onClick={() => setExpanded((value) => !value)}
          className="col-start-3 flex cursor-pointer items-center justify-center max-[425px]:col-start-1"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 448 512"
            className={cn("h-[18px] w-[18px] transition-transform duration-500", expanded && "rotate-180")}
          >
            <path
              fill="currentColor"
              d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"
            />
          </svg>
        </button>
      </div>
      <p id={`${id}-description`} hidden={!expanded} className="p-[10px] text-[14px]">
        {description}
      </p>
    </div>
  );
}

/** Interrupteur 28×15px (gris → garance, pastille crème), case à cocher native par-dessus. */
function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <span className="relative flex items-center">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className="block h-[15px] w-[28px] rounded-[10px] bg-gris transition-colors duration-300 peer-checked:bg-garance peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-garance"
      />
      <span
        aria-hidden="true"
        className="absolute top-[2px] left-[4px] h-[11px] w-[11px] rounded-[10px] bg-creme transition-[left] duration-300 peer-checked:left-[14px]"
      />
    </span>
  );
}

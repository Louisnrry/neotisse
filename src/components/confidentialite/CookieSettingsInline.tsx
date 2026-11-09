"use client";

import { reopenConsent } from "@/lib/consent";

/** Lien « Gérer mes cookies » dans le texte de la politique de confidentialité : rouvre le bandeau (comme la V1). */
export function CookieSettingsInline({ children }: { children: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className="cursor-pointer text-garance underline transition-colors hover:text-garance-dark"
      onClick={reopenConsent}
    >
      {children}
    </button>
  );
}

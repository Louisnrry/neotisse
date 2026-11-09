"use client";

import { reopenConsent } from "@/lib/consent";

/** Lien « Gérer mes cookies » du pied de page : rouvre le bandeau de consentement (comme la V1). */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className="cursor-pointer text-creme hover:underline hover:underline-offset-[3px]"
      onClick={reopenConsent}
    >
      Gérer mes cookies
    </button>
  );
}

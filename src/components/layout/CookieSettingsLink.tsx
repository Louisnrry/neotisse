"use client";

/**
 * Lien « Gérer mes cookies » : rouvre le bandeau de consentement.
 * TODO(cookies) : brancher sur le bandeau sur mesure (CLAUDE.md § 7.5) quand il existera.
 */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="cursor-pointer text-creme hover:underline hover:underline-offset-[3px]"
      onClick={() => window.dispatchEvent(new CustomEvent("neotisse:open-cookie-banner"))}
    >
      Gérer mes cookies
    </button>
  );
}

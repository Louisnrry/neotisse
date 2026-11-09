// Module serveur et client (pas de "use client") : importable depuis le layout racine.

/**
 * Script à placer dans le <head> : décide, avant le premier affichage, si l’intro doit jouer.
 * Comme la V1 : à chaque visite de l’accueil, sauf en reduced-motion ou dans une iframe.
 * La classe `intro-play` masque la page sous les deux rideaux rouges.
 */
export const introDecideScript = `(function(){try{if(location.pathname!=='/')return;if(matchMedia('(prefers-reduced-motion: reduce)').matches||window.self!==window.top)return;document.documentElement.classList.add('intro-play');}catch(e){}})();`;

/** Même règle côté client, pour une arrivée sur l’accueil sans rechargement de page. */
export function introShouldPlay() {
  try {
    if (window.location.pathname !== "/") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return window.self === window.top;
  } catch {
    return false;
  }
}

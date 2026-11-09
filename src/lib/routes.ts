/** URL du site : à conserver telles quelles (référencement, liens existants). */
export const routes = {
  accueil: "/",
  ateliers: "/ateliers-tissage-teinture",
  calendrier: "/calendrier-des-ateliers",
  partenaires: "/partenaires",
  livreDor: "/livre-dor",
  aPropos: "/savoir-faire-textiles-anciens-a-propos",
  contact: "/contact-organiser-un-atelier",
  mentionsLegales: "/mentions-legales",
  confidentialite: "/politique-de-confidentialite",
} as const;

/** Navigation principale (en-tête et pied de page). */
export const mainNav = [
  { label: "Ateliers", href: routes.ateliers },
  { label: "Calendrier", href: routes.calendrier },
  { label: "Partenaires", href: routes.partenaires },
  { label: "Livre d’or", href: routes.livreDor },
  { label: "À propos", href: routes.aPropos },
] as const;

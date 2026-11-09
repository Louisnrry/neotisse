/**
 * Réglages du site, en attendant Sanity (document `siteSettings`).
 * TODO(sanity) : remplacer par une requête GROQ ; ne plus rien coder en dur ici.
 * Valeurs reprises du site WordPress V1.
 */
export const siteSettings = {
  title: "Néotisse",
  description:
    "Association de médiation autour des savoir-faire textiles anciens, basée à Montpellier : ateliers de filage, tissage et teinture végétale.",
  contactEmail: "asso.neotisse@gmail.com",
  footerText: "Association de médiation autour des savoir-faire textiles anciens, basée à Montpellier.",
  footerCta: "Un projet d’atelier, de conférence ou d’expérimentation ?",
  social: {
    instagram: "https://www.instagram.com/neotisse.asso/",
    facebook: "https://www.facebook.com/p/Neotisse-61558744726575/",
  },
} as const;

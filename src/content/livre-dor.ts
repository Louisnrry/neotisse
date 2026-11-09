/**
 * Textes de la page Livre d’or, en attendant Sanity (singleton `page` « livreDor », CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ. Textes repris du WordPress V1 (page 126).
 */
import { siteSettings } from "@/content/site-settings";

export const livreDorPage = {
  seo: {
    title: "Livre d’or : avis sur nos ateliers textiles | Néotisse",
    description:
      "Livre d’or de Néotisse : lisez les avis des participants et des structures qui ont accueilli nos ateliers textiles, puis partagez le vôtre.",
  },
  title: "Livre d’or",
  intro:
    "Vous avez participé à l’un de nos ateliers ou accueilli Néotisse dans votre structure ? Partagez votre expérience, nous serons ravies de vous lire.",
  reviews: {
    title: "Ils nous ont laissé un mot",
    /** Avis affichés à la fois (décision du 09/11/2026, comme le script `avis.js` de la V1). */
    step: 5,
    more: "Plus d’avis",
    empty: "Aucun avis pour le moment. Soyez la première personne à laisser le vôtre !",
  },
  form: {
    title: "Signer le livre d’or",
    cardTitle: "Laisser un avis",
    submit: "Envoyer",
    sending: "Envoi en cours…",
    robot: "Je confirme ne pas être un robot.",
  },
  email: siteSettings.contactEmail,
};

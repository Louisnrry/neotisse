/**
 * Textes de la page Partenaires, en attendant Sanity (singleton `page` « partenaires », CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ. Textes repris du WordPress V1 (page 13).
 * Les cartes viennent de `src/content/partners.ts` (documents `partner`).
 */
import { routes } from "@/lib/routes";

export const partenairesPage = {
  seo: {
    title: "Partenaires : 7 musées et lieux qui nous accueillent",
    description:
      "Partenaires de Néotisse : musées, sites archéologiques, festivals et universités qui ont accueilli nos ateliers de tissage et nos conférences.",
  },
  title: "Nos partenaires",
  intro: "Musées, sites archéologiques, festivals et universités : ils ont accueilli nos ateliers et nos conférences.",
  cta: {
    title: "Devenir l’un de nos partenaires ?",
    text: "Musée, site, festival ou collectivité : construisons ensemble une intervention adaptée à vos publics.",
    button: { label: "Prenez contact", href: routes.contact },
  },
};

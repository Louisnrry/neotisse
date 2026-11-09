/**
 * Textes de la page Calendrier, en attendant Sanity (singleton `calendrierPage`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ. Textes repris du WordPress V1 (page 17).
 * Les événements viennent de `src/content/events.ts` (documents `event`).
 */
import type { Paragraph } from "@/components/ui/RichText";
import { routes } from "@/lib/routes";

export const calendrierPage = {
  seo: {
    title: "Calendrier des ateliers et festivals 2027 | Néotisse",
    description:
      "Calendrier des ateliers Néotisse : tissage, teinture végétale, conférences et festivals d’archéologie expérimentale dans les musées partenaires.",
  },
  title: "Calendrier",
  intro:
    "Le calendrier des ateliers Néotisse rassemble nos prochains rendez-vous : ateliers de tissage et de teinture végétale, conférences et festivals d’archéologie expérimentale, dans les musées et sites partenaires. Cliquez sur un événement pour en savoir plus.",
  upcoming: {
    title: "À venir",
    empty: "Aucun événement programmé pour le moment.",
    more: "En savoir plus",
  },
  agenda: {
    title: "Calendrier des ateliers et événements",
  },
  /** Bouton secondaire de la modale événement. */
  dialogContact: { label: "Prenez contact", href: routes.contact },
  participation: {
    image: {
      src: "/images/photos/hero-atelier.jpg",
      alt: "Calendrier des ateliers Néotisse : atelier explicatif auprès du public",
    },
    title: "Comment participer à nos ateliers ?",
    paragraphs: [
      "Nos ateliers ouverts au public se déroulent dans les lieux qui nous accueillent : musées, sites archéologiques, festivals. L’inscription, les horaires et les tarifs sont gérés par chaque lieu : retrouvez le lien vers son site dans la fiche de l’événement, en cliquant dessus dans le calendrier des ateliers ci-dessus.",
      [
        "Parmi nos prochains rendez-vous, le ",
        { link: "musée de l’Aurignacien", href: "https://www.musee-aurignacien.com/" },
        " accueille le tout premier Festival d’Archéologie Expérimentale d’Occitanie, et le ",
        { link: "musée de Tautavel", href: "https://www.450000ans.com/" },
        " un atelier participatif. Pour découvrir le contenu de chaque format, consultez la page ",
        { link: "Nos ateliers", href: routes.ateliers },
        ".",
      ],
    ] satisfies Paragraph[],
    structures: {
      title: "Vous êtes un musée ou une structure culturelle ?",
      text: [
        "Vous souhaitez inscrire un atelier de tissage, une conférence ou une journée d’expérimentation dans votre programmation ? Chaque intervention est construite avec vous, selon vos publics et vos contraintes. ",
        { link: "Découvrez notre démarche", href: routes.aPropos },
        " ou écrivez-nous.",
      ] satisfies Paragraph,
      button: { label: "Programmer un atelier", href: routes.contact },
    },
  },
};

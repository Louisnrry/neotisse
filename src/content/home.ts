/**
 * Textes de l’accueil, en attendant Sanity (singleton `page` « home », CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ. Textes repris du WordPress V1.
 */
import { routes } from "@/lib/routes";

export const home = {
  hero: {
    title: "Néotisse",
    tagline: "Ateliers de médiation textile pour faire revivre les savoir-faire anciens.",
    cta: { label: "Découvrir nos ateliers", href: routes.ateliers },
    images: [
      {
        src: "/images/photos/hero-tissage.jpg",
        alt: "Atelier de médiation textile : tissage aux tablettes d’une ceinture inspirée des statues-menhirs",
      },
      { src: "/images/photos/hero-atelier.jpg", alt: "Atelier de médiation textile de Néotisse auprès du public" },
    ],
  },
  partners: {
    title: "Ils nous ont fait confiance",
    cta: { label: "Découvrir tous nos partenaires", href: routes.partenaires },
  },
  univers: {
    kicker: "Découvrez l’univers Néotisse",
    title: "Néotisse : l’art de faire revivre un savoir-faire",
    paragraphs: [
      "Fondée en mai 2024 et basée à Montpellier, Néotisse est une association dédiée à la médiation scientifique autour des savoir-faire textiles anciens, du Néolithique au Moyen Âge. Elle conçoit et anime des ateliers de médiation textile, démonstratifs et participatifs, à destination des musées et des structures culturelles.",
      "Notre conviction : les savoir-faire textiles anciens se comprennent pleinement lorsqu’ils sont mis en pratique, manipulés et expérimentés. Une façon de mettre en lumière un patrimoine encore trop souvent méconnu.",
    ],
    cta: { label: "Connaître notre histoire", href: routes.aPropos },
  },
  events: {
    title: "Tenez-vous au courant des prochains événements",
    empty: "Pas d’événement programmé pour le moment, revenez bientôt !",
    cta: { label: "Voir tous nos événements", href: routes.calendrier },
  },
  workshops: {
    title: "Nos ateliers de médiation textile",
    intro:
      "Néotisse propose des ateliers de médiation textile et scientifique autour des savoir-faire anciens, conçus pour faire découvrir les gestes, les matières et les techniques qui ont façonné la production textile au fil des siècles. À travers la démonstration, l’expérimentation et la pratique, petits et grands sont invités à explorer ce patrimoine de manière concrète, sensible et accessible.",
    // TODO(sanity) : tuiles issues des documents `workshop` (titre, ancre, couleur).
    tiles: [
      { label: "Atelier participatif", href: `${routes.ateliers}#participatif`, tone: "garance" },
      { label: "Ateliers pour enfants", href: `${routes.ateliers}#enfants`, tone: "ink" },
      { label: "Ateliers démonstratifs", href: `${routes.ateliers}#demonstratifs`, tone: "garance-dark" },
    ],
    more: "Et bien plus encore à découvrir",
    cta: { label: "Voir tous nos ateliers", href: routes.ateliers },
  },
  reviews: {
    title: "Ils nous ont laissé un mot",
    count: 4,
    cta: { label: "Lire tout le livre d’or", href: routes.livreDor },
  },
  contact: {
    title: "Contact",
    text: "Vous souhaitez proposer un atelier autour des techniques textiles anciennes ? Nous serons ravies d’échanger avec vous afin de concevoir une intervention adaptée à votre projet, à vos publics et à vos besoins.",
    cta: { label: "Prenez contact", href: routes.contact },
  },
} as const;

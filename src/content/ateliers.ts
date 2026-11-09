/**
 * Textes de la page Ateliers, en attendant Sanity (singleton `page` « ateliers » et documents `workshop`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par des requêtes GROQ. Textes repris du WordPress V1 (page 15).
 */
import { routes } from "@/lib/routes";

import type { Paragraph } from "@/components/ui/RichText";

export type { Inline, Paragraph } from "@/components/ui/RichText";

export type Workshop = {
  anchor: string;
  kicker: string;
  title: string;
  subtitle: string;
  hook: string;
  facts: { label: string; value: string }[];
  paragraphs: Paragraph[];
  /** Photo de l’atelier, sinon cadre provisoire de la couleur indiquée. */
  image?: { src: string; alt: string; width?: number; height?: number };
  placeholder: "garance" | "garance-dark" | "ink";
};

export const ateliers = {
  title: "Nos ateliers",
  intro:
    "Tissage, filage, teinture végétale : des ateliers de médiation scientifique pour découvrir les gestes, les matières et les techniques textiles du passé, de manière concrète, sensible et accessible.",
  audience: "Pour les musées, les sites archéologiques, les structures culturelles et les collectivités.",
  workshops: [
    {
      anchor: "demonstratifs",
      kicker: "Démonstration",
      title: "Ateliers démonstratifs",
      subtitle: "Filage, tissage et teinture végétale",
      hook: "De la fibre à l’étoffe : suivez les grandes étapes de la production textile, outils et gestes à l’appui.",
      facts: [
        { label: "Format", value: "Trois pôles modulables, associés ou séparés" },
        { label: "Pour qui", value: "Musées, sites et structures culturelles" },
        { label: "Le plus", value: "Chaque technique replacée dans son contexte historique" },
      ],
      paragraphs: [
        "Découvrez les grandes étapes de la production textile, de la transformation des fibres à la réalisation d’étoffes, en passant par la coloration des fils.",
        "Ces ateliers proposent une présentation démonstrative et explicative des techniques de filage, de tissage et de teinture végétale. À travers les outils, les matières premières et les gestes techniques, les participants découvrent les principes de fabrication des textiles et les connaissances nécessaires à leur réalisation.",
        [
          { strong: "Le filage" },
          " : découvrir comment transformer les fibres en fil et comprendre les gestes et les outils nécessaires à sa fabrication.",
          { br: true },
          { strong: "Le tissage" },
          " : explorer le principe de l’entrecroisement des fils et observer comment leur organisation permet de former une trame.",
          { br: true },
          { strong: "La teinture végétale" },
          " : découvrir les principes de la coloration des fibres à partir de matières végétales et les différentes étapes de préparation et de teinture.",
        ],
        "Les trois pôles peuvent être associés pour proposer une découverte globale de la chaîne opératoire textile, ou dissociés afin de construire une intervention centrée sur une technique particulière.",
      ],
      placeholder: "garance",
    },
    {
      anchor: "participatif",
      kicker: "On met la main à la pâte",
      title: "Atelier participatif",
      subtitle: "Tissage aux tablettes",
      hook: "Initiez-vous au tissage aux tablettes et réalisez votre propre galon !",
      facts: [
        { label: "Format", value: "Pratique, accompagné pas à pas" },
        { label: "On découvre", value: "L’entrecroisement des fils et l’histoire des textiles" },
        { label: "On repart avec", value: "Son propre galon tissé" },
      ],
      paragraphs: [
        "Cette technique ancienne permet de produire des bandes textiles étroites à l’aide de petites tablettes percées, qui servent à organiser et à manipuler les fils. Au fil de l’atelier, les participants découvrent le fonctionnement de cet outil, comprennent le principe de l’entrecroisement des fils et expérimentent les gestes nécessaires à la réalisation d’un galon.",
        "Accompagnés pas à pas, ils s’approprient progressivement la technique et voient leur création prendre forme au fil du tissage. Chaque participant repart avec son propre galon, souvenir concret de cette expérience et de la découverte d’un savoir-faire textile ancien.",
        "Cet atelier associe apprentissage technique, manipulation et création, tout en permettant d’aborder l’histoire des textiles et leurs usages dans les sociétés du passé.",
      ],
      image: {
        src: "/images/photos/hero-tissage.jpg",
        alt: "Atelier de tissage aux tablettes : ceinture à chevrons inspirée des statues-menhirs",
      },
      placeholder: "garance",
    },
    {
      anchor: "enfants",
      kicker: "Jeune public",
      title: "Ateliers pour enfants",
      subtitle: "Découvrir le textile en expérimentant",
      hook: "Le textile se découvre aussi par le jeu : on manipule, on crée, on comprend.",
      facts: [
        { label: "Pour qui", value: "Enfants, activité choisie selon l’âge" },
        { label: "On développe", value: "Motricité fine, concentration, observation" },
        { label: "On repart avec", value: "Son tissage ou son écheveau teint" },
      ],
      paragraphs: [
        "Parce que les savoir-faire textiles se découvrent aussi par le jeu et la manipulation, Néotisse propose des ateliers adaptés au jeune public, favorisant l’expérimentation, la créativité et la compréhension des techniques. Deux activités peuvent être proposées selon l’âge des participants, le contexte et les objectifs de l’intervention.",
        [
          { strong: "Le tissage sur carton, pour comprendre le dessus-dessous." },
          " À l’aide d’un support en carton préparé pour l’activité et de fils de différentes couleurs, les enfants s’initient aux principes fondamentaux du tissage. En passant alternativement le fil au-dessus et au-dessous des fils tendus sur leur support, ils découvrent comment se construit une surface textile. Cette activité ludique permet de développer la motricité fine, la concentration et le sens de l’observation. Chaque enfant repart avec son tissage sur carton, une création personnelle qui témoigne de ce qu’il a appris.",
        ],
        [
          { strong: "La teinture végétale, pour découvrir les couleurs du vivant." },
          " Comment obtenir de la couleur à partir des plantes ? Cet atelier invite les enfants à explorer les principes de la teinture végétale et à découvrir comment certaines matières végétales peuvent colorer les fibres textiles. À travers la présentation des ingrédients, l’observation des couleurs et les différentes étapes de la teinture, ils découvrent une pratique ancienne. Chaque enfant repart avec son écheveau teint, réalisé au cours de l’atelier.",
        ],
      ],
      placeholder: "garance-dark",
    },
    {
      anchor: "conferences",
      kicker: "Transmission",
      title: "Conférences",
      subtitle: "À la découverte de l’archéologie des textiles",
      hook: "Les textiles anciens racontés à partir des découvertes archéologiques et des résultats de la recherche.",
      facts: [
        { label: "Pour qui", value: "Institutions, étudiants, professionnels, grand public" },
        { label: "Format", value: "Adapté au thème, au niveau et au contexte" },
        { label: "Sources", value: "Archéologie, iconographie, recherche" },
      ],
      paragraphs: [
        "Néotisse propose des conférences consacrées aux textiles anciens, à leurs techniques de fabrication et à leur place dans les sociétés du passé.",
        "En s’appuyant sur les découvertes archéologiques, les sources iconographiques et les résultats de la recherche, ces interventions abordent les savoir-faire textiles sous différents angles : production des fibres, filage, tissage, teinture, outils, structures textiles et usages des étoffes.",
        "Le contenu est adaptable aux thématiques souhaitées, au niveau de spécialisation du public et au contexte de l’intervention. Ces conférences s’adressent notamment aux institutions culturelles, aux associations, aux étudiants, aux professionnels du patrimoine, aux communautés scientifiques mais aussi au grand public.",
      ],
      placeholder: "garance",
    },
    {
      anchor: "experimentation",
      kicker: "Recherche",
      title: "Expérimentation archéologique",
      subtitle: "Explorer les techniques textiles anciennes",
      hook: "Mettre les hypothèses à l’épreuve du geste, avec et pour les chercheurs.",
      facts: [
        { label: "Pour qui", value: "Archéologues, chercheurs, professionnels du patrimoine" },
        { label: "Méthode", value: "Données archéologiques, iconographiques et documentaires" },
        { label: "Déjà mené", value: "Ceintures à chevrons inspirées des statues-menhirs" },
      ],
      paragraphs: [
        "Néotisse propose des projets d’expérimentation archéologique autour des techniques et des savoir-faire textiles anciens. En s’appuyant sur les données disponibles, ces expérimentations visent à explorer les gestes, les outils, les matériaux et les procédés techniques liés à la production textile.",
        "Elles permettent de mettre à l’épreuve différentes hypothèses, d’identifier les contraintes techniques propres à certaines méthodes et de mieux appréhender les possibilités offertes par les techniques anciennes.",
        [
          "Une première expérimentation a notamment porté sur la réalisation de ceintures à motifs de chevrons, inspirée de représentations observées sur des ",
          { link: "statues-menhirs", href: "https://fr.wikipedia.org/wiki/Statue-menhir" },
          ". Ce travail permet d’interroger les techniques de fabrication envisageables à partir des indices iconographiques et de confronter les hypothèses aux contraintes de la pratique.",
        ],
        "Chaque projet est conçu en fonction des problématiques scientifiques, des données disponibles et des objectifs de recherche, pour enrichir la réflexion sur les textiles archéologiques et développer de nouvelles pistes d’interprétation.",
      ],
      placeholder: "ink",
    },
  ] satisfies Workshop[],
  cta: {
    title: "Des ateliers de tissage adaptés à vos projets",
    text: "Chaque intervention s’adapte au public, à la durée souhaitée, au contexte historique et à vos objectifs. Les formats se proposent seuls ou se combinent en un parcours plus complet.",
    button: { label: "Prenez contact", href: routes.contact },
  },
};

/**
 * Textes de la page À propos, en attendant Sanity (singleton `page` « aPropos » et documents `teamMember`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par des requêtes GROQ. Textes repris du WordPress V1 (page 19).
 */
import { routes } from "@/lib/routes";

export type EngagementTone = "garance" | "outline" | "ink";

export type TeamMember = {
  name: string;
  role: string;
  bio: string[];
  photoTone: "garance" | "ink";
  link?: { intro: string; label: string; href: string };
};

export const aPropos = {
  seo: {
    title: "Savoir-faire textiles anciens : 3 engagements uniques",
    description:
      "Savoir-faire textiles anciens : découvrez l’équipe et les engagements de Néotisse, qui fait revivre filage, tissage et teinture végétale à Montpellier.",
  },
  intro: {
    title: "À propos de Néotisse",
    subtitle: "Faire vivre les savoir-faire textiles anciens",
    text: "Fondée en mai 2024 et basée à Montpellier, Néotisse est une association loi 1901 dédiée à la médiation scientifique autour des savoir-faire textiles anciens, du Néolithique au Moyen Âge. Elle conçoit et anime des ateliers démonstratifs et participatifs à destination des musées et des structures culturelles, afin de faire découvrir au public les savoir-faire textiles anciens et les techniques du passé et de mettre en lumière un patrimoine encore trop souvent méconnu.",
  },
  demarche: {
    title: "Notre démarche autour des savoir-faire textiles anciens",
    image: {
      src: "/images/photos/hero-atelier.jpg",
      alt: "Atelier de médiation Néotisse sur les savoir-faire textiles anciens",
    },
    before:
      "Les textiles sont omniprésents dans les sociétés, mais ils restent souvent invisibles dans les récits archéologiques. Fragiles et rarement conservés, les vestiges textiles et les outils associés demandent un regard particulier pour être compris, interprétés et transmis. Pourtant, le textile occupe une place essentielle dans l’organisation économique, sociale et culturelle des sociétés anciennes.",
    pull: "C’est de ce constat qu’est née Néotisse.",
    after:
      "À l’origine du projet, une expérience de terrain a révélé tout le potentiel de la médiation par le geste. Lors de l’animation d’un atelier de tissage sur un site archéologique, la curiosité, la compréhension et l’engagement suscités auprès du public ont mis en évidence la force de l’expérimentation. Cette expérience fondatrice a fait émerger une conviction :",
    conviction:
      "les savoir-faire textiles anciens se comprennent pleinement lorsqu’ils sont mis en pratique, manipulés et expérimentés.",
  },
  engagements: {
    title: "Nos engagements pour les savoir-faire textiles anciens",
    intro: "Pour transmettre les savoir-faire textiles anciens, notre approche repose sur trois principes fondamentaux.",
    items: [
      {
        tone: "garance",
        title: "L’originalité",
        tagline: "Mettre le textile au premier plan.",
        text: "Alors que les ateliers de médiation archéologique abordent fréquemment la poterie, la production du feu ou la fabrication de parures, les techniques textiles restent encore peu représentées. Néotisse souhaite combler ce manque en proposant une exploration concrète du filage, du tissage et de la teinture végétale. Ces activités permettent de découvrir des gestes et des techniques souvent méconnus, tout en renouvelant le regard porté sur les sociétés anciennes.",
      },
      {
        tone: "outline",
        title: "La rigueur scientifique",
        tagline: "Transmettre des connaissances fiables.",
        text: "Nos ateliers s’appuient sur les données issues de la recherche archéologique et sur une démarche attentive aux sources, aux vestiges et aux connaissances disponibles. Grâce aux compétences de notre équipe en archéologie, en techniques textiles et en médiation, nous concevons des contenus documentés, adaptés aux publics et aux exigences des institutions culturelles. L’expérimentation pratique vient compléter les connaissances scientifiques, sans jamais s’y substituer.",
      },
      {
        tone: "ink",
        title: "La flexibilité",
        tagline: "Concevoir des ateliers adaptés à chaque projet.",
        text: "Chaque intervention est pensée en fonction de son contexte, de ses objectifs pédagogiques et des publics concernés. Nos ateliers peuvent être modulés selon les besoins des musées, des collectivités, des structures culturelles et des équipes de recherche, en tenant compte des contraintes logistiques et budgétaires. Cette souplesse permet de construire des propositions adaptées à chaque projet, tout en conservant une exigence scientifique et pédagogique.",
      },
    ] satisfies { tone: EngagementTone; title: string; tagline: string; text: string }[],
  },
  mediation: {
    title: "Une médiation des savoir-faire textiles anciens par le geste et la matière",
    text: "Notre démarche est interdisciplinaire : elle associe archéologie, expérimentation des techniques textiles et médiation culturelle. À travers la manipulation des matières, la découverte des outils et l’apprentissage des gestes, nous invitons les participants à appréhender concrètement les réalités techniques des sociétés passées.",
  },
  team: {
    title: "Notre équipe",
    members: [
      {
        name: "Émilie Roma Sert",
        role: "Co-créatrice de Néotisse",
        photoTone: "garance",
        bio: [
          "Doctorante en archéologie au sein du laboratoire ASM (Archéologie des Sociétés Méditerranéennes, Université Paul-Valéry Montpellier 3), Émilie Roma Sert est spécialiste des systèmes de tissage et s’intéresse aux techniques textiles anciennes ainsi qu’à leur place dans les sociétés anciennes.",
          "Afin d’approfondir ses connaissances et d’enrichir sa pratique, elle s’est formée au tissage sur métiers verticaux, au filage et à la teinture végétale auprès de l’association La Couenne. Cette approche, à la croisée de la recherche archéologique et de l’expérimentation artisanale, lui permet d’explorer concrètement les gestes, les savoir-faire et les procédés techniques liés à la production textile.",
          "Elle possède également une expérience en médiation culturelle sur un site archéologique, où elle a pu développer une approche de la transmission des connaissances archéologiques auprès de différents publics, qu’elle met en pratique lors des ateliers de l’association.",
          "À travers son travail, Émilie souhaite faire dialoguer recherche scientifique, pratiques expérimentales et médiation, afin de rendre accessibles les savoir-faire textiles anciens et de contribuer à la valorisation du patrimoine archéologique.",
        ],
      },
      {
        name: "Marie-Salomé Perrichon",
        role: "Co-créatrice de Néotisse",
        photoTone: "ink",
        bio: [
          "Titulaire d’un master en égyptologie, Marie-Salomé Perrichon s’est spécialisée dans l’étude lexicographique des termes de l’égyptien ancien traduits par « tisserand ». Ses recherches portent ainsi sur le vocabulaire lié aux activités textiles dans l’Égypte ancienne, offrant un éclairage sur les métiers, les pratiques et les savoir-faire associés à la production textile.",
          "Dans une démarche alliant recherche scientifique et expérimentation pratique, elle s’est formée au tissage sur métiers verticaux et aux techniques de teinture végétale auprès de l’association La Couenne. Cette formation lui permet d’appréhender les gestes et les procédés techniques de la production textile, en complément de son travail sur les sources écrites anciennes.",
          "Elle possède également une expérience en médiation archéologique, qui nourrit son intérêt pour la transmission des connaissances et la valorisation du patrimoine auprès de différents publics.",
          "À travers son engagement au sein de Néotisse, Marie-Salomé souhaite mettre en dialogue l’étude des sources, l’exploration des techniques textiles et la médiation culturelle, afin de mieux comprendre et de faire découvrir les pratiques textiles des sociétés du passé.",
        ],
        link: {
          intro: "Pour découvrir son parcours en détail,",
          label: "retrouvez Marie-Salomé sur LinkedIn →",
          href: "https://www.linkedin.com/in/marie-salome-perrichon/",
        },
      },
    ] satisfies TeamMember[],
  },
  cta: {
    title: "Travaillons ensemble",
    text: "Vous souhaitez proposer un atelier autour des savoir-faire textiles anciens ? Nous serons ravies d’échanger avec vous afin de concevoir une intervention adaptée à votre projet, à vos publics et à vos besoins.",
    button: { label: "Prenez contact", href: routes.contact },
  },
} as const;

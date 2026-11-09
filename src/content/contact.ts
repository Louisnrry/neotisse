/**
 * Textes de la page Contact, en attendant Sanity (singleton `page` « contact » et documents `faqItem`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par des requêtes GROQ. Textes repris du WordPress V1 (page 11).
 */
import { siteSettings } from "@/content/site-settings";
import { routes } from "@/lib/routes";

/** Morceau de réponse : texte simple ou lien (portable text dans Sanity). */
export type RichPart = string | { text: string; href: string; external?: boolean };

export type FaqItem = { question: string; answer: RichPart[] };

export const contactPage = {
  seo: {
    title: "Organiser un atelier : 10 réponses essentielles | Néotisse",
    description:
      "Organiser un atelier de tissage ou de teinture végétale avec Néotisse : écrivez-nous et trouvez les réponses à vos questions sur nos interventions.",
  },
  title: "Contact",
  intro:
    "Vous souhaitez organiser un atelier autour des savoir-faire textiles anciens ? Nous serons ravies d’échanger avec vous afin de concevoir une intervention adaptée à votre projet, à vos publics et à vos besoins.",
  // TODO(sanity) : téléphone et ville depuis `siteSettings`
  phone: { label: "06 48 65 58 16", href: "tel:+33648655816", person: "Marie-Salomé Perrichon" },
  city: "Montpellier",
  guestbookLink: { label: "Lire et laisser un avis dans notre livre d’or", href: routes.livreDor },
  form: {
    title: "Écrivez-nous",
    subjectPlaceholder: "Organiser un atelier, conférence, partenariat…",
    projectPlaceholder: "Parlez-nous de votre projet : lieu, public, dates envisagées…",
    submit: "Envoyer",
    sending: "Envoi en cours…",
  },
  faq: {
    title: "Organiser un atelier : vos questions",
    image: {
      src: "/images/photos/hero-tissage.jpg",
      alt: "Organiser un atelier de tissage aux tablettes avec Néotisse",
    },
    intro:
      "Musées, festivals, collectivités : voici les réponses aux questions que l’on nous pose le plus souvent avant d’organiser un atelier. Une autre question ? Le formulaire ci-dessus est fait pour ça.",
    items: [
      {
        question: "Qui peut organiser un atelier avec Néotisse ?",
        answer: [
          "Nos ateliers s’adressent aux musées, aux sites archéologiques, aux structures culturelles et aux collectivités. Nous travaillons aussi avec des festivals, des associations et des équipes de recherche. Si votre projet s’adresse au grand public, à des scolaires ou à des spécialistes, nous construisons avec vous une intervention adaptée.",
        ],
      },
      {
        question: "Quels formats peut-on vous demander ?",
        answer: [
          "Cinq formats sont possibles : des ateliers démonstratifs autour du filage, du tissage et de la teinture végétale, un atelier participatif de tissage aux tablettes, des ateliers pour enfants, des conférences sur l’archéologie des textiles et des projets d’expérimentation archéologique. Chacun est détaillé sur la page ",
          { text: "Nos ateliers", href: routes.ateliers },
          ".",
        ],
      },
      {
        question: "Peut-on adapter le contenu à notre public ?",
        answer: [
          "Oui. Chaque intervention est pensée en fonction de son contexte, de ses objectifs pédagogiques et des publics concernés : l’âge des participants, leur niveau, la durée souhaitée et la période historique que vous mettez en avant. Nos contenus s’appuient sur la recherche archéologique, pour une médiation à la fois accessible et rigoureuse.",
        ],
      },
      {
        question: "Peut-on combiner plusieurs ateliers ?",
        answer: [
          "Bien sûr. Les pôles filage, tissage et teinture végétale peuvent être associés pour proposer une découverte complète de la chaîne opératoire textile, ou proposés séparément pour une intervention centrée sur une technique. Pour une journée événementielle, il est aussi possible d’organiser un atelier participatif aux côtés d’une démonstration ou d’une conférence.",
        ],
      },
      {
        question: "Où intervenez-vous ?",
        answer: [
          "Nous sommes basées à Montpellier et nous nous déplaçons dans les lieux qui nous accueillent. Nos interventions nous ont déjà menées du musée de Tautavel au musée de Gergovie, en passant par le ",
          { text: "musée de l’Aurignacien", href: "https://www.musee-aurignacien.com/", external: true },
          ", partenaire du premier Festival d’Archéologie Expérimentale d’Occitanie.",
        ],
      },
      {
        question: "Comment se passe la préparation ?",
        answer: [
          "Tout commence par un échange sur votre projet : vos publics, vos objectifs, vos dates et vos contraintes logistiques et budgétaires. Nous vous adressons ensuite une proposition adaptée, que nous ajustons ensemble jusqu’à ce qu’elle corresponde à vos attentes et à celles de vos visiteurs.",
        ],
      },
      {
        question: "Que préciser dans votre message ?",
        answer: [
          "Pour organiser un atelier dans les meilleures conditions, indiquez si possible le lieu, le type de public, le nombre de participants envisagé, les dates qui vous intéressent et le format qui vous attire. Pas d’inquiétude si tout n’est pas encore défini : nous préciserons ensemble les détails.",
        ],
      },
      {
        question: "Pourquoi organiser un atelier textile dans votre structure ?",
        answer: [
          "Les ateliers de médiation archéologique abordent souvent la poterie, le feu ou la parure, mais rarement le textile. Pourtant, il occupe une place essentielle dans l’organisation économique, sociale et culturelle des sociétés anciennes. Organiser un atelier textile, c’est proposer à vos visiteurs une expérience originale, où l’on comprend le passé en manipulant les matières, les outils et les gestes.",
        ],
      },
      {
        question: "Proposez-vous des activités pour les enfants ?",
        answer: [
          "Oui, deux activités sont pensées pour le jeune public : le tissage sur carton, pour comprendre le principe du dessus-dessous, et la teinture végétale, pour découvrir comment les plantes colorent les fibres. Elles développent la motricité fine, la concentration et l’observation, et chaque enfant repart avec sa propre création.",
        ],
      },
      {
        question: "Travaillez-vous avec des chercheurs ?",
        answer: [
          "Oui. Nous menons des projets d’expérimentation archéologique avec des archéologues, des chercheurs et des professionnels du patrimoine, pour mettre à l’épreuve des hypothèses sur les techniques textiles anciennes. Une première expérimentation a porté sur des ceintures à motifs de chevrons, inspirées des statues-menhirs. Chaque projet est conçu selon vos problématiques scientifiques.",
        ],
      },
    ] satisfies FaqItem[],
  },
  email: siteSettings.contactEmail,
};

/** Texte brut d’une réponse (balisage FAQPage). */
export function plainAnswer(parts: RichPart[]) {
  return parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
}

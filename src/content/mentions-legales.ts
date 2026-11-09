/**
 * Textes de la page Mentions légales, en attendant Sanity (singleton `mentionsLegalesPage`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ ; siège, RNA et téléphone viendront de `siteSettings.legal`.
 * Textes repris du WordPress V1 (page 197), avec les mises à jour de la V2 :
 * directrice de la publication et téléphone connus, hébergeur Netlify (et non OVH).
 * Les mentions « [À COMPLÉTER…] » restent visibles, comme sur la V1, tant que l’association ne les a pas fournies.
 */
import type { Inline as BaseInline } from "@/content/ateliers";
import { siteSettings } from "@/content/site-settings";

/** Texte enrichi des ateliers, plus l’exposant (« 1er » juillet 1901). */
export type Inline = BaseInline | { sup: string };
export type Paragraph = string | Inline[];

const email = siteSettings.contactEmail;
const mail: Inline = { link: email, href: `mailto:${email}` };
const todo = (label: string): Inline => ({ strong: `[À COMPLÉTER : ${label}]` });

export type LegalSection = { title: string; paragraphs: Paragraph[] };

export const mentionsLegalesPage = {
  seo: {
    title: "Mentions légales - Néotisse",
    description:
      "Mentions légales du site de l’association Néotisse : éditeur, directrice de la publication, hébergeur, propriété intellectuelle.",
  },
  title: "Mentions légales",
  /** Date de dernière mise à jour du texte (à changer à chaque modification). */
  updatedAt: "2026-11-09",
  intro: [
    "Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN), voici les informations relatives au propriétaire et éditeur, au réalisateur et à l’hébergeur du site ",
    { link: "neotisse.fr", href: "https://neotisse.fr" },
    ".",
  ] satisfies Paragraph,
  sections: [
    {
      title: "Propriétaire et éditeur du site",
      paragraphs: [
        [
          { strong: "Néotisse" },
          ", association régie par la loi du 1",
          { sup: "er" },
          " juillet 1901.",
          { br: true },
          "Siège social : ",
          todo("adresse du siège"),
          { br: true },
          "Numéro RNA : ",
          todo("numéro RNA, commençant par W"),
          { br: true },
          "E-mail : ",
          mail,
          { br: true },
          "Téléphone : ",
          { link: "06 48 65 58 16", href: "tel:+33648655816" },
        ],
      ],
    },
    {
      title: "Directrice de la publication",
      paragraphs: [
        [
          "Marie-Salomé Perrichon, ",
          todo("fonction, ex. présidente"),
          ", également responsable de la rédaction.",
          { br: true },
          "Contact : ",
          mail,
        ],
      ],
    },
    {
      title: "Conception et réalisation",
      paragraphs: [
        [
          { strong: "bLaNk" },
          ", Louis Nourry, entrepreneur individuel (EI).",
          { br: true },
          "SIRET : ",
          todo("numéro SIRET"),
          { br: true },
          "Adresse : ",
          todo("adresse de l’entreprise"),
          { br: true },
          "TVA intracommunautaire : ",
          todo("numéro de TVA, ou supprimer cette ligne si non concerné"),
          { br: true },
          "E-mail : ",
          { link: "louisnourry07@gmail.com", href: "mailto:louisnourry07@gmail.com" },
          { br: true },
          "Site : ",
          { link: "blank-stud.netlify.app", href: "https://blank-stud.netlify.app/" },
        ],
      ],
    },
    {
      title: "Hébergeur",
      paragraphs: [
        [
          { strong: "Netlify, Inc." },
          ", société de droit américain",
          { br: true },
          "Adresse : 101 2nd Street, San Francisco, CA 94105, États-Unis",
          { br: true },
          "Site : ",
          { link: "www.netlify.com", href: "https://www.netlify.com/" },
        ],
      ],
    },
    {
      title: "Propriété intellectuelle",
      paragraphs: [
        "L’ensemble des contenus de ce site (textes, photographies, illustrations, logo, charte graphique) est la propriété de l’association Néotisse, sauf mention contraire, et est protégé par le Code de la propriété intellectuelle.",
        [
          "Toute reproduction, représentation, modification ou diffusion, totale ou partielle, de ces contenus, par quelque procédé que ce soit, est interdite sans l’autorisation écrite préalable de l’association. Pour toute demande, écrivez à ",
          mail,
          ".",
        ],
        "Les marques et logos des partenaires cités sur le site restent la propriété de leurs détenteurs respectifs.",
      ],
    },
    {
      title: "Liens vers d’autres sites",
      paragraphs: [
        "Le site contient des liens vers des sites externes (partenaires, musées, réseaux sociaux). Néotisse n’exerce aucun contrôle sur leur contenu et ne saurait être tenue responsable des informations qui y sont publiées.",
      ],
    },
    {
      title: "Droit applicable",
      paragraphs: [
        [
          "Les présentes mentions légales sont soumises au droit français. Pour toute question relative au site, vous pouvez écrire à ",
          mail,
          ".",
        ],
      ],
    },
  ] satisfies LegalSection[],
};

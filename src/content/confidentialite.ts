/**
 * Textes de la page Politique de confidentialité, en attendant Sanity (singleton `politiqueConfidentialitePage`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ ; siège et fonction de la représentante viendront de `siteSettings.legal`.
 *
 * Textes repris du WordPress V1 (page 201), mis à jour pour la V2 (CLAUDE.md § 7.5 et § 9) :
 * - hébergeur Netlify (États-Unis) au lieu d’OVH (France), d’où un transfert hors UE à mentionner ;
 * - avis du livre d’or enregistrés dans Sanity ;
 * - bandeau de cookies sur mesure (cookie `neotisse_consent`, 12 mois, voir `src/lib/consent.ts`) au lieu de Complianz ;
 * - plus de cookies de commentaires WordPress ni de stockage des émojis ;
 * - accès au Studio Sanity au lieu de l’administration WordPress.
 * Les mentions « [À COMPLÉTER…] » restent visibles, comme sur la V1, tant que l’association ne les a pas fournies.
 */
import { siteSettings } from "@/content/site-settings";

/** Morceau de texte enrichi (portable text dans Sanity). `cookies` = bouton « Gérer mes cookies ». */
export type PrivacyInline =
  | string
  | { strong: string }
  | { code: string }
  | { sup: string }
  | { br: true }
  | { link: string; href: string }
  | { cookies: string };
export type PrivacyText = string | PrivacyInline[];

/** Bloc d’une section : paragraphe, liste à puces ou intertitre (H3) suivi de sa liste. */
export type PrivacyBlock =
  | { type: "p"; text: PrivacyText }
  | { type: "ul"; items: PrivacyText[] }
  | { type: "h3"; title: string; items: PrivacyText[] };

export type PrivacySection = { anchor: string; title: string; blocks: PrivacyBlock[] };

const email = siteSettings.contactEmail;
const mail: PrivacyInline = { link: email, href: `mailto:${email}` };
const todo = (label: string): PrivacyInline => ({ strong: `[À COMPLÉTER : ${label}]` });
/** Ligne de liste « **Libellé :** texte ». */
const item = (label: string, text: string): PrivacyInline[] => [{ strong: `${label} :` }, ` ${text}`];

export const confidentialitePage = {
  seo: {
    title: "Politique de confidentialité - Néotisse",
    description:
      "Politique de confidentialité du site de l’association Néotisse : données collectées, cookies, durées de conservation et exercice de vos droits.",
  },
  title: "Politique de confidentialité",
  /** Date de dernière mise à jour du texte (à changer à chaque modification). */
  updatedAt: "2026-11-09",
  intro:
    "L’association Néotisse attache une grande importance à la protection de vos données personnelles. Cette page explique, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, quelles données nous collectons sur ce site, pourquoi, combien de temps nous les gardons et comment exercer vos droits.",
  tocTitle: "Sommaire",
  sections: [
    {
      anchor: "responsable",
      title: "Qui est responsable de vos données ?",
      blocks: [
        {
          type: "p",
          text: [
            "Le responsable du traitement est l’association ",
            { strong: "Néotisse" },
            ", association régie par la loi du 1",
            { sup: "er" },
            " juillet 1901, représentée par Marie-Salomé Perrichon, ",
            todo("fonction, ex. présidente"),
            ".",
            { br: true },
            "Siège social : ",
            todo("adresse du siège"),
            { br: true },
            "Contact pour toute question sur vos données : ",
            mail,
          ],
        },
      ],
    },
    {
      anchor: "donnees",
      title: "Quelles données collectons-nous, et pourquoi ?",
      blocks: [
        {
          type: "p",
          text: "Nous ne collectons que les données nécessaires. Nous ne les vendons pas, ne les louons pas et ne les utilisons pas à des fins publicitaires.",
        },
        {
          type: "h3",
          title: "Le formulaire de contact",
          items: [
            item("Données", "nom, prénom, adresse e-mail, objet et message."),
            item("Finalité", "répondre à votre demande (atelier, conférence, partenariat, question)."),
            item(
              "Base légale",
              "notre intérêt légitime à répondre aux personnes qui nous contactent, ou les mesures précontractuelles prises à votre demande.",
            ),
            item("Fonctionnement", "votre message n’est pas enregistré sur le site ; il est transmis par e-mail."),
            item("Durée de conservation", "3 ans après notre dernier échange, puis suppression."),
          ],
        },
        {
          type: "h3",
          title: "Le livre d’or",
          items: [
            item(
              "Données",
              "nom, adresse e-mail, titre, note et texte de votre avis, ainsi que votre adresse IP, enregistrée automatiquement pour prévenir les abus.",
            ),
            item(
              "Ce qui est publié",
              "uniquement votre nom, le titre, la note, le texte de l’avis et sa date. Votre adresse e-mail et votre adresse IP ne sont jamais publiées.",
            ),
            item("Modération", "chaque avis est relu par l’association avant sa publication."),
            item("Base légale", "votre consentement, que vous exprimez en déposant volontairement votre avis."),
            item(
              "Durée de conservation",
              "l’avis reste en ligne tant que vous n’en demandez pas la suppression ; les données associées sont supprimées en même temps que l’avis.",
            ),
          ],
        },
        {
          type: "h3",
          title: "Les statistiques de visite",
          items: [
            item("Outil", "Google Analytics, uniquement si vous l’acceptez dans le bandeau cookies."),
            item(
              "Données",
              "pages consultées, durée de visite, provenance, type d’appareil et de navigateur, localisation approximative, identifiant d’un cookie.",
            ),
            item("Finalité", "comprendre comment le site est utilisé afin de l’améliorer."),
            item("Base légale", "votre consentement, que vous pouvez retirer à tout moment."),
            item("Durée de conservation", "14 mois pour les données de statistiques."),
          ],
        },
        {
          type: "h3",
          title: "Les journaux techniques",
          items: [
            item("Données", "adresse IP, date et heure de la visite, page demandée, navigateur."),
            item("Finalité", "assurer la sécurité et le bon fonctionnement du site."),
            item("Base légale", "notre intérêt légitime et les obligations légales de l’hébergeur."),
            item("Durée de conservation", "12 mois maximum."),
          ],
        },
      ],
    },
    {
      anchor: "cookies",
      title: "Cookies et traceurs",
      blocks: [
        {
          type: "p",
          text: "Un cookie est un petit fichier déposé sur votre appareil. Les cookies non indispensables ne sont déposés qu’après votre accord, donné dans le bandeau qui s’affiche lors de votre première visite.",
        },
        {
          type: "ul",
          items: [
            [
              { strong: "Cookie de consentement (" },
              { code: "neotisse_consent" },
              { strong: ")" },
              ", indispensable : il mémorise vos choix pour ne pas vous les redemander à chaque page. Durée : 12 mois.",
            ],
            [
              { strong: "Cookies de statistiques (" },
              { code: "_ga" },
              { strong: ", " },
              { code: "_ga_…" },
              { strong: ", Google Analytics)" },
              ", soumis à votre accord : ils distinguent les visiteurs pour mesurer l’audience. Durée : 13 mois.",
            ],
          ],
        },
        {
          type: "p",
          text: [
            "Vous pouvez modifier vos choix à tout moment en cliquant sur ",
            { cookies: "Gérer mes cookies" },
            ", également accessible en bas de chaque page. Vous pouvez aussi paramétrer votre navigateur pour refuser les cookies.",
          ],
        },
      ],
    },
    {
      anchor: "reseaux",
      title: "Liens vers les réseaux sociaux",
      blocks: [
        {
          type: "p",
          text: "Le site contient de simples liens vers nos pages Instagram, Facebook et LinkedIn. Aucun contenu de ces réseaux n’est intégré au site : rien n’est chargé et aucune donnée ne leur est transmise tant que vous ne cliquez pas sur ces liens. Une fois sur ces plateformes, leurs propres politiques de confidentialité s’appliquent.",
        },
      ],
    },
    {
      anchor: "destinataires",
      title: "Qui a accès à vos données ?",
      blocks: [
        {
          type: "ul",
          items: [
            [{ strong: "Les membres du bureau de Néotisse" }, ", pour traiter vos demandes et modérer les avis."],
            [{ strong: "bLaNk" }, ", prestataire chargé de la réalisation et de la maintenance du site."],
            [{ strong: "Netlify" }, " (San Francisco, États-Unis), hébergeur du site."],
            [{ strong: "Sanity" }, ", outil de gestion des contenus du site, où sont enregistrés les avis du livre d’or."],
            [
              { strong: "Notre prestataire d’envoi d’e-mails" },
              ", qui achemine les messages du formulaire de contact jusqu’à notre boîte de réception.",
            ],
            [{ strong: "Google" }, ", pour les statistiques de visite, uniquement si vous les avez acceptées."],
          ],
        },
        {
          type: "p",
          text: "Ces prestataires agissent sur nos instructions et sont tenus de protéger vos données. Vos données peuvent aussi être communiquées aux autorités si la loi l’exige.",
        },
      ],
    },
    {
      anchor: "transferts",
      title: "Transferts hors de l’Union européenne",
      blocks: [
        {
          type: "p",
          text: "Le site est hébergé par Netlify, société américaine : les journaux techniques peuvent donc être traités aux États-Unis. Si vous acceptez les statistiques, certaines données peuvent aussi être transférées aux États-Unis par Google. Ces transferts sont encadrés par le Data Privacy Framework, décision d’adéquation adoptée par la Commission européenne le 10 juillet 2023, ou à défaut par les clauses contractuelles types de la Commission européenne. De même, lorsque l’outil de gestion des contenus ou le prestataire de messagerie électronique traite des données hors de l’Union européenne, ce traitement est encadré par des garanties appropriées prévues par le RGPD.",
        },
      ],
    },
    {
      anchor: "securite",
      title: "Sécurité et sauvegardes",
      blocks: [
        {
          type: "p",
          text: "Nous prenons des mesures pour protéger vos données : connexion chiffrée (HTTPS), accès à l’espace d’administration du site réservé aux personnes autorisées et protégé par leur compte personnel, mises à jour régulières.",
        },
        {
          type: "p",
          text: [
            "Les contenus du site font l’objet de sauvegardes, qui peuvent contenir les avis du livre d’or. Elles sont stockées ",
            todo("lieu de stockage des sauvegardes"),
            " et conservées ",
            todo("durée de conservation des sauvegardes"),
            ".",
          ],
        },
      ],
    },
    {
      anchor: "droits",
      title: "Vos droits",
      blocks: [
        { type: "p", text: "Vous disposez des droits suivants sur vos données :" },
        {
          type: "ul",
          items: [
            [{ strong: "Accès" }, " : savoir quelles données nous détenons sur vous et en obtenir une copie."],
            [{ strong: "Rectification" }, " : corriger des données inexactes."],
            [{ strong: "Effacement" }, " : demander la suppression de vos données, par exemple de votre avis."],
            [{ strong: "Limitation" }, " : demander le gel temporaire d’un traitement."],
            [{ strong: "Opposition" }, " : vous opposer à un traitement fondé sur notre intérêt légitime."],
            [{ strong: "Portabilité" }, " : récupérer les données que vous nous avez fournies dans un format lisible."],
            [
              { strong: "Retrait du consentement" },
              " : à tout moment, sans remettre en cause ce qui a été fait auparavant.",
            ],
            [{ strong: "Directives après le décès" }, " : définir ce que deviennent vos données après votre décès."],
          ],
        },
        {
          type: "p",
          text: [
            "Pour exercer ces droits, écrivez-nous à ",
            mail,
            ". Nous vous répondrons dans un délai d’un mois. Nous pourrons vous demander un justificatif d’identité en cas de doute raisonnable sur votre identité.",
          ],
        },
        {
          type: "p",
          text: [
            "Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL : ",
            { link: "www.cnil.fr/fr/plaintes", href: "https://www.cnil.fr/fr/plaintes" },
            ", ou par courrier à CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.",
          ],
        },
      ],
    },
    {
      anchor: "modifications",
      title: "Modification de cette politique",
      blocks: [
        {
          type: "p",
          text: [
            "Nous pouvons faire évoluer cette politique, notamment en cas de nouveau service sur le site. La date de dernière mise à jour est indiquée en haut de la page. Pour toute question, écrivez à ",
            mail,
            ".",
          ],
        },
      ],
    },
  ] satisfies PrivacySection[],
};

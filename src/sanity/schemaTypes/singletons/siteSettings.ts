import { CogIcon } from "@sanity/icons/Cog"
import { defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Réglages du site",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nom du site",
      type: "string",
      initialValue: "Néotisse",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description du site",
      type: "text",
      rows: 3,
      description: "Description par défaut utilisée par les moteurs de recherche.",
      validation: (rule) => rule.required().max(160).warning("160 caractères maximum conseillés."),
    }),
    imageWithAltField("logo", "Logo", { hotspot: false }),
    defineField({
      name: "contactEmail",
      title: "E-mail public",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "contactRecipient",
      title: "E-mail de réception des demandes",
      type: "string",
      description: "Adresse qui reçoit les messages du formulaire de contact.",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      placeholder: "06 48 65 58 16",
    }),
    defineField({
      name: "phonePerson",
      title: "Personne associée au téléphone",
      type: "string",
      placeholder: "Marie-Salomé Perrichon",
    }),
    defineField({
      name: "city",
      title: "Ville",
      type: "string",
      initialValue: "Montpellier",
    }),
    defineField({
      name: "social",
      title: "Réseaux sociaux",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Texte du pied de page",
      type: "text",
      rows: 2,
      initialValue:
        "Association de médiation autour des savoir-faire textiles anciens, basée à Montpellier.",
    }),
    defineField({
      name: "footerCta",
      title: "Accroche du pied de page",
      type: "string",
      initialValue: "Un projet d’atelier, de conférence ou d’expérimentation ?",
    }),
    defineField({
      name: "gaMeasurementId",
      title: "Identifiant Google Analytics 4",
      type: "string",
      description: "Facultatif. Le script n’est chargé qu’après consentement.",
    }),
    defineField({
      name: "legal",
      title: "Informations légales",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "siegeAddress",
          title: "Siège social",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "rna",
          title: "Numéro RNA",
          type: "string",
        }),
        defineField({
          name: "publicationDirector",
          title: "Directrice de la publication",
          type: "string",
          initialValue: "Marie-Salomé Perrichon",
        }),
        defineField({
          name: "phone",
          title: "Téléphone légal",
          type: "string",
        }),
        defineField({
          name: "siret",
          title: "SIRET de l’agence",
          type: "string",
          description: "SIRET de bLaNk, à compléter plus tard.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
    prepare({ title, subtitle }) {
      return { title: title || "Réglages du site", subtitle }
    },
  },
})

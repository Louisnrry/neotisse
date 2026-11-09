import { CalendarIcon } from "@sanity/icons/Calendar"
import { defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"
import { richTextField } from "../shared/richText"

const eventTypeOptions = [
  { title: "Atelier", value: "atelier" },
  { title: "Festival", value: "festival" },
  { title: "Conférence", value: "conference" },
  { title: "Autre", value: "autre" },
] as const

export const event = defineType({
  name: "event",
  title: "Événement",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Identifiant utilisé dans l’URL de la fiche événement.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Date de début",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Date de fin",
      type: "date",
      description: "Laisser vide pour un événement d’un seul jour.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const start = context.document?.startDate as string | undefined
          if (value && start && value < start) {
            return "La date de fin doit être postérieure à la date de début."
          }
          return true
        }),
    }),
    defineField({
      name: "hours",
      title: "Horaires",
      type: "string",
      placeholder: "10h – 18h",
    }),
    defineField({
      name: "place",
      title: "Lieu",
      type: "string",
      placeholder: "Musée de l’Aurignacien",
    }),
    defineField({
      name: "placeUrl",
      title: "Site du lieu",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "placeUrlLabel",
      title: "Libellé du lien vers le lieu",
      type: "string",
      placeholder: "Site du musée de l’Aurignacien",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: [...eventTypeOptions], layout: "radio" },
      initialValue: "atelier",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Accroche",
      type: "text",
      rows: 3,
      description:
        "2–3 phrases affichées sur l’accueil. Si ce champ est vide, le début du texte complet est utilisé.",
      validation: (rule) => rule.max(320).warning("L’accroche est plus lisible en 2–3 phrases."),
    }),
    richTextField("body", "Texte complet", { required: true }),
    imageWithAltField("image", "Visuel", { hotspot: true }),
  ],
  orderings: [
    {
      title: "Date de début (ancienne → récente)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Date de début (récente → ancienne)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      startDate: "startDate",
      type: "type",
      media: "image",
    },
    prepare({ title, startDate, type, media }) {
      const typeLabel = eventTypeOptions.find((option) => option.value === type)?.title
      return {
        title,
        subtitle: [startDate, typeLabel].filter(Boolean).join(" · "),
        media,
      }
    },
  },
})

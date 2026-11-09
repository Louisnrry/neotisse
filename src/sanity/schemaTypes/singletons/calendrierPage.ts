import { CalendarIcon } from "@sanity/icons/Calendar"
import { defineField, defineType } from "sanity"
import { linkField } from "../shared/link"
import { seoField } from "../shared/seo"

export const calendrierPage = defineType({
  name: "calendrierPage",
  title: "Calendrier",
  type: "document",
  icon: CalendarIcon,
  fields: [
    seoField(),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Calendrier",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "upcomingTitle",
      title: "Titre de la liste « À venir »",
      type: "string",
      initialValue: "À venir",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "empty",
      title: "Message sans événement",
      type: "text",
      rows: 2,
      initialValue: "Pas d’événement programmé pour le moment, revenez bientôt !",
    }),
    defineField({
      name: "participationTitle",
      title: "Titre « Comment participer »",
      type: "string",
      initialValue: "Comment participer à nos ateliers ?",
    }),
    defineField({
      name: "participationText",
      title: "Texte « Comment participer »",
      type: "text",
      rows: 4,
    }),
    linkField("participationCta", "Bouton « Comment participer »"),
    defineField({
      name: "structuresTitle",
      title: "Titre pour les structures",
      type: "string",
      initialValue: "Vous êtes un musée ou une structure culturelle ?",
    }),
    defineField({
      name: "structuresText",
      title: "Texte pour les structures",
      type: "text",
      rows: 3,
    }),
    linkField("structuresCta", "Bouton pour les structures"),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Calendrier", subtitle: "Page Calendrier" }
    },
  },
})

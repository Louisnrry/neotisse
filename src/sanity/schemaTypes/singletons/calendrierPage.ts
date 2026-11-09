import { CalendarIcon } from "@sanity/icons/Calendar"
import { defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"
import { linkField } from "../shared/link"
import { richTextField } from "../shared/richText"
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
      initialValue: "Aucun événement programmé pour le moment.",
    }),
    defineField({
      name: "agendaTitle",
      title: "Titre du calendrier mensuel",
      type: "string",
      initialValue: "Calendrier des ateliers et événements",
    }),
    defineField({
      name: "participationTitle",
      title: "Titre « Comment participer »",
      type: "string",
      initialValue: "Comment participer à nos ateliers ?",
    }),
    imageWithAltField("participationImage", "Photo « Comment participer »"),
    richTextField("participationText", "Texte « Comment participer »"),
    defineField({
      name: "structuresTitle",
      title: "Titre pour les structures",
      type: "string",
      initialValue: "Vous êtes un musée ou une structure culturelle ?",
    }),
    richTextField("structuresText", "Texte pour les structures"),
    linkField("structuresCta", "Bouton pour les structures"),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Calendrier", subtitle: "Page Calendrier" }
    },
  },
})

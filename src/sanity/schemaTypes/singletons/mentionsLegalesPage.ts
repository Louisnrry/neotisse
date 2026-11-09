import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { defineField, defineType } from "sanity"
import { richTextField } from "../shared/richText"
import { seoField } from "../shared/seo"

export const mentionsLegalesPage = defineType({
  name: "mentionsLegalesPage",
  title: "Mentions légales",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    seoField({ noindex: true }),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Mentions légales",
      validation: (rule) => rule.required(),
    }),
    richTextField("body", "Contenu", { required: true }),
    defineField({
      name: "updatedAt",
      title: "Dernière mise à jour",
      type: "date",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Mentions légales", subtitle: "Page légale (non indexée)" }
    },
  },
})

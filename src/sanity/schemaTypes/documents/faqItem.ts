import { HelpCircleIcon } from "@sanity/icons/HelpCircle"
import { defineField, defineType } from "sanity"
import { richTextField } from "../shared/richText"

export const faqItem = defineType({
  name: "faqItem",
  title: "Question fréquente",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    richTextField("answer", "Réponse", { required: true }),
    defineField({
      name: "order",
      title: "Ordre d’affichage",
      type: "number",
      initialValue: 10,
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Ordre d’affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "question" },
  },
})

import { ComponentIcon } from "@sanity/icons/Component"
import { defineArrayMember, defineField, defineType } from "sanity"
import { linkField } from "../shared/link"
import { seoField } from "../shared/seo"

export const ateliersPage = defineType({
  name: "ateliersPage",
  title: "Ateliers",
  type: "document",
  icon: ComponentIcon,
  fields: [
    seoField(),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Nos ateliers",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Ligne « Pour qui »",
      type: "string",
      initialValue:
        "Pour les musées, les sites archéologiques, les structures culturelles et les collectivités.",
    }),
    defineField({
      name: "workshops",
      title: "Ateliers affichés",
      type: "array",
      description:
        "Facultatif, pour choisir l’ordre : faites glisser les ateliers. Tous les ateliers publiés s’affichent ; ceux qui ne sont pas dans cette liste viennent à la suite, selon leur « Ordre d’affichage ».",
      of: [defineArrayMember({ type: "reference", to: [{ type: "workshop" }] })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "cta",
      title: "Bloc de contact",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
        linkField("button", "Bouton"),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Ateliers", subtitle: "Page Ateliers" }
    },
  },
})

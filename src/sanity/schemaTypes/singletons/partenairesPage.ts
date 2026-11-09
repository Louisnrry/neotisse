import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe"
import { defineArrayMember, defineField, defineType } from "sanity"
import { linkField } from "../shared/link"
import { seoField } from "../shared/seo"

export const partenairesPage = defineType({
  name: "partenairesPage",
  title: "Partenaires",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    seoField(),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Nos partenaires",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "partners",
      title: "Partenaires affichés",
      type: "array",
      description: "L’ordre de cette liste détermine l’ordre des cartes sur la page.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "partner" }] })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "cta",
      title: "Bloc « Devenir partenaire »",
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
      return { title: title || "Partenaires", subtitle: "Page Partenaires" }
    },
  },
})

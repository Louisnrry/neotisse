import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe"
import { defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"

export const partner = defineType({
  name: "partner",
  title: "Partenaire",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    imageWithAltField("logo", "Logo", { required: true, hotspot: false }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Ce que Néotisse a animé chez ce partenaire. Facultatif.",
    }),
    defineField({
      name: "url",
      title: "Site web",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "order",
      title: "Ordre d’affichage",
      type: "number",
      description:
        "Les partenaires sont affichés du plus petit au plus grand numéro. Utilisez 10, 20, 30… pour pouvoir insérer un partenaire plus tard.",
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
    select: { title: "name", subtitle: "description", media: "logo" },
  },
})

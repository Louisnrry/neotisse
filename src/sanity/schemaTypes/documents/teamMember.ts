import { UsersIcon } from "@sanity/icons/Users"
import { defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"
import { richTextField } from "../shared/richText"
import { placeholderToneOptions } from "../shared/tones"

export const teamMember = defineType({
  name: "teamMember",
  title: "Membre de l’équipe",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Rôle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    richTextField("bio", "Biographie", { required: true }),
    imageWithAltField("photo", "Photo", { hotspot: true }),
    defineField({
      name: "photoTone",
      title: "Couleur du cadre provisoire",
      type: "string",
      options: { list: [...placeholderToneOptions], layout: "radio" },
      initialValue: "garance",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lien (facultatif)",
      type: "object",
      description: "Par exemple un profil LinkedIn.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "intro",
          title: "Phrase d’introduction",
          type: "string",
          placeholder: "Pour découvrir son parcours en détail,",
        }),
        defineField({
          name: "label",
          title: "Libellé du lien",
          type: "string",
          placeholder: "retrouvez Marie-Salomé sur LinkedIn →",
        }),
        defineField({
          name: "href",
          title: "URL",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),
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
    select: { title: "name", subtitle: "role", media: "photo" },
  },
})

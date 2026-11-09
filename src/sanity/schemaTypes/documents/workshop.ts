import { ComponentIcon } from "@sanity/icons/Component"
import { defineArrayMember, defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"
import { richTextField } from "../shared/richText"
import { placeholderToneOptions } from "../shared/tones"

export const workshop = defineType({
  name: "workshop",
  title: "Atelier",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "anchor",
      title: "Ancre",
      type: "string",
      description:
        "Identifiant de l’ancre sur la page Ateliers (ex. participatif). Minuscules, chiffres et tirets uniquement.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || /^[a-z0-9-]+$/.test(value)
              ? true
              : "Utilisez uniquement des minuscules, des chiffres et des tirets.",
          ),
    }),
    defineField({
      name: "kicker",
      title: "Surtitre",
      type: "string",
      description: "Petit texte au-dessus du titre (ex. Démonstration).",
    }),
    defineField({
      name: "subtitle",
      title: "Sous-titre",
      type: "string",
    }),
    defineField({
      name: "hook",
      title: "Accroche",
      type: "text",
      rows: 2,
      description: "Une phrase qui donne envie de lire l’atelier.",
    }),
    defineField({
      name: "facts",
      title: "Repères",
      type: "array",
      description: "Les informations pratiques affichées sous l’accroche (Format, Pour qui, Le plus…).",
      of: [
        defineArrayMember({
          type: "object",
          name: "fact",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Valeur",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
      validation: (rule) => rule.max(5),
    }),
    richTextField("paragraphs", "Texte", { required: true }),
    imageWithAltField("image", "Photo", { hotspot: true }),
    defineField({
      name: "tileColor",
      title: "Couleur de la tuile / du cadre provisoire",
      type: "string",
      options: { list: [...placeholderToneOptions], layout: "radio" },
      initialValue: "garance",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordre d’affichage",
      type: "number",
      description:
        "Les ateliers sont affichés du plus petit au plus grand numéro. Utilisez 10, 20, 30… pour pouvoir insérer un atelier plus tard.",
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
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
})

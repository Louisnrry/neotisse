import { LockIcon } from "@sanity/icons/Lock"
import { defineArrayMember, defineField, defineType } from "sanity"
import { richTextField } from "../shared/richText"
import { seoField } from "../shared/seo"

export const politiqueConfidentialitePage = defineType({
  name: "politiqueConfidentialitePage",
  title: "Politique de confidentialité",
  type: "document",
  icon: LockIcon,
  fields: [
    seoField({ noindex: true }),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Politique de confidentialité",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
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
                "Identifiant du lien du sommaire (ex. vos-droits). Facultatif : à défaut, il est tiré du titre. Minuscules, chiffres et tirets.",
              validation: (rule) =>
                rule.custom((value) =>
                  !value || /^[a-z0-9-]+$/.test(value) ? true : "Utilisez uniquement des minuscules, des chiffres et des tirets.",
                ),
            }),
            richTextField("body", "Contenu", { required: true }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "updatedAt",
      title: "Dernière mise à jour",
      type: "date",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Politique de confidentialité", subtitle: "Page légale (non indexée)" }
    },
  },
})

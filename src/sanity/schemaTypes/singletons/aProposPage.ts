import { UserIcon } from "@sanity/icons/User"
import { defineArrayMember, defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"
import { linkField } from "../shared/link"
import { seoField } from "../shared/seo"
import { engagementToneOptions } from "../shared/tones"

export const aProposPage = defineType({
  name: "aProposPage",
  title: "À propos",
  type: "document",
  icon: UserIcon,
  fields: [
    seoField(),
    defineField({
      name: "intro",
      title: "En-tête",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", initialValue: "À propos de Néotisse" }),
        defineField({ name: "subtitle", title: "Sous-titre", type: "string" }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 5 }),
      ],
    }),
    defineField({
      name: "demarche",
      title: "Notre démarche",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        imageWithAltField("image", "Photo"),
        defineField({ name: "before", title: "Texte avant la citation", type: "text", rows: 5 }),
        defineField({ name: "pull", title: "Phrase en exergue", type: "text", rows: 2 }),
        defineField({ name: "after", title: "Texte après la citation", type: "text", rows: 5 }),
        defineField({ name: "conviction", title: "Conviction (en gras)", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "engagements",
      title: "Nos engagements",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Cartes",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "engagement",
              fields: [
                defineField({
                  name: "tone",
                  title: "Couleur",
                  type: "string",
                  options: { list: [...engagementToneOptions], layout: "radio" },
                  initialValue: "garance",
                  validation: (rule) => rule.required(),
                }),
                defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "tagline", title: "Accroche", type: "string" }),
                defineField({ name: "text", title: "Texte", type: "text", rows: 5, validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "title", subtitle: "tagline" } },
            }),
          ],
          validation: (rule) => rule.min(1).max(3),
        }),
      ],
    }),
    defineField({
      name: "mediation",
      title: "Médiation par le geste",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 5 }),
        imageWithAltField("image", "Visuel 21/9"),
      ],
    }),
    defineField({
      name: "team",
      title: "Notre équipe",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", initialValue: "Notre équipe" }),
        defineField({
          name: "members",
          title: "Membres",
          description:
            "Facultatif, pour choisir l’ordre : faites glisser les membres. Tous les membres publiés s’affichent ; ceux qui ne sont pas dans cette liste viennent à la suite, selon leur « Ordre d’affichage ».",
          type: "array",
          of: [defineArrayMember({ type: "reference", to: [{ type: "teamMember" }] })],
          validation: (rule) => rule.min(1),
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Travaillons ensemble",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", initialValue: "Travaillons ensemble" }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
        linkField("button", "Bouton"),
      ],
    }),
  ],
  preview: {
    select: { title: "intro.title" },
    prepare({ title }) {
      return { title: title || "À propos", subtitle: "Page À propos" }
    },
  },
})

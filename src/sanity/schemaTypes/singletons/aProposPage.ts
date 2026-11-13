import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAltField } from "../shared/image";
import { linkField } from "../shared/link";
import { seoField } from "../shared/seo";
import { engagementToneOptions } from "../shared/tones";

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
        // Masqué (13/11/2026) : Louis a retiré ce texte de la page. Champ gardé pour ne pas perdre la valeur déjà saisie.
        defineField({ name: "subtitle", title: "Sous-titre", type: "string", hidden: true }),
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
        defineField({ name: "before", title: "Premier paragraphe", type: "text", rows: 5 }),
        // Masqué (13/11/2026) : Louis a retiré ce texte de la page. Champ gardé pour ne pas perdre la valeur déjà saisie.
        defineField({ name: "pull", title: "Phrase en exergue", type: "text", rows: 2, hidden: true }),
        defineField({ name: "after", title: "Second paragraphe (avant la conviction)", type: "text", rows: 5 }),
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
                // Masqué (13/11/2026) : Louis a retiré ce texte de la page. Champ gardé pour ne pas perdre la valeur déjà saisie.
                defineField({ name: "tagline", title: "Accroche", type: "string", hidden: true }),
                defineField({
                  name: "text",
                  title: "Texte",
                  type: "text",
                  rows: 5,
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: { select: { title: "title" } },
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
      return { title: title || "À propos", subtitle: "Page À propos" };
    },
  },
});

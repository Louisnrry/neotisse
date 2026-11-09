import { HomeIcon } from "@sanity/icons/Home"
import { defineArrayMember, defineField, defineType } from "sanity"
import { imageWithAltMember } from "../shared/image"
import { linkField } from "../shared/link"
import { seoField } from "../shared/seo"

export const homePage = defineType({
  name: "homePage",
  title: "Accueil",
  type: "document",
  icon: HomeIcon,
  fields: [
    seoField(),
    defineField({
      name: "hero",
      title: "Héro",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Titre",
          type: "string",
          initialValue: "Néotisse",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "tagline",
          title: "Accroche",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required(),
        }),
        linkField("cta", "Bouton"),
        defineField({
          name: "images",
          title: "Photos",
          type: "array",
          description: "Deux photos côte à côte sur grand écran, une seule sur mobile.",
          of: [imageWithAltMember()],
          validation: (rule) => rule.min(1).max(2),
        }),
      ],
    }),
    defineField({
      name: "partners",
      title: "Bandeau partenaires",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        linkField("cta", "Bouton"),
      ],
    }),
    defineField({
      name: "univers",
      title: "Découvrez l’univers Néotisse",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "kicker", title: "Surtitre", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "paragraphs",
          title: "Paragraphes",
          type: "array",
          of: [defineArrayMember({ type: "text" })],
          validation: (rule) => rule.min(1),
        }),
        linkField("cta", "Bouton"),
      ],
    }),
    defineField({
      name: "events",
      title: "Prochains événements",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "empty",
          title: "Message sans événement",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required(),
        }),
        linkField("cta", "Bouton"),
      ],
    }),
    defineField({
      name: "workshops",
      title: "Ateliers de médiation textile",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 4 }),
        defineField({
          name: "tiles",
          title: "Tuiles",
          type: "array",
          description: "Choisissez les ateliers affichés en tuiles. L’ordre des tuiles suit cet ordre.",
          of: [defineArrayMember({ type: "reference", to: [{ type: "workshop" }] })],
          validation: (rule) => rule.min(1).max(3),
        }),
        defineField({ name: "more", title: "Phrase sous les tuiles", type: "string" }),
        linkField("cta", "Bouton"),
      ],
    }),
    defineField({
      name: "reviews",
      title: "Avis",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "count",
          title: "Nombre d’avis affichés",
          type: "number",
          initialValue: 4,
          validation: (rule) => rule.min(1).max(8).integer(),
        }),
        linkField("cta", "Bouton"),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 4 }),
        linkField("cta", "Bouton"),
      ],
    }),
  ],
  preview: {
    select: { title: "hero.title" },
    prepare({ title }) {
      return { title: title || "Accueil", subtitle: "Page d’accueil" }
    },
  },
})

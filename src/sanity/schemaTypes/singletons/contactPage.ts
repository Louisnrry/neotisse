import { CommentIcon } from "@sanity/icons/Comment"
import { defineArrayMember, defineField, defineType } from "sanity"
import { imageWithAltField } from "../shared/image"
import { linkField } from "../shared/link"
import { seoField } from "../shared/seo"

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  icon: CommentIcon,
  fields: [
    seoField(),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Contact",
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
      name: "phone",
      title: "Téléphone",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "label", title: "Numéro affiché", type: "string", placeholder: "06 48 65 58 16" }),
        defineField({
          name: "href",
          title: "Lien téléphone",
          type: "string",
          description: "Ex. tel:+33648655816",
        }),
        defineField({ name: "person", title: "Personne", type: "string" }),
      ],
    }),
    defineField({
      name: "city",
      title: "Ville",
      type: "string",
      initialValue: "Montpellier",
    }),
    linkField("guestbookLink", "Lien vers le livre d’or"),
    defineField({
      name: "form",
      title: "Formulaire",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", initialValue: "Écrivez-nous" }),
        defineField({
          name: "subjectPlaceholder",
          title: "Placeholder « Objet »",
          type: "string",
          initialValue: "Organiser un atelier, conférence, partenariat…",
        }),
        defineField({
          name: "projectPlaceholder",
          title: "Placeholder « Votre projet »",
          type: "string",
          initialValue: "Parlez-nous de votre projet : lieu, public, dates envisagées…",
        }),
        defineField({ name: "submit", title: "Libellé du bouton", type: "string", initialValue: "Envoyer" }),
        defineField({ name: "sending", title: "Libellé pendant l’envoi", type: "string", initialValue: "Envoi en cours…" }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Titre",
          type: "string",
          initialValue: "Organiser un atelier : vos questions",
        }),
        imageWithAltField("image", "Photo"),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 4 }),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [defineArrayMember({ type: "reference", to: [{ type: "faqItem" }] })],
          validation: (rule) => rule.min(1),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Contact", subtitle: "Page Contact" }
    },
  },
})

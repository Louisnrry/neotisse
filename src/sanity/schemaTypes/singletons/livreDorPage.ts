import { StarIcon } from "@sanity/icons/Star"
import { defineField, defineType } from "sanity"
import { richTextField } from "../shared/richText"
import { seoField } from "../shared/seo"

export const livreDorPage = defineType({
  name: "livreDorPage",
  title: "Livre d’or",
  type: "document",
  icon: StarIcon,
  fields: [
    seoField(),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      initialValue: "Livre d’or",
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
      name: "reviews",
      title: "Liste des avis",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Titre", type: "string", initialValue: "Ils nous ont laissé un mot" }),
        defineField({
          name: "step",
          title: "Avis affichés à la fois",
          type: "number",
          initialValue: 5,
          validation: (rule) => rule.min(1).max(20).integer(),
        }),
        defineField({ name: "more", title: "Libellé du bouton", type: "string", initialValue: "Plus d’avis" }),
        defineField({
          name: "empty",
          title: "Message sans avis",
          type: "text",
          rows: 2,
          initialValue: "Aucun avis pour le moment. Soyez la première personne à laisser le vôtre !",
        }),
      ],
    }),
    defineField({
      name: "form",
      title: "Formulaire",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Titre de la section", type: "string", initialValue: "Signer le livre d’or" }),
        defineField({ name: "cardTitle", title: "Titre de la carte", type: "string", initialValue: "Laisser un avis" }),
        defineField({ name: "submit", title: "Libellé du bouton", type: "string", initialValue: "Envoyer" }),
        defineField({ name: "sending", title: "Libellé pendant l’envoi", type: "string", initialValue: "Envoi en cours…" }),
        defineField({
          name: "robot",
          title: "Case anti-robot",
          type: "string",
          initialValue: "Je confirme ne pas être un robot.",
        }),
        richTextField("legal", "Mention sous le formulaire"),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Livre d’or", subtitle: "Page Livre d’or" }
    },
  },
})

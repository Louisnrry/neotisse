import { StarIcon } from "@sanity/icons/Star"
import { defineField, defineType } from "sanity"

const statusOptions = [
  { title: "En attente de modération", value: "pending" },
  { title: "Approuvé (publié)", value: "approved" },
  { title: "Refusé", value: "rejected" },
] as const

const ratingOptions = [1, 2, 3, 4, 5].map((value) => ({
  title: `${value} étoile${value > 1 ? "s" : ""}`,
  value,
}))

export const review = defineType({
  name: "review",
  title: "Avis",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Adresse e-mail",
      type: "string",
      description:
        "Privé : jamais affiché sur le site. Sur le plan Free (dataset public), elle reste lisible via l’API : à traiter avant la mise en ligne.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "title",
      title: "Titre de l’avis",
      type: "string",
    }),
    defineField({
      name: "rating",
      title: "Note",
      type: "number",
      options: { list: ratingOptions, layout: "radio" },
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "text",
      title: "Avis",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: { list: [...statusOptions], layout: "radio" },
      initialValue: "pending",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Date de l’avis",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ip",
      title: "Adresse IP (privée)",
      type: "string",
      description:
        "Collectée côté serveur pour prévenir les abus. Jamais affichée sur le site. Sur le plan Free, le dataset est public : à traiter avant la mise en ligne.",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
    }),
  ],
  orderings: [
    {
      title: "Plus récents d’abord",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      title: "title",
      text: "text",
      rating: "rating",
      status: "status",
    },
    prepare({ name, title, text, rating, status }) {
      const statusLabel = statusOptions.find((option) => option.value === status)?.title
      return {
        title: title || text || "Avis sans titre",
        subtitle: [name, `${rating}/5`, statusLabel].filter(Boolean).join(" · "),
      }
    },
  },
})

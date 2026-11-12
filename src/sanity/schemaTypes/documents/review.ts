import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle"
import { ClockIcon } from "@sanity/icons/Clock"
import { CloseCircleIcon } from "@sanity/icons/CloseCircle"
import { StarIcon } from "@sanity/icons/Star"
import { defineField, defineType } from "sanity"

export const reviewStatusOptions = [
  { title: "À modérer", value: "pending" },
  { title: "Publié", value: "approved" },
  { title: "Refusé", value: "rejected" },
] as const

export type ReviewStatus = (typeof reviewStatusOptions)[number]["value"]

const ratingOptions = [1, 2, 3, 4, 5].map((value) => ({
  title: `${value} étoile${value > 1 ? "s" : ""}`,
  value,
}))

const statusIcons = { pending: ClockIcon, approved: CheckmarkCircleIcon, rejected: CloseCircleIcon }

/** « ★★★★☆ » */
const stars = (rating?: number) => (rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "")

/** « 12/11/2026 » */
const shortDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }) : ""

/**
 * Avis du livre d’or. Ne contient que ce qui peut être publié : l’adresse e-mail et l’IP
 * sont dans un document privé à part (voir `reviewPrivate`).
 */
export const review = defineType({
  name: "review",
  title: "Avis",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      description: "Utilisez plutôt les boutons « Approuver » et « Refuser » en bas de la fiche : ils publient en un clic.",
      options: { list: [...reviewStatusOptions], layout: "radio", direction: "horizontal" },
      initialValue: "pending",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
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
      options: { list: ratingOptions, layout: "radio", direction: "horizontal" },
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
      name: "createdAt",
      title: "Date de l’avis",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
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
      createdAt: "createdAt",
    },
    prepare({ name, title, text, rating, status, createdAt }) {
      return {
        title: title || text || "Avis sans titre",
        subtitle: [stars(rating), name, shortDate(createdAt)].filter(Boolean).join(" · "),
        media: statusIcons[status as ReviewStatus] ?? StarIcon,
      }
    },
  },
})

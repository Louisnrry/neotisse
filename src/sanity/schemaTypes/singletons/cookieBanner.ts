import { LockIcon } from "@sanity/icons/Lock"
import { defineField, defineType } from "sanity"

const text = (name: string, title: string, rows = 3) =>
  defineField({ name, title, type: "text", rows, validation: (rule) => rule.required() })
const label = (name: string, title: string) =>
  defineField({ name, title, type: "string", validation: (rule) => rule.required() })

/** Textes du bandeau « Cookies & confidentialité ». */
export const cookieBanner = defineType({
  name: "cookieBanner",
  title: "Bandeau cookies",
  type: "document",
  icon: LockIcon,
  fields: [
    label("title", "Titre"),
    text("message", "Message"),
    label("accept", "Bouton « Accepter »"),
    label("deny", "Bouton « Refuser »"),
    label("customize", "Lien « Personnaliser »"),
    label("save", "Bouton « Enregistrer mes choix »"),
    label("alwaysActive", "Mention « Toujours activé »"),
    defineField({
      name: "functional",
      title: "Catégorie « Fonctionnel »",
      type: "object",
      fields: [label("title", "Titre"), text("description", "Description", 4)],
    }),
    defineField({
      name: "statistics",
      title: "Catégorie « Statistiques »",
      type: "object",
      fields: [label("title", "Titre"), text("description", "Description", 3)],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Bandeau cookies", subtitle: "Textes du bandeau de consentement" }
    },
  },
})

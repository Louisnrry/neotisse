import { defineField, type FieldDefinition } from "sanity"

type SeoOptions = {
  /** Valeur par défaut du drapeau « ne pas indexer ». */
  noindex?: boolean
}

/** Bloc SEO commun à toutes les pages. */
export function seoField(options: SeoOptions = {}): FieldDefinition {
  return defineField({
    name: "seo",
    title: "SEO",
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({
        name: "title",
        title: "Titre SEO",
        type: "string",
        description: "Titre affiché dans Google et lors des partages. 60 caractères maximum conseillés.",
        validation: (rule) => rule.max(70).warning("Au-delà de 70 caractères, le titre peut être tronqué."),
      }),
      defineField({
        name: "description",
        title: "Description SEO",
        type: "text",
        rows: 3,
        description: "Description affichée dans Google. 155 caractères maximum conseillés.",
        validation: (rule) => rule.max(160).warning("Au-delà de 160 caractères, la description peut être tronquée."),
      }),
      defineField({
        name: "focusKeyword",
        title: "Mot-clé principal",
        type: "string",
        description: "Mot-clé sur lequel la page doit être positionnée.",
      }),
      defineField({
        name: "noindex",
        title: "Ne pas indexer cette page",
        type: "boolean",
        description: "Cochez pour empêcher Google d’indexer la page.",
        initialValue: options.noindex ?? false,
      }),
    ],
  })
}

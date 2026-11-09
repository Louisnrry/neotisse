import { defineField, type FieldDefinition } from "sanity"

/** Lien ou bouton : libellé + destination, interne ou externe. */
export function linkField(name = "link", title = "Lien"): FieldDefinition {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Libellé",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "href",
        title: "Destination",
        type: "string",
        description: "Lien interne (/ateliers-tissage-teinture/) ou externe (https://…).",
        validation: (rule) =>
          rule.required().custom((value) => {
            if (!value) return true
            return (
              /^(\/|https?:\/\/|mailto:|tel:)/.test(value) ||
              "Utilisez une URL interne (/…) ou externe (https://…)."
            )
          }),
      }),
      defineField({
        name: "external",
        title: "Ouvrir dans un nouvel onglet",
        type: "boolean",
        initialValue: false,
      }),
    ],
  })
}

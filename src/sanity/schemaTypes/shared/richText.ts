import { defineArrayMember, defineField, type FieldDefinition } from "sanity"

/** Bloc de texte enrichi : titres, listes, gras, italique et liens. */
export function richTextMember() {
  return defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Titre 2", value: "h2" },
      { title: "Titre 3", value: "h3" },
      { title: "Citation", value: "blockquote" },
    ],
    lists: [
      { title: "Puces", value: "bullet" },
      { title: "Numérotée", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Gras", value: "strong" },
        { title: "Italique", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          title: "Lien",
          type: "object",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
            }),
            defineField({
              name: "external",
              title: "Ouvrir dans un nouvel onglet",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
    },
  })
}

/** Champ de texte enrichi. */
export function richTextField(
  name: string,
  title: string,
  options: { required?: boolean } = {},
): FieldDefinition {
  return defineField({
    name,
    title,
    type: "array",
    of: [richTextMember()],
    validation: options.required ? (rule) => rule.required() : undefined,
  })
}

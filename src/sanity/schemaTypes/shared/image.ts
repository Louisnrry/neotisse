import { defineArrayMember, defineField, type FieldDefinition } from "sanity"

/** Texte alternatif obligatoire pour toutes les images. */
export function altField(): FieldDefinition {
  return defineField({
    name: "alt",
    title: "Texte alternatif",
    type: "string",
    description: "Décrivez l’image pour les lecteurs d’écran et le référencement.",
    validation: (rule) => rule.required().error("Le texte alternatif est obligatoire."),
  })
}

type ImageOptions = {
  required?: boolean
  hotspot?: boolean
}

/** Champ image simple, avec son texte alternatif. */
export function imageWithAltField(
  name = "image",
  title = "Image",
  options: ImageOptions = {},
): FieldDefinition {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: options.hotspot ?? true },
    fields: [altField()],
    validation: options.required ? (rule) => rule.required() : undefined,
  })
}

/** Image dans un tableau (ex. les deux photos du héro). */
export function imageWithAltMember() {
  return defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [altField()],
  })
}

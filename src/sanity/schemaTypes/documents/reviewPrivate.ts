import { LockIcon } from "@sanity/icons/Lock"
import { defineField, defineType } from "sanity"

/**
 * Données privées d’un avis : adresse e-mail et adresse IP.
 *
 * Rangées à part, dans un document dont l’identifiant est `private.<identifiant de l’avis>`.
 * Sanity ne rend jamais publics les documents dont l’identifiant contient un point :
 * ils ne sont lisibles qu’avec un token ou une session du Studio, même sur un dataset public.
 * L’avis lui-même (nom, titre, note, texte) ne contient donc aucune donnée privée.
 *
 * Ces documents n’apparaissent pas dans le menu du Studio : ils s’affichent dans l’onglet
 * « Coordonnées privées » de chaque avis.
 */
export const reviewPrivate = defineType({
  name: "reviewPrivate",
  title: "Coordonnées privées d’un avis",
  type: "document",
  icon: LockIcon,
  readOnly: true,
  fields: [
    defineField({ name: "reviewId", title: "Identifiant de l’avis", type: "string" }),
    defineField({ name: "email", title: "Adresse e-mail", type: "string" }),
    defineField({ name: "ip", title: "Adresse IP", type: "string" }),
    defineField({ name: "createdAt", title: "Date d’envoi", type: "datetime" }),
  ],
  preview: {
    select: { title: "email", subtitle: "reviewId" },
  },
})

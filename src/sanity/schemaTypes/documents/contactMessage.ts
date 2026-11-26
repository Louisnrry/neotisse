import { EnvelopeIcon } from "@sanity/icons/Envelope"
import { defineField, defineType } from "sanity"

/**
 * Message envoyé par le formulaire « Écrivez-nous » de la page Contact.
 *
 * Créé uniquement par le site (`POST /api/contact/`), **en lecture seule** dans le Studio :
 * on peut le lire et y répondre par e-mail, pas le modifier (demande de Louis du 26/11/2026).
 *
 * Données personnelles : l’identifiant est `contact.<uuid>`. Sanity ne rend jamais publics les
 * documents dont l’identifiant contient un point : ils ne sont lisibles qu’avec un token ou
 * une session du Studio, même sur un dataset public.
 */
export const contactMessage = defineType({
  name: "contactMessage",
  title: "Message de contact",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: "subject", title: "Objet", type: "string" }),
    defineField({ name: "lastName", title: "Nom", type: "string" }),
    defineField({ name: "firstName", title: "Prénom", type: "string" }),
    defineField({ name: "email", title: "Adresse e-mail", type: "string" }),
    defineField({ name: "message", title: "Votre projet", type: "text", rows: 10 }),
    defineField({ name: "createdAt", title: "Envoyé le", type: "datetime" }),
    // Sert seulement à limiter les envois répétés (5 par heure et par adresse) : masquée dans le Studio.
    defineField({ name: "ip", title: "Adresse IP", type: "string", hidden: true }),
  ],
  orderings: [
    { title: "Les plus récents", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { subject: "subject", firstName: "firstName", lastName: "lastName", createdAt: "createdAt" },
    prepare: ({ subject, firstName, lastName, createdAt }) => ({
      title: subject || "(sans objet)",
      subtitle: [
        [firstName, lastName].filter(Boolean).join(" "),
        createdAt &&
          new Date(createdAt).toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            dateStyle: "short",
            timeStyle: "short",
          }),
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
})

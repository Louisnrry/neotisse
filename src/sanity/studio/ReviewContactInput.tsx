/**
 * Encart « Adresse e-mail » affiché en haut de la fiche d’un avis (demande de Louis du 26/11/2026 :
 * l’e-mail n’était visible que dans l’onglet « Coordonnées privées », qu’on ne voyait pas).
 *
 * Ce n’est qu’un affichage : le champ `contact` du schéma n’enregistre rien dans l’avis
 * (qui reste public). L’e-mail est lu dans le document privé `private.<identifiant de l’avis>`.
 */
import { Card, Flex, Spinner, Text } from "@sanity/ui"
import { useFormValue } from "sanity"

import { useReviewPrivate } from "./ReviewPrivateView"

export function ReviewContactInput() {
  const id = useFormValue(["_id"]) as string | undefined
  const data = useReviewPrivate(id)

  if (data === undefined) {
    return (
      <Flex padding={3}>
        <Spinner muted />
      </Flex>
    )
  }

  if (!data?.email) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text muted size={1}>
          Pas d’adresse e-mail : l’avis a été refusé (ses coordonnées sont alors supprimées) ou saisi directement dans
          le Studio.
        </Text>
      </Card>
    )
  }

  return (
    <Card padding={3} radius={2} border tone="primary">
      <Text size={2}>
        <a href={`mailto:${data.email}`}>{data.email}</a>
      </Text>
    </Card>
  )
}

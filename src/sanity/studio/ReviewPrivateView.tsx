/**
 * Onglet « Coordonnées privées » d’un avis : adresse e-mail et adresse IP,
 * lues dans le document privé `private.<identifiant de l’avis>` (jamais public).
 */
import { Card, Flex, Spinner, Stack, Text } from "@sanity/ui"
import { useEffect, useState } from "react"
import { useClient } from "sanity"
import type { UserViewComponent } from "sanity/structure"

import { apiVersion } from "../env"
import { reviewPrivateId } from "../lib/reviewPrivate"

type PrivateData = { email?: string; ip?: string; createdAt?: string } | null

const QUERY = `*[_id == $id][0]{ email, ip, createdAt }`

export const ReviewPrivateView: UserViewComponent = ({ documentId }) => {
  const client = useClient({ apiVersion })
  const [data, setData] = useState<PrivateData | undefined>(undefined)

  useEffect(() => {
    const id = reviewPrivateId(documentId)
    let alive = true
    client.fetch<PrivateData>(QUERY, { id }).then((d) => alive && setData(d), () => alive && setData(null))
    const sub = client.listen(QUERY, { id }).subscribe(() => {
      client.fetch<PrivateData>(QUERY, { id }).then((d) => alive && setData(d))
    })
    return () => {
      alive = false
      sub.unsubscribe()
    }
  }, [client, documentId])

  if (data === undefined) {
    return (
      <Flex justify="center" padding={5}>
        <Spinner muted />
      </Flex>
    )
  }

  return (
    <Stack space={4} padding={4}>
      <Card padding={4} radius={2} tone="caution" border>
        <Text size={1}>
          Ces informations ne sont jamais affichées sur le site ni lisibles publiquement. Elles servent à
          répondre à l’auteur de l’avis ou à repérer les abus. Refuser l’avis les supprime.
        </Text>
      </Card>
      {data ? (
        <Card padding={4} radius={2} border>
          <Stack space={4}>
            <Row label="Adresse e-mail">
              {data.email ? <a href={`mailto:${data.email}`}>{data.email}</a> : "—"}
            </Row>
            <Row label="Adresse IP">{data.ip || "—"}</Row>
            <Row label="Envoyé le">
              {data.createdAt
                ? new Date(data.createdAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
                : "—"}
            </Row>
          </Stack>
        </Card>
      ) : (
        <Card padding={4} radius={2} border>
          <Text muted size={1}>
            Aucune coordonnée pour cet avis : il a été refusé, ou saisi directement dans le Studio.
          </Text>
        </Card>
      )}
    </Stack>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack space={2}>
      <Text size={1} weight="semibold" muted>
        {label}
      </Text>
      <Text size={2}>{children}</Text>
    </Stack>
  )
}

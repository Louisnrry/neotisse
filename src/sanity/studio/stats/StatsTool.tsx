/**
 * Outil « Statistiques » du Studio : lit les chiffres de GA4 par `/api/statistiques/` (réservée aux membres
 * du projet) et les avis directement dans Sanity.
 */
import { Box, Button, Card, Container, Flex, Heading, Spinner, Stack, Text } from "@sanity/ui"
import { useEffect, useState } from "react"
import { useClient } from "sanity"

import { STATS_PERIODS, type Stats, type StatsErrorCode, type StatsPeriod } from "../../../lib/stats"
import { apiVersion } from "../../env"
import { StatsDashboard, type ReviewStats } from "./StatsDashboard"

type State = { stats: Stats | null; reviews: ReviewStats | null; error: StatsErrorCode | null; loading: boolean }

const REVIEWS = `{
  "count": count(*[_type == "review" && status == "approved" && !(_id in path("drafts.**")) && createdAt >= $since]),
  "average": math::avg(*[_type == "review" && status == "approved" && !(_id in path("drafts.**")) && createdAt >= $since].rating)
}`

const MESSAGES: Record<StatsErrorCode, string> = {
  "not-configured": "La lecture de Google Analytics n’est pas encore configurée sur l’hébergeur (variables GA4_…).",
  unauthorized: "Votre connexion au Studio n’a pas pu être vérifiée. Déconnectez-vous, reconnectez-vous, puis réessayez.",
  forbidden: "Votre compte n’a pas accès aux statistiques de Néotisse.",
  "bad-request": "La période demandée n’est pas valable.",
  unavailable: "Google Analytics ne répond pas pour le moment. Aucun chiffre n’est affiché : ce n’est pas un zéro.",
}

async function fetchStats(days: StatsPeriod, token: string | undefined, signal: AbortSignal): Promise<Stats> {
  const response = await fetch(`/api/statistiques/?jours=${days}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal,
  })
  if (response.ok) return (await response.json()) as Stats
  const body = (await response.json().catch(() => ({}))) as { code?: StatsErrorCode }
  throw body.code && body.code in MESSAGES ? body.code : "unavailable"
}

export function StatsTool() {
  const client = useClient({ apiVersion })
  const [days, setDays] = useState<StatsPeriod>(30)
  const [reload, setReload] = useState(0)
  const [state, setState] = useState<State>({ stats: null, reviews: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    Promise.all([
      fetchStats(days, client.config().token, controller.signal).then(
        (stats) => ({ stats, error: null }),
        (error: unknown) => ({
          stats: null,
          error: typeof error === "string" ? (error as StatsErrorCode) : ("unavailable" as const),
        }),
      ),
      client.fetch<ReviewStats>(REVIEWS, { since }).catch(() => null),
    ]).then(([result, reviews]) => {
      if (!controller.signal.aborted) setState({ ...result, reviews, loading: false })
    })
    return () => controller.abort()
  }, [client, days, reload])

  const refresh = (next: StatsPeriod) => {
    setState((s) => ({ ...s, loading: true }))
    setDays(next)
    setReload((n) => n + 1)
  }

  const { stats, reviews, error, loading } = state
  return (
    <Box style={{ height: "100%", overflowY: "auto" }}>
      <Container width={3} padding={4} paddingY={5}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading as="h1" size={3}>
              Statistiques
            </Heading>
            <Text muted size={1}>
              Visiteurs qui ont accepté les statistiques. Les autres ne sont pas comptés.
            </Text>
          </Stack>

          <Flex gap={2} wrap="wrap" align="center">
            {STATS_PERIODS.map((period) => (
              <Button
                key={period}
                mode={period === days ? "default" : "ghost"}
                aria-pressed={period === days}
                onClick={() => refresh(period)}
                text={`${period} jours`}
                fontSize={1}
                padding={3}
              />
            ))}
            <Button mode="bleed" onClick={() => refresh(days)} text="Actualiser" fontSize={1} padding={3} disabled={loading} />
            {loading && <Spinner muted />}
          </Flex>

          {error && !loading && (
            <Card padding={4} radius={2} border tone={error === "not-configured" ? "caution" : "critical"} role="alert">
              <Text size={1}>{MESSAGES[error]}</Text>
            </Card>
          )}

          {stats && (
            <Box style={{ opacity: loading ? 0.5 : 1, transition: "opacity 150ms" }}>
              <StatsDashboard stats={stats} reviews={reviews} />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

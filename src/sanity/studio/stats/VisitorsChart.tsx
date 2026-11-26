/**
 * Premier bloc du tableau de bord : les visiteurs du site, avec un graphique interactif en colonnes
 * (une par jour sur 30 jours, une par semaine au-delà).
 * - Au survol, au toucher ou aux flèches du clavier, la colonne s’éclaire et ses chiffres s’écrivent au-dessus du graphique.
 * - Trois mesures au choix (visiteurs, visites, pages consultées), comparaison possible avec la période précédente.
 * - « Voir les chiffres » remplace le graphique par un tableau.
 */
import { Box, Button, Card, Flex, Grid, Stack, Text } from "@sanity/ui"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { useColorSchemeValue } from "sanity"

import type { Bucket, Pair, Stats } from "../../../lib/stats"

const nf = new Intl.NumberFormat("fr-FR")
const dayLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" })
/** « Mercredi 18 novembre » */
const longDay = (iso: string) => {
  const text = new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
  return text[0].toUpperCase() + text.slice(1)
}

type Metric = "users" | "sessions" | "views"

const METRICS: Record<Metric, { tab: string; one: string; many: string; help: string }> = {
  users: {
    tab: "Visiteurs",
    one: "visiteur",
    many: "visiteurs",
    help: "Personnes différentes venues sur le site. Une personne qui revient plusieurs fois ne compte qu’une fois par colonne.",
  },
  sessions: {
    tab: "Visites",
    one: "visite",
    many: "visites",
    help: "Chaque passage sur le site. Une personne qui revient le soir fait deux visites.",
  },
  views: {
    tab: "Pages consultées",
    one: "page consultée",
    many: "pages consultées",
    help: "Nombre de pages ouvertes, toutes visites confondues.",
  },
}

const word = (metric: Metric, n: number) => (n > 1 ? METRICS[metric].many : METRICS[metric].one)

/** « ↑ 12 de plus que les 30 jours précédents (40) » */
function versus({ current, previous }: Pair, days: number) {
  const diff = current - previous
  if (diff === 0) return `Autant que les ${days} jours précédents (${nf.format(previous)})`
  return `${diff > 0 ? "↑" : "↓"} ${nf.format(Math.abs(diff))} de ${diff > 0 ? "plus" : "moins"} que les ${days} jours précédents (${nf.format(previous)})`
}

/** Graduation haute arrondie, avec une graduation du milieu entière. */
function niceMax(value: number) {
  if (value <= 4) return 4
  const power = 10 ** Math.floor(Math.log10(value))
  return [1, 2, 4, 6, 8, 10].map((n) => n * power).find((n) => n >= value) ?? value
}

/** Largeur de l’élément, suivie quand la fenêtre change. */
function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

export function VisitorsChart({ stats }: { stats: Stats }) {
  const dark = useColorSchemeValue() === "dark"
  // Garance de la charte (éclaircie sur fond sombre) ; période précédente en gris, contraste ≥ 3:1.
  const colors = dark ? { current: "#E05A45", previous: "#9AA3AB" } : { current: "#C8361F", previous: "#7A848C" }
  const [metric, setMetric] = useState<Metric>("users")
  const [compare, setCompare] = useState(false)
  const [asTable, setAsTable] = useState(false)
  const { totals, buckets, previousBuckets, days, bucket } = stats

  return (
    <Card
      padding={[4, 4, 5]}
      radius={3}
      border
      shadow={1}
      style={{ borderTop: `4px solid ${colors.current}` }}
    >
      <Stack space={5}>
        <Text as="h2" size={2} weight="semibold">
          Combien de personnes viennent sur le site ?
        </Text>

        <Grid columns={[1, 1, 2]} gap={5}>
          <Stack space={3}>
            <Text size={1} muted>
              Visiteurs sur les {days} derniers jours
            </Text>
            <Text size={4} weight="semibold" style={{ fontSize: 56, lineHeight: 1 }}>
              {nf.format(totals.users.current)}
            </Text>
            <Text size={1} muted>
              {versus(totals.users, days)}
            </Text>
          </Stack>
          <Grid columns={3} gap={3}>
            <Small label="dont nouveaux" value={totals.newUsers.current} />
            <Small label={word("sessions", totals.sessions.current)} value={totals.sessions.current} />
            <Small label={word("views", totals.views.current)} value={totals.views.current} />
          </Grid>
        </Grid>

        <Flex gap={2} wrap="wrap" align="center" justify="space-between">
          <Flex gap={1} wrap="wrap" role="group" aria-label="Chiffre affiché">
            {(Object.keys(METRICS) as Metric[]).map((m) => (
              <Button
                key={m}
                text={METRICS[m].tab}
                mode={metric === m ? "default" : "bleed"}
                aria-pressed={metric === m}
                onClick={() => setMetric(m)}
                fontSize={1}
                padding={3}
              />
            ))}
          </Flex>
          <Flex gap={1} wrap="wrap">
            <Button
              text={compare ? "✓ Comparé aux jours précédents" : "Comparer aux jours précédents"}
              mode={compare ? "ghost" : "bleed"}
              aria-pressed={compare}
              onClick={() => setCompare((v) => !v)}
              fontSize={1}
              padding={3}
            />
            <Button
              text={asTable ? "Voir le graphique" : "Voir les chiffres"}
              mode="bleed"
              onClick={() => setAsTable((v) => !v)}
              fontSize={1}
              padding={3}
            />
          </Flex>
        </Flex>

        <Text size={1} muted>
          {METRICS[metric].help}
        </Text>

        {asTable ? (
          <BucketTable metric={metric} buckets={buckets} previous={compare ? previousBuckets : null} weekly={bucket === "week"} />
        ) : (
          <ColumnChart
            metric={metric}
            buckets={buckets}
            previous={compare ? previousBuckets : null}
            weekly={bucket === "week"}
            colors={colors}
          />
        )}
      </Stack>
    </Card>
  )
}

function Small({ label, value }: { label: string; value: number }) {
  return (
    <Stack space={2}>
      <Text size={3} weight="semibold">
        {nf.format(value)}
      </Text>
      <Text size={1} muted>
        {label}
      </Text>
    </Stack>
  )
}

/** « 25 nov. » pour un jour, « 17 au 23 nov. » pour une semaine. */
function bucketLabel(b: Bucket, weekly: boolean) {
  if (!weekly || b.start === b.end) return weekly ? dayLabel(b.start) : longDay(b.start)
  const [d1, m1] = [Number(b.start.slice(8)), b.start.slice(5, 7)]
  return m1 === b.end.slice(5, 7) ? `Du ${d1} au ${dayLabel(b.end)}` : `Du ${dayLabel(b.start)} au ${dayLabel(b.end)}`
}

const HEIGHT = 220
const PAD = { top: 16, right: 8, bottom: 28, left: 36 }

function ColumnChart({
  metric,
  buckets,
  previous,
  weekly,
  colors,
}: {
  metric: Metric
  buckets: Bucket[]
  previous: Bucket[] | null
  weekly: boolean
  colors: { current: string; previous: string }
}) {
  const [ref, width] = useWidth()
  const [active, setActive] = useState<number | null>(null)
  const values = buckets.map((b) => b[metric])
  const before = previous ? buckets.map((_, i) => previous[i]?.[metric] ?? 0) : null
  const max = niceMax(Math.max(1, ...values, ...(before ?? [])))
  const innerW = Math.max(0, width - PAD.left - PAD.right)
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const slot = buckets.length ? innerW / buckets.length : 0
  // Colonnes de 24 px au plus ; deux colonnes côte à côte quand on compare.
  const barW = Math.max(2, Math.min(24, slot * (before ? 0.38 : 0.7)))
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH
  const ticks = [0, max / 2, max]
  const maxIndex = values.indexOf(Math.max(...values))
  // Trois dates sous l’axe : début, milieu, fin.
  const labels = [...new Set([0, Math.floor((buckets.length - 1) / 2), buckets.length - 1])]

  /** Colonne arrondie en haut (4 px), droite à la base. */
  const bar = (x: number, v: number) => {
    if (!v) return ""
    const top = y(v)
    const h = y(0) - top
    const r = Math.min(4, barW / 2, h)
    return `M${x},${y(0)}V${top + r}Q${x},${top} ${x + r},${top}H${x + barW - r}Q${x + barW},${top} ${x + barW},${top + r}V${y(0)}Z`
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = buckets.length - 1
    const moves: Record<string, (a: number | null) => number> = {
      ArrowRight: (a) => Math.min(last, (a ?? -1) + 1),
      ArrowLeft: (a) => Math.max(0, (a ?? last + 1) - 1),
      Home: () => 0,
      End: () => last,
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      setActive(move)
    } else if (event.key === "Escape") setActive(null)
  }

  const shown = active ?? maxIndex
  const cur = buckets[shown]
  const prev = previous?.[shown]
  const readout = cur
    ? `${bucketLabel(cur, weekly)} : ${nf.format(cur[metric])} ${word(metric, cur[metric])}`
    : ""

  return (
    <Stack space={3}>
      {/* Lecture de la colonne survolée (ou de la plus haute) : au-dessus du graphique, jamais sur les colonnes. */}
      <Box style={{ minHeight: 44 }} aria-live="polite">
        <Stack space={2}>
          <Text size={2} weight="semibold">
            {readout}
            {cur?.partial && (
              <span style={{ fontWeight: 400, color: "var(--card-muted-fg-color)" }}>
                {" "}
                · {weekly ? "semaine incomplète" : "journée en cours, encore incomplète"}
              </span>
            )}
          </Text>
          {prev && (
            <Text size={1} muted>
              Période d’avant ({bucketLabel(prev, weekly).replace(/^./, (c) => c.toLowerCase())}) : {nf.format(prev[metric])}{" "}
              {word(metric, prev[metric])}
            </Text>
          )}
          {active === null && !prev && cur && cur[metric] > 0 && (
            <Text size={1} muted>
              {weekly ? "La semaine" : "Le jour"} le plus fort. Survolez une colonne pour lire les autres.
            </Text>
          )}
        </Stack>
      </Box>

      {previous && (
        <Flex gap={4} wrap="wrap" aria-hidden="true">
          <Key color={colors.current} label={weekly ? `Les ${buckets.length} dernières semaines` : `Les ${buckets.length} derniers jours`} />
          <Key color={colors.previous} label="La période d’avant" />
        </Flex>
      )}

      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={`Graphique : ${METRICS[metric].many} par ${weekly ? "semaine" : "jour"}. Flèches gauche et droite pour lire chaque colonne.`}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((a) => a ?? buckets.length - 1)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        style={{ position: "relative", outlineOffset: 4, borderRadius: 4 }}
      >
        {width > 0 && (
          <svg width={width} height={HEIGHT} style={{ display: "block" }} aria-hidden="true">
            <defs>
              <pattern id="en-cours" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill={colors.current} opacity={0.35} />
                <line x1="0" y1="0" x2="0" y2="6" stroke={colors.current} strokeWidth="3" />
              </pattern>
            </defs>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--card-border-color)" />
                <text
                  x={PAD.left - 8}
                  y={y(t)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--card-muted-fg-color)"
                >
                  {nf.format(t)}
                </text>
              </g>
            ))}
            {labels.map((i, n) => (
              <text
                key={i}
                x={PAD.left + slot * (i + 0.5)}
                y={HEIGHT - 8}
                textAnchor={labels.length > 1 && n === 0 ? "start" : labels.length > 1 && n === labels.length - 1 ? "end" : "middle"}
                fontSize={11}
                fill="var(--card-muted-fg-color)"
              >
                {dayLabel(buckets[i].start)}
              </text>
            ))}
            {buckets.map((b, i) => {
              const center = PAD.left + slot * (i + 0.5)
              const xCur = before ? center - barW - 1 : center - barW / 2
              return (
                <g key={b.start} onPointerEnter={() => setActive(i)} onPointerDown={() => setActive(i)}>
                  {/* Zone de survol : toute la largeur de la colonne, plus facile à viser. */}
                  <rect
                    x={PAD.left + slot * i}
                    y={PAD.top}
                    width={slot}
                    height={innerH}
                    fill={active === i ? "var(--card-border-color)" : "transparent"}
                    opacity={0.5}
                  />
                  {before && <path d={bar(center + 1, before[i])} fill={colors.previous} />}
                  <path d={bar(xCur, values[i])} fill={b.partial ? "url(#en-cours)" : colors.current} />
                </g>
              )
            })}
            {/* Valeur écrite au-dessus de la colonne la plus haute seulement. */}
            {values[maxIndex] > 0 && (
              <text
                x={PAD.left + slot * (maxIndex + 0.5) - (before ? barW / 2 + 1 : 0)}
                y={y(values[maxIndex]) - 6}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="var(--card-fg-color)"
              >
                {nf.format(values[maxIndex])}
              </text>
            )}
          </svg>
        )}
      </div>
      {buckets.some((b) => b.partial) && (
        <Flex align="center" gap={2}>
          <svg width="14" height="10" aria-hidden="true">
            <rect width="14" height="10" rx="2" fill="url(#en-cours)" />
          </svg>
          <Text size={0} muted>
            Colonne hachurée : {weekly ? "semaine pas finie ou coupée par le début de la période" : "aujourd’hui, encore incomplet"}.
            Google met jusqu’à deux jours à tout compter.
          </Text>
        </Flex>
      )}
    </Stack>
  )
}

function Key({ color, label }: { color: string; label: string }) {
  return (
    <Flex align="center" gap={2}>
      <span style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
      <Text size={1} muted>
        {label}
      </Text>
    </Flex>
  )
}

function BucketTable({
  metric,
  buckets,
  previous,
  weekly,
}: {
  metric: Metric
  buckets: Bucket[]
  previous: Bucket[] | null
  weekly: boolean
}) {
  const cell = (right: boolean) =>
    ({
      padding: "8px 0 8px 12px",
      paddingLeft: right ? 12 : 0,
      textAlign: right ? "right" : "left",
      fontVariantNumeric: right ? "tabular-nums" : undefined,
      borderBottom: "1px solid var(--card-border-color)",
      fontWeight: "inherit",
    }) as const
  return (
    <Box style={{ maxHeight: 320, overflowY: "auto" }}>
      <Text as="div" size={1}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ color: "var(--card-muted-fg-color)" }}>
            <tr>
              <th scope="col" style={cell(false)}>
                {weekly ? "Semaine" : "Jour"}
              </th>
              <th scope="col" style={cell(true)}>
                {METRICS[metric].tab}
              </th>
              {previous && (
                <th scope="col" style={cell(true)}>
                  Période d’avant
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {buckets.map((b, i) => (
              <tr key={b.start}>
                <td style={cell(false)}>
                  {bucketLabel(b, weekly)}
                  {b.partial ? " (incomplet)" : ""}
                </td>
                <td style={cell(true)}>{nf.format(b[metric])}</td>
                {previous && <td style={cell(true)}>{previous[i] ? nf.format(previous[i][metric]) : "—"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </Text>
    </Box>
  )
}

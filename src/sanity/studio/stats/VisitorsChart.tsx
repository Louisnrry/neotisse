/**
 * Premier bloc du tableau de bord : les visiteurs du site, avec un graphique interactif.
 * - Au survol (ou aux flèches du clavier), une ligne verticale suit le jour le plus proche et une bulle donne ses chiffres.
 * - Trois mesures au choix (visiteurs, visites, pages consultées), comparaison possible avec la période précédente.
 * - « Voir les chiffres » remplace le graphique par un tableau.
 */
import { Box, Button, Card, Flex, Grid, Stack, Text } from "@sanity/ui"
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { useColorSchemeValue } from "sanity"

import type { DayStats, Pair, Stats } from "../../../lib/stats"

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
    help: "Personnes différentes venues sur le site. Une personne qui revient plusieurs fois compte une fois par jour.",
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
  const { totals, daily, previousDaily, days } = stats

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
          <DayTable metric={metric} daily={daily} previousDaily={compare ? previousDaily : null} />
        ) : (
          <LineChart
            metric={metric}
            daily={daily}
            previousDaily={compare ? previousDaily : null}
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

const HEIGHT = 240
const PAD = { top: 12, right: 12, bottom: 28, left: 36 }

function LineChart({
  metric,
  daily,
  previousDaily,
  colors,
}: {
  metric: Metric
  daily: DayStats[]
  previousDaily: DayStats[] | null
  colors: { current: string; previous: string }
}) {
  const [ref, width] = useWidth()
  const [active, setActive] = useState<number | null>(null)
  const values = daily.map((d) => d[metric])
  const before = previousDaily?.map((d) => d[metric]) ?? null
  const max = niceMax(Math.max(1, ...values, ...(before ?? [])))
  const innerW = Math.max(0, width - PAD.left - PAD.right)
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (daily.length > 1 ? (i / (daily.length - 1)) * innerW : innerW / 2)
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH
  const path = (list: number[]) => list.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("")
  const area = `${path(values)}L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
  const ticks = [0, max / 2, max]
  const labels = [0, Math.floor((daily.length - 1) / 2), daily.length - 1]

  // Le jour le plus proche du pointeur : on vise une date, pas une ligne de 2 px.
  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left - PAD.left) / (innerW || 1)
    setActive(Math.min(daily.length - 1, Math.max(0, Math.round(ratio * (daily.length - 1)))))
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = daily.length - 1
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

  const day = active === null ? null : daily[active]
  const prev = active === null || !previousDaily ? null : previousDaily[active]
  // Bulle à droite du curseur sur la moitié gauche du graphique, à gauche sur la moitié droite : jamais coupée.
  const onRight = active !== null && x(active) < width / 2

  return (
    <Stack space={3}>
      {previousDaily && (
        <Flex gap={4} wrap="wrap" aria-hidden="true">
          <Key color={colors.current} label={`Les ${daily.length} derniers jours`} />
          <Key color={colors.previous} label={`Les ${daily.length} jours d’avant`} />
        </Flex>
      )}
      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={`Graphique : ${METRICS[metric].many} par jour. Flèches gauche et droite pour lire chaque jour.`}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((a) => a ?? daily.length - 1)}
        onBlur={() => setActive(null)}
        style={{ position: "relative", outlineOffset: 4, borderRadius: 4 }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActive(null)}
            style={{ display: "block", touchAction: "pan-y", cursor: "crosshair" }}
            aria-hidden="true"
          >
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
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {nf.format(t)}
                </text>
              </g>
            ))}
            {labels.map((i, n) => (
              <text
                key={i}
                x={x(i)}
                y={HEIGHT - 8}
                textAnchor={n === 0 ? "start" : n === 2 ? "end" : "middle"}
                fontSize={11}
                fill="var(--card-muted-fg-color)"
              >
                {dayLabel(daily[i].date)}
              </text>
            ))}
            <path d={area} fill={colors.current} opacity={0.1} />
            {before && (
              <path d={path(before)} fill="none" stroke={colors.previous} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            )}
            <path d={path(values)} fill="none" stroke={colors.current} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {active !== null && (
              <g>
                <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="var(--card-muted-fg-color)" strokeWidth={1} />
                {before && (
                  <circle cx={x(active)} cy={y(before[active])} r={4} fill={colors.previous} stroke="var(--card-bg-color)" strokeWidth={2} />
                )}
                <circle cx={x(active)} cy={y(values[active])} r={5} fill={colors.current} stroke="var(--card-bg-color)" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}

        {day && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: active === null ? 0 : x(active) + (onRight ? 12 : -12),
              transform: onRight ? "none" : "translateX(-100%)",
              pointerEvents: "none",
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              borderRadius: 6,
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgb(0 0 0 / 0.12)",
              whiteSpace: "nowrap",
            }}
          >
            <Stack space={2}>
              <Text size={1} muted>
                {longDay(day.date)}
              </Text>
              <TipRow color={colors.current} value={day[metric]} metric={metric} />
              {prev && (
                <TipRow color={colors.previous} value={prev[metric]} metric={metric} note={`le ${dayLabel(prev.date)}`} />
              )}
            </Stack>
          </div>
        )}
        {/* Lu par les lecteurs d’écran quand on se déplace au clavier. */}
        <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
          {day
            ? `${longDay(day.date)} : ${nf.format(day[metric])} ${word(metric, day[metric])}${
                prev ? `, contre ${nf.format(prev[metric])} le ${dayLabel(prev.date)}` : ""
              }`
            : ""}
        </span>
      </div>
    </Stack>
  )
}

/** Ligne de la bulle : la valeur d’abord, le libellé ensuite ; un trait de la couleur de la courbe. */
function TipRow({ color, value, metric, note }: { color: string; value: number; metric: Metric; note?: string }) {
  return (
    <Flex align="center" gap={2}>
      <span aria-hidden="true" style={{ width: 12, height: 2, borderRadius: 1, background: color, flex: "none" }} />
      <Text size={2} weight="semibold">
        {nf.format(value)}
      </Text>
      <Text size={1} muted>
        {word(metric, value)}
        {note ? ` (${note})` : ""}
      </Text>
    </Flex>
  )
}

function Key({ color, label }: { color: string; label: string }) {
  return (
    <Flex align="center" gap={2}>
      <span style={{ width: 16, height: 2, borderRadius: 1, background: color }} />
      <Text size={1} muted>
        {label}
      </Text>
    </Flex>
  )
}

function DayTable({ metric, daily, previousDaily }: { metric: Metric; daily: DayStats[]; previousDaily: DayStats[] | null }) {
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
                Jour
              </th>
              <th scope="col" style={cell(true)}>
                {METRICS[metric].tab}
              </th>
              {previousDaily && (
                <th scope="col" style={cell(true)}>
                  Même jour de la période d’avant
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {daily.map((d, i) => (
              <tr key={d.date}>
                <td style={cell(false)}>{dayLabel(d.date)}</td>
                <td style={cell(true)}>{nf.format(d[metric])}</td>
                {previousDaily && (
                  <td style={cell(true)}>
                    {nf.format(previousDaily[i][metric])} ({dayLabel(previousDaily[i].date)})
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Text>
    </Box>
  )
}

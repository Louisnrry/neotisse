/**
 * Premier bloc du tableau de bord : les visiteurs du site, avec une courbe interactive
 * (un point par jour sur 30 jours, par semaine au-delà).
 * - Au survol, au toucher ou aux flèches du clavier, une bulle donne les chiffres juste au-dessus du point.
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
    help: "Personnes différentes venues sur le site. Une personne qui revient plusieurs fois ne compte qu’une fois par jour (ou par semaine).",
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
          <LineChart
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

const HEIGHT = 260
const PAD = { top: 20, right: 12, bottom: 28, left: 36 }

function LineChart({
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
  const tipRef = useRef<HTMLDivElement>(null)
  const [tipSize, setTipSize] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState<number | null>(null)
  const values = buckets.map((b) => b[metric])
  const before = previous ? buckets.map((_, i) => previous[i]?.[metric] ?? 0) : null
  const max = niceMax(Math.max(1, ...values, ...(before ?? [])))
  const innerW = Math.max(0, width - PAD.left - PAD.right)
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (buckets.length > 1 ? (i / (buckets.length - 1)) * innerW : innerW / 2)
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH
  const points = (list: number[]) => list.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
  const ticks = [0, max / 2, max]
  const labels = [...new Set([0, Math.floor((buckets.length - 1) / 2), buckets.length - 1])]
  // Dernier jour (ou semaine) pas fini : son segment est en pointillés, pour ne pas faire croire à une chute.
  const lastPartial = buckets.length > 1 && buckets[buckets.length - 1].partial
  const solid = lastPartial ? points(values).slice(0, -1) : points(values)
  const area = `M${points(values).join("L")}L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`

  // Taille de la bulle, mesurée après affichage, pour la placer juste au-dessus du point sans la couper.
  useEffect(() => {
    const el = tipRef.current
    if (!el) return
    const { offsetWidth: w, offsetHeight: h } = el
    setTipSize((s) => (s.w === w && s.h === h ? s : { w, h }))
  }, [active, metric, previous])

  // Le jour le plus proche du pointeur : on vise une date, pas une ligne de 2 px.
  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left - PAD.left) / (innerW || 1)
    setActive(Math.min(buckets.length - 1, Math.max(0, Math.round(ratio * (buckets.length - 1)))))
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

  const cur = active === null ? null : buckets[active]
  const prev = active === null || !previous ? null : (previous[active] ?? null)
  // Bulle centrée au-dessus du point le plus haut des deux courbes ; dessous s’il n’y a pas la place.
  const anchorY = active === null ? 0 : y(Math.max(values[active], before?.[active] ?? 0))
  const tipLeft = active === null ? 0 : Math.min(Math.max(x(active) - tipSize.w / 2, 0), Math.max(0, width - tipSize.w))
  const above = anchorY - tipSize.h - 12
  const tipTop = above >= 0 ? above : anchorY + 14

  return (
    <Stack space={3}>
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
        aria-label={`Graphique : ${METRICS[metric].many} par ${weekly ? "semaine" : "jour"}. Flèches gauche et droite pour lire chaque point.`}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((a) => a ?? buckets.length - 1)}
        onBlur={() => setActive(null)}
        style={{ position: "relative", outlineOffset: 4, borderRadius: 4 }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            onPointerMove={onPointerMove}
            onPointerDown={onPointerMove}
            onPointerLeave={() => setActive(null)}
            style={{ display: "block", touchAction: "pan-y", cursor: "crosshair" }}
            aria-hidden="true"
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--card-border-color)" />
                <text x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="var(--card-muted-fg-color)">
                  {nf.format(t)}
                </text>
              </g>
            ))}
            {labels.map((i, n) => (
              <text
                key={i}
                x={x(i)}
                y={HEIGHT - 8}
                textAnchor={labels.length > 1 && n === 0 ? "start" : labels.length > 1 && n === labels.length - 1 ? "end" : "middle"}
                fontSize={11}
                fill="var(--card-muted-fg-color)"
              >
                {dayLabel(buckets[i].start)}
              </text>
            ))}
            <path d={area} fill={colors.current} opacity={0.1} />
            {before && (
              <polyline points={points(before).join(" ")} fill="none" stroke={colors.previous} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            )}
            <polyline points={solid.join(" ")} fill="none" stroke={colors.current} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {lastPartial && (
              <polyline
                points={points(values).slice(-2).join(" ")}
                fill="none"
                stroke={colors.current}
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            )}
            {active !== null && (
              <g>
                <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="var(--card-muted-fg-color)" strokeWidth={1} opacity={0.6} />
                {before && (
                  <circle cx={x(active)} cy={y(before[active])} r={4} fill={colors.previous} stroke="var(--card-bg-color)" strokeWidth={2} />
                )}
                <circle cx={x(active)} cy={y(values[active])} r={5} fill={colors.current} stroke="var(--card-bg-color)" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}

        {cur && (
          <div
            ref={tipRef}
            style={{
              position: "absolute",
              left: tipLeft,
              top: tipTop,
              pointerEvents: "none",
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              borderRadius: 6,
              padding: "6px 10px",
              boxShadow: "0 4px 12px rgb(0 0 0 / 0.14)",
              whiteSpace: "nowrap",
              // Largeur réelle du contenu, même collée au bord droit (sinon la mesure se rétrécit).
              width: "max-content",
              // Invisible le temps de la première mesure, pour ne pas sauter.
              visibility: tipSize.w ? "visible" : "hidden",
            }}
          >
            <Stack space={2}>
              <Text size={1} muted>
                {bucketLabel(cur, weekly)}
                {cur.partial ? (weekly ? " · semaine incomplète" : " · en cours") : ""}
              </Text>
              <TipRow color={colors.current} value={cur[metric]} metric={metric} />
              {prev && (
                <TipRow color={colors.previous} value={prev[metric]} metric={metric} note={`période d’avant, ${bucketLabel(prev, weekly).replace(/^./, (c) => c.toLowerCase())}`} />
              )}
            </Stack>
          </div>
        )}
        {/* Lu par les lecteurs d’écran quand on se déplace au clavier. */}
        <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
          {cur
            ? `${bucketLabel(cur, weekly)} : ${nf.format(cur[metric])} ${word(metric, cur[metric])}${
                prev ? `, contre ${nf.format(prev[metric])} sur la période d’avant` : ""
              }`
            : ""}
        </span>
      </div>
      {lastPartial && (
        <Text size={0} muted>
          Pointillés : {weekly ? "semaine en cours" : "aujourd’hui"}, encore incomplet. Google met jusqu’à deux jours à tout compter.
        </Text>
      )}
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

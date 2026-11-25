/** Affichage du tableau de bord (sans appel réseau) : indicateurs du livrable 6, visites par jour et détails. */
import { Badge, Box, Button, Card, Flex, Grid, Stack, Text } from "@sanity/ui"
import { useState, type ReactNode } from "react"
import { useColorSchemeValue } from "sanity"

import type { Pair, Stats } from "../../../lib/stats"

export type ReviewStats = { count: number; average: number | null }

const nf = new Intl.NumberFormat("fr-FR")
const nf1 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 })
const dayLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" })

const CHANNELS: Record<string, string> = {
  "Organic Search": "Recherche Google et autres",
  "Organic Social": "Réseaux sociaux",
  "Organic Video": "Vidéo",
  Direct: "Direct ou inconnu",
  Referral: "Sites référents",
  Email: "E-mail",
  Unassigned: "Non classé",
}
const DEVICES: Record<string, string> = { mobile: "Téléphone", desktop: "Ordinateur", tablet: "Tablette" }
const EVENTS: Record<string, string> = {
  page_view: "pages vues",
  view_event: "fiches ouvertes",
  click_lieu: "clics vers le lieu",
  submit_avis: "avis envoyés",
  generate_lead: "demandes d’atelier",
  click_social: "clics vers les réseaux",
  click_contact: "clics e-mail ou téléphone",
}

type Status = { tone: "positive" | "caution" | "default"; label: string } | null

/** Seuils mensuels du livrable 6 : lus seulement sur 30 jours. */
function monthly(days: number, value: number, low: number, high: number): Status {
  if (days !== 30) return null
  if (value < low) return { tone: "caution", label: `⚠ Sous le seuil de ${low}` }
  if (value > high) return { tone: "positive", label: `✓ Au-dessus de ${high}` }
  return { tone: "default", label: "Zone normale" }
}

/** Au moins 30 fiches ouvertes avant de juger un taux (cours : un taux se lit avec son volume). */
function rateStatus(opened: number, rate: number): Status {
  if (opened < 30) return { tone: "default", label: "Volume trop faible pour conclure" }
  if (rate < 20) return { tone: "caution", label: "⚠ Sous le seuil de 20 %" }
  if (rate > 50) return { tone: "positive", label: "✓ Au-dessus de 50 %" }
  return { tone: "default", label: "Zone normale" }
}

const versus = ({ current, previous }: Pair, days: number) => {
  const diff = current - previous
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "="
  return diff === 0
    ? `Comme les ${days} jours d’avant (${nf.format(previous)})`
    : `${sign}${nf.format(Math.abs(diff))} par rapport aux ${days} jours d’avant (${nf.format(previous)})`
}

export function StatsDashboard({ stats, reviews }: { stats: Stats; reviews: ReviewStats | null }) {
  const { days, fiches, events, realtime } = stats
  // Avec le détail par fiche : seules les fiches qui ont un lien vers le lieu comptent.
  const linked = fiches?.filter((f) => f.hasLink)
  const opened = linked ? linked.reduce((sum, f) => sum + f.opened, 0) : events.view_event.current
  const clicked = linked ? linked.reduce((sum, f) => sum + f.clicked, 0) : events.click_lieu.current
  const rate = opened ? (clicked / opened) * 100 : 0

  return (
    <Stack space={5}>
      {realtime && (
        <Card padding={4} radius={2} border>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              En direct · 30 dernières minutes
            </Text>
            <Text size={1} muted>
              {[
                `visiteurs : ${nf.format(realtime.users)}`,
                ...realtime.events.map((e) => `${EVENTS[e.name] ?? e.name} : ${nf.format(e.count)}`),
              ].join(" · ")}
            </Text>
          </Stack>
        </Card>
      )}

      <Grid columns={[1, 1, 2, 4]} gap={3}>
        <Tile
          label="Fiches qui mènent au lieu"
          value={opened ? `${nf1.format(rate)} %` : "—"}
          detail={
            opened
              ? `${nf.format(clicked)} clics pour ${nf.format(opened)} fiches ouvertes`
              : "Aucune fiche ouverte sur la période"
          }
          status={opened ? rateStatus(opened, rate) : null}
        />
        <Tile
          label="Visites engagées des réseaux"
          value={nf.format(stats.socialEngaged.current)}
          detail={versus(stats.socialEngaged, days)}
          status={monthly(days, stats.socialEngaged.current, 100, 300)}
        />
        <Tile
          label="Avis publiés"
          value={reviews ? nf.format(reviews.count) : "—"}
          detail={
            !reviews
              ? "Avis illisibles pour le moment"
              : reviews.average
                ? `Note moyenne ${nf1.format(reviews.average)}/5 · source : Sanity`
                : "Source : Sanity"
          }
          status={reviews ? monthly(days, reviews.count, 2, 6) : null}
        />
        <Tile
          label="Demandes d’atelier"
          value="—"
          detail="Pas encore mesuré : le formulaire de contact n’envoie pas encore d’e-mail"
          status={null}
        />
      </Grid>

      <DailyChart stats={stats} />

      <Section title="Fiches d’événement">
        {fiches === null ? (
          <Text size={1} muted>
            Détail indisponible : les dimensions « fiche » et « lien » ne sont pas encore actives dans GA4.
          </Text>
        ) : (
          <Table
            empty="Aucune fiche ouverte sur la période."
            head={["Fiche", "Visites avec ouverture", "Visites avec clic vers le lieu"]}
            rows={fiches.map((f) => [
              f.name,
              nf.format(f.opened),
              f.hasLink ? nf.format(f.clicked) : "Pas de lien",
            ])}
          />
        )}
      </Section>

      <Grid columns={[1, 1, 2]} gap={3}>
        <Section title="D’où viennent les visites">
          <Table
            empty="Aucune visite sur la période."
            head={["Canal", "Visites", "Engagées"]}
            rows={stats.channels.map((c) => [CHANNELS[c.name] ?? c.name, nf.format(c.sessions), nf.format(c.engaged)])}
          />
        </Section>
        <Section title="Pages les plus vues">
          <Table
            empty="Aucune page vue sur la période."
            head={["Page", "Vues"]}
            rows={stats.pages.map((p) => [p.path, nf.format(p.views)])}
          />
        </Section>
        <Section title="Appareils">
          <Table
            empty="Aucune visite sur la période."
            head={["Appareil", "Visites"]}
            rows={stats.devices.map((d) => [DEVICES[d.name] ?? d.name, nf.format(d.sessions)])}
          />
        </Section>
        <Section title="Autres actions">
          <Table
            empty=""
            head={["Action", "Nombre"]}
            rows={["click_contact", "click_social", "submit_avis"].map((e) => [
              EVENTS[e][0].toUpperCase() + EVENTS[e].slice(1),
              nf.format(events[e].current),
            ])}
          />
        </Section>
      </Grid>

      <Text size={1} muted>
        Source : Google Analytics 4 et Sanity. Période : {dayLabel(stats.daily[0].date)} –{" "}
        {dayLabel(stats.daily[stats.daily.length - 1].date)}, aujourd’hui compris (journée incomplète). Lu à{" "}
        {new Date(stats.generatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}. Google peut
        mettre un à deux jours à compter toutes les visites.
      </Text>
    </Stack>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card padding={4} radius={2} border>
      <Stack space={4}>
        <Text as="h2" size={1} weight="semibold">
          {title}
        </Text>
        {children}
      </Stack>
    </Card>
  )
}

function Tile({ label, value, detail, status }: { label: string; value: string; detail: string; status: Status }) {
  return (
    <Card padding={4} radius={2} border>
      <Stack space={4}>
        <Text as="h2" size={1} weight="medium">
          {label}
        </Text>
        <Text size={4} weight="semibold">
          {value}
        </Text>
        <Text size={1} muted>
          {detail}
        </Text>
        {status && (
          <Flex>
            <Badge tone={status.tone} fontSize={1} padding={2}>
              {status.label}
            </Badge>
          </Flex>
        )}
      </Stack>
    </Card>
  )
}

function Table({ head, rows, empty }: { head: string[]; rows: string[][]; empty: string }) {
  if (!rows.length) {
    return (
      <Text size={1} muted>
        {empty}
      </Text>
    )
  }
  const cell = (i: number) =>
    ({
      padding: "8px 0 8px 12px",
      paddingLeft: i === 0 ? 0 : 12,
      textAlign: i === 0 ? "left" : "right",
      fontVariantNumeric: i === 0 ? undefined : "tabular-nums",
      overflowWrap: "anywhere",
      borderBottom: "1px solid var(--card-border-color)",
      fontWeight: "inherit",
    }) as const
  return (
    <Text as="div" size={1}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ color: "var(--card-muted-fg-color)" }}>
          <tr>
            {head.map((h, i) => (
              <th key={h} scope="col" style={cell(i)}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((value, i) => (
                <td key={head[i]} style={cell(i)}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Text>
  )
}

/** Échelle haute arrondie (graduation du milieu toujours entière). */
function niceMax(value: number) {
  if (value <= 4) return 4
  const power = 10 ** Math.floor(Math.log10(value))
  return [1, 2, 4, 6, 8, 10].map((n) => n * power).find((n) => n >= value) ?? value
}

function DailyChart({ stats }: { stats: Stats }) {
  const dark = useColorSchemeValue() === "dark"
  const [active, setActive] = useState<number | null>(null)
  const [asTable, setAsTable] = useState(false)
  // Garance de la charte, éclaircie sur le fond sombre du Studio (contrastes vérifiés).
  const color = dark ? "#E05A45" : "#C8361F"
  const { daily } = stats
  const max = niceMax(Math.max(...daily.map((d) => d.sessions)))
  const ticks = [max, max / 2, 0]
  const shown = active === null ? null : daily[active]

  return (
    <Card padding={4} radius={2} border>
      <Stack space={4}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Text as="h2" size={1} weight="semibold">
            Visites par jour · {nf.format(stats.sessions.current)} au total
          </Text>
          <Button
            mode="bleed"
            fontSize={1}
            padding={2}
            onClick={() => setAsTable((v) => !v)}
            text={asTable ? "Voir le graphique" : "Voir le tableau"}
          />
        </Flex>
        <Text size={1} muted>
          {versus(stats.sessions, stats.days)}
        </Text>

        {asTable ? (
          <Box style={{ maxHeight: 320, overflowY: "auto" }}>
            <Table empty="" head={["Jour", "Visites"]} rows={daily.map((d) => [dayLabel(d.date), nf.format(d.sessions)])} />
          </Box>
        ) : (
          <Box>
            <Box style={{ minHeight: 20 }} aria-live="polite">
              <Text size={1} weight="semibold">
                {shown
                  ? `${nf.format(shown.sessions)} ${shown.sessions > 1 ? "visites" : "visite"} · ${dayLabel(shown.date)}`
                  : " "}
              </Text>
            </Box>
            <Flex style={{ height: 200 }} gap={2}>
              <Flex direction="column" justify="space-between" style={{ margin: "-6px 0" }}>
                {ticks.map((t) => (
                  <Text key={t} size={0} muted align="right">
                    {nf.format(t)}
                  </Text>
                ))}
              </Flex>
              <div
                role="group"
                aria-label="Visites par jour"
                onPointerLeave={() => setActive(null)}
                style={{ position: "relative", flex: 1, display: "flex", minWidth: 0 }}
              >
                {ticks.map((t) => (
                  <div
                    key={t}
                    aria-hidden="true"
                    style={{ position: "absolute", left: 0, right: 0, bottom: `${(t / max) * 100}%`, borderTop: "1px solid var(--card-border-color)" }}
                  />
                ))}
                {daily.map((d, i) => (
                  <button
                    key={d.date}
                    type="button"
                    aria-label={`${dayLabel(d.date)} : ${d.sessions} visite${d.sessions > 1 ? "s" : ""}`}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    style={{
                      position: "relative",
                      flex: "1 1 0",
                      minWidth: 0,
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      padding: "0 1px",
                      border: 0,
                      background: active === i ? "var(--card-border-color)" : "none",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 24,
                        height: `${(d.sessions / max) * 100}%`,
                        minHeight: d.sessions ? 2 : 0,
                        background: color,
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                  </button>
                ))}
              </div>
            </Flex>
            <Flex justify="space-between" marginTop={3}>
              <Text size={0} muted>
                {dayLabel(daily[0].date)}
              </Text>
              <Text size={0} muted>
                {dayLabel(daily[daily.length - 1].date)}
              </Text>
            </Flex>
          </Box>
        )}
      </Stack>
    </Card>
  )
}

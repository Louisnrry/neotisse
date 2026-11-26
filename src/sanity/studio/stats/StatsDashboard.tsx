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

/** Noms des pages au lieu de leurs adresses. */
const PAGE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/ateliers-tissage-teinture/": "Ateliers",
  "/calendrier-des-ateliers/": "Calendrier",
  "/partenaires/": "Partenaires",
  "/livre-dor/": "Livre d’or",
  "/savoir-faire-textiles-anciens-a-propos/": "À propos",
  "/contact-organiser-un-atelier/": "Contact",
  "/mentions-legales/": "Mentions légales",
  "/politique-de-confidentialite/": "Politique de confidentialité",
}
const DEVICES: Record<string, string> = { mobile: "Téléphone", desktop: "Ordinateur", tablet: "Tablette" }
const EVENTS: Record<string, string> = {
  page_view: "pages consultées",
  view_event: "événements ouverts",
  click_lieu: "clics vers le site d’un lieu",
  submit_avis: "avis envoyés",
  generate_lead: "demandes d’atelier",
  click_social: "clics vers Instagram ou Facebook",
  click_contact: "clics pour vous écrire ou vous appeler",
}

type Status = { tone: "positive" | "caution" | "default"; label: string } | null

/** Seuils mensuels du livrable 6 : lus seulement sur 30 jours. */
function monthly(days: number, value: number, low: number, high: number): Status {
  if (days !== 30) return null
  if (value < low) return { tone: "caution", label: `⚠ En dessous de l’objectif (${low} par mois)` }
  if (value > high) return { tone: "positive", label: `✓ Très bon mois (plus de ${high})` }
  return { tone: "default", label: "Dans l’objectif" }
}

/** Au moins 30 fiches ouvertes avant de juger un taux (cours : un taux se lit avec son volume). */
function rateStatus(opened: number, rate: number): Status {
  if (opened < 30) return { tone: "default", label: "Pas encore assez de visites pour juger" }
  if (rate < 20) return { tone: "caution", label: "⚠ En dessous de l’objectif (20 sur 100)" }
  if (rate > 50) return { tone: "positive", label: "✓ Excellent (plus de 50 sur 100)" }
  return { tone: "default", label: "Dans l’objectif" }
}

const versus = ({ current, previous }: Pair, days: number) => {
  const diff = current - previous
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "="
  return diff === 0
    ? `Autant que les ${days} jours précédents (${nf.format(previous)})`
    : `${sign === "+" ? "↑" : "↓"} ${nf.format(Math.abs(diff))} de ${sign === "+" ? "plus" : "moins"} que les ${days} jours précédents (${nf.format(previous)})`
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
              En ce moment (dernière demi-heure)
            </Text>
            <Text size={1} muted>
              {[
                `${nf.format(realtime.users)} ${realtime.users > 1 ? "personnes" : "personne"} sur le site`,
                ...realtime.events.map((e) => `${EVENTS[e.name] ?? e.name} : ${nf.format(e.count)}`),
              ].join(" · ")}
            </Text>
          </Stack>
        </Card>
      )}

      <Grid columns={[1, 1, 1, 2]} gap={3}>
        <CalendarCard stats={stats} />
        <OriginsCard stats={stats} />
      </Grid>

      <Grid columns={[1, 1, 2, 4]} gap={3}>
        <Tile
          label="Après avoir ouvert un événement, combien vont sur le site du lieu ?"
          value={opened ? `${nf.format(Math.round(rate))} sur 100` : "—"}
          detail={
            opened
              ? `${nf.format(clicked)} sur ${nf.format(opened)} ont cliqué vers le lieu pour s’inscrire`
              : "Aucun événement ouvert sur la période"
          }
          status={opened ? rateStatus(opened, rate) : null}
        />
        <Tile
          label="Visites venues d’Instagram et Facebook"
          value={nf.format(stats.socialEngaged.current)}
          detail={`Seulement les personnes qui ont pris le temps de regarder. ${versus(stats.socialEngaged, days)}`}
          status={monthly(days, stats.socialEngaged.current, 100, 300)}
        />
        <Tile
          label="Avis reçus et publiés"
          value={reviews ? nf.format(reviews.count) : "—"}
          detail={
            !reviews
              ? "Avis indisponibles pour le moment"
              : reviews.average
                ? `Note moyenne : ${nf1.format(reviews.average)} sur 5`
                : "Aucun avis publié sur la période"
          }
          status={reviews ? monthly(days, reviews.count, 2, 6) : null}
        />
        <Tile
          label="Demandes d’atelier reçues"
          value="—"
          detail="Pas encore comptées : le formulaire de contact doit d’abord être relié à votre boîte mail."
          status={null}
        />
      </Grid>

      <DailyChart stats={stats} />

      <Section title="Événements les plus consultés">
        {fiches === null ? (
          <Text size={1} muted>
            Le détail par événement apparaîtra ici bientôt.
          </Text>
        ) : (
          <Table
            empty="Aucun événement ouvert sur la période."
            head={["Événement", "Personnes qui l’ont ouvert", "Puis ont cliqué vers le lieu"]}
            rows={fiches.map((f) => [
              f.name,
              nf.format(f.opened),
              f.hasLink ? nf.format(f.clicked) : "Pas de lien vers le lieu",
            ])}
          />
        )}
      </Section>

      <Grid columns={[1, 1, 2]} gap={3}>
        <Section title="Pages les plus consultées">
          <Table
            empty="Aucune page vue sur la période."
            head={["Page", "Consultations"]}
            rows={stats.pages.map((p) => [PAGE_LABELS[p.path] ?? p.path, nf.format(p.views)])}
          />
        </Section>
        <Section title="Sur quel écran ?">
          <Table
            empty="Aucune visite sur la période."
            head={["Écran", "Visites"]}
            rows={stats.devices.map((d) => [DEVICES[d.name] ?? d.name, nf.format(d.sessions)])}
          />
        </Section>
        <Section title="Ce que font les visiteurs">
          <Table
            empty=""
            head={["Action", "Combien de fois"]}
            rows={["click_contact", "click_social", "submit_avis"].map((e) => [
              EVENTS[e][0].toUpperCase() + EVENTS[e].slice(1),
              nf.format(events[e].current),
            ])}
          />
        </Section>
      </Grid>

      <Text size={1} muted>
        Visites : Google Analytics. Avis : le Studio. Du {dayLabel(stats.daily[0].date)} au{" "}
        {dayLabel(stats.daily[stats.daily.length - 1].date)}, aujourd’hui compris. Mis à jour à{" "}
        {new Date(stats.generatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}. Les chiffres d’hier et
        d’aujourd’hui peuvent encore augmenter : Google met jusqu’à deux jours à tout compter.
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
  const color = useBarColor()
  const [active, setActive] = useState<number | null>(null)
  const [asTable, setAsTable] = useState(false)
  const { daily } = stats
  const max = niceMax(Math.max(...daily.map((d) => d.sessions)))
  const ticks = [max, max / 2, 0]
  const shown = active === null ? null : daily[active]

  return (
    <Card padding={4} radius={2} border>
      <Stack space={4}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Text as="h2" size={1} weight="semibold">
            Visites jour par jour : {nf.format(stats.sessions.current)} au total
          </Text>
          <Button
            mode="bleed"
            fontSize={1}
            padding={2}
            onClick={() => setAsTable((v) => !v)}
            text={asTable ? "Voir le graphique" : "Voir les chiffres"}
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

/** Garance de la charte, éclaircie sur le fond sombre du Studio (contrastes vérifiés). */
function useBarColor() {
  return useColorSchemeValue() === "dark" ? "#E05A45" : "#C8361F"
}

function BigNumber({ label, value, pair, days }: { label: string; value: string; pair?: Pair; days: number }) {
  return (
    <Stack space={3}>
      <Text size={1} muted>
        {label}
      </Text>
      <Text size={4} weight="semibold" style={{ fontSize: 44, lineHeight: 1 }}>
        {value}
      </Text>
      {pair && (
        <Text size={1} muted>
          {versus(pair, days)}
        </Text>
      )}
    </Stack>
  )
}

/** Barres horizontales, une couleur : la longueur porte la valeur, le nombre est écrit au bout. */
function BarList({ rows, empty }: { rows: { label: string; value: number; note?: string }[]; empty: string }) {
  const color = useBarColor()
  if (!rows.length) {
    return (
      <Text size={1} muted>
        {empty}
      </Text>
    )
  }
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <Stack space={4} as="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {rows.map((r) => (
        <Stack key={r.label} space={2} as="li">
          <Flex justify="space-between" gap={3}>
            <Text size={1} weight="medium">
              {r.label}
            </Text>
            <Text size={1} weight="semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
              {nf.format(r.value)}
            </Text>
          </Flex>
          <Box style={{ height: 8, borderRadius: 4, background: "var(--card-border-color)" }} aria-hidden="true">
            <Box
              style={{
                height: "100%",
                width: `${(r.value / max) * 100}%`,
                minWidth: r.value ? 4 : 0,
                borderRadius: 4,
                background: color,
              }}
            />
          </Box>
          {r.note && (
            <Text size={0} muted>
              {r.note}
            </Text>
          )}
        </Stack>
      ))}
    </Stack>
  )
}

/** Mis en avant : vues du calendrier et ce qui y mène (clics depuis le site, Google, réseaux…). */
function CalendarCard({ stats }: { stats: Stats }) {
  const { views, sources } = stats.calendar
  const fromSite = sources.filter((s) => s.kind === "site").reduce((sum, s) => sum + s.views, 0)
  const fromOutside = sources.filter((s) => s.kind !== "site").reduce((sum, s) => sum + s.views, 0)
  return (
    <FeaturedCard>
      <Stack space={5}>
        <Text as="h2" size={2} weight="semibold">
          Qui consulte le calendrier ?
        </Text>
        <Grid columns={[1, 2]} gap={4}>
          <BigNumber label="Fois où le calendrier a été ouvert" value={nf.format(views.current)} pair={views} days={stats.days} />
          <Stack space={3}>
            <Text size={1} muted>
              Parmi elles
            </Text>
            <Text size={2} weight="semibold">
              {nf.format(fromSite)} depuis une autre page du site
            </Text>
            <Text size={2} weight="semibold">
              {nf.format(fromOutside)} directement de l’extérieur (Google, réseaux…)
            </Text>
          </Stack>
        </Grid>
        <BarList
          empty="Personne n’a ouvert le calendrier sur la période."
          rows={sources.map((s) => ({ label: s.label, value: s.views }))}
        />
      </Stack>
    </FeaturedCard>
  )
}

/** Mis en avant : d’où viennent les visiteurs, Google et réseaux sociaux en premier. */
function OriginsCard({ stats }: { stats: Stats }) {
  const sum = (kind: string) =>
    stats.origins
      .filter((o) => o.kind === kind)
      .reduce<Pair>(
        (acc, o) => ({ current: acc.current + o.sessions.current, previous: acc.previous + o.sessions.previous }),
        { current: 0, previous: 0 },
      )
  const google = sum("google")
  const social = sum("reseaux")
  const total = stats.sessions.current
  const share = (n: number) => (total ? ` (${nf.format(Math.round((n / total) * 100))} % des visites)` : "")
  return (
    <FeaturedCard>
      <Stack space={5}>
        <Text as="h2" size={2} weight="semibold">
          Comment les gens trouvent le site
        </Text>
        <Grid columns={[1, 2]} gap={4}>
          <BigNumber label={`Par Google${share(google.current)}`} value={nf.format(google.current)} pair={google} days={stats.days} />
          <BigNumber
            label={`Par Instagram, Facebook et autres réseaux${share(social.current)}`}
            value={nf.format(social.current)}
            pair={social}
            days={stats.days}
          />
        </Grid>
        <BarList
          empty="Aucune visite sur la période."
          rows={stats.origins.map((o) => ({
            label: o.label,
            value: o.sessions.current,
            note: [o.detail && `Par exemple : ${o.detail}`, `dont ${nf.format(o.engaged)} qui ${o.engaged > 1 ? "ont" : "a"} pris le temps de regarder`]
              .filter(Boolean)
              .join(" · "),
          }))}
        />
        <Text size={0} muted>
          Nombre de visites. Astuce : utilisez les liens préparés pour vos publications Instagram et Facebook, sinon une
          partie de ces visites apparaît en « Accès direct ».
        </Text>
      </Stack>
    </FeaturedCard>
  )
}

/** Carte mise en avant : filet garance en haut, comme les cartes du site. */
function FeaturedCard({ children }: { children: ReactNode }) {
  return (
    <Card padding={[4, 4, 5]} radius={3} border shadow={1} style={{ borderTop: `4px solid ${useBarColor()}` }}>
      {children}
    </Card>
  )
}

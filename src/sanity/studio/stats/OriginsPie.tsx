/**
 * Camembert (anneau) de la part de chaque provenance dans les visites.
 * - Six parts au plus, dans un ordre fixe : une provenance garde toujours la même couleur, quel que soit son rang.
 * - Couleurs : palette catégorielle validée (daltonisme, contraste) dans les deux thèmes ; une légende écrite
 *   donne chaque part en clair, la couleur n’est jamais le seul repère.
 * - Survol, toucher ou clavier : la part s’écarte légèrement et son détail s’écrit au centre.
 */
import { Box, Card, Flex, Stack, Text } from "@sanity/ui"
import { useState } from "react"
import { useColorSchemeValue } from "sanity"

import type { Stats } from "../../../lib/stats"

const nf = new Intl.NumberFormat("fr-FR")

/** Parts, dans l’ordre où elles sont dessinées (sens des aiguilles d’une montre, depuis midi). */
const SLICES = [
  { key: "google", label: "Google", light: "#2a78d6", dark: "#3987e5" },
  { key: "instagram", label: "Instagram", light: "#eb6834", dark: "#d95926" },
  { key: "facebook", label: "Facebook", light: "#1baf7a", dark: "#199e70" },
  { key: "reseaux", label: "Autres réseaux", light: "#eda100", dark: "#c98500" },
  { key: "direct", label: "Accès direct", light: "#e87ba4", dark: "#d55181" },
  { key: "autre", label: "Autres provenances", light: "#008300", dark: "#0ca30c" },
] as const

type SliceKey = (typeof SLICES)[number]["key"]

/** Range une provenance du tableau de bord dans l’une des six parts. */
function sliceOf(origin: Stats["origins"][number]): SliceKey {
  if (origin.label === "Google") return "google"
  if (origin.label === "Instagram") return "instagram"
  if (origin.label === "Facebook") return "facebook"
  if (origin.kind === "reseaux") return "reseaux"
  if (origin.kind === "direct") return "direct"
  return "autre"
}

const SIZE = 220
const R = 100
const INNER = 62

/** Tracé d’une part d’anneau, de l’angle a0 à a1 (en radians, 0 = midi). */
function arc(a0: number, a1: number, offset: number) {
  const mid = (a0 + a1) / 2
  const cx = SIZE / 2 + Math.sin(mid) * offset
  const cy = SIZE / 2 - Math.cos(mid) * offset
  const pt = (r: number, a: number) => `${cx + Math.sin(a) * r},${cy - Math.cos(a) * r}`
  const large = a1 - a0 > Math.PI ? 1 : 0
  // Un cercle entier ne se dessine pas d’un seul arc : on le coupe en deux.
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    return `M${pt(R, 0)}A${R},${R} 0 1 1 ${pt(R, Math.PI)}A${R},${R} 0 1 1 ${pt(R, 0)}M${pt(INNER, 0)}A${INNER},${INNER} 0 1 0 ${pt(INNER, Math.PI)}A${INNER},${INNER} 0 1 0 ${pt(INNER, 0)}Z`
  }
  return `M${pt(R, a0)}A${R},${R} 0 ${large} 1 ${pt(R, a1)}L${pt(INNER, a1)}A${INNER},${INNER} 0 ${large} 0 ${pt(INNER, a0)}Z`
}

export function OriginsPie({ stats }: { stats: Stats }) {
  const dark = useColorSchemeValue() === "dark"
  const [active, setActive] = useState<SliceKey | null>(null)

  const totals = new Map<SliceKey, number>()
  for (const origin of stats.origins) {
    const key = sliceOf(origin)
    totals.set(key, (totals.get(key) ?? 0) + origin.sessions.current)
  }
  const total = [...totals.values()].reduce((a, b) => a + b, 0)
  const slices = SLICES.map((s) => ({ ...s, color: dark ? s.dark : s.light, value: totals.get(s.key) ?? 0 })).filter(
    (s) => s.value > 0,
  )
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0)

  // Angles cumulés ; un petit écart sépare les parts (la couleur du fond fait la séparation).
  const gap = slices.length > 1 ? 0.025 : 0
  const drawn = slices.map((s, i) => {
    const before = slices.slice(0, i).reduce((sum, x) => sum + x.value, 0)
    const a0 = (before / total) * Math.PI * 2
    const a1 = ((before + s.value) / total) * Math.PI * 2
    return { ...s, a0: a0 + gap / 2, a1: a1 - gap / 2 }
  })
  const focus = drawn.find((s) => s.key === active)

  return (
    <Card padding={[4, 4, 5]} radius={3} border shadow={1} style={{ height: "100%" }}>
      <Stack space={5}>
        <Stack space={3}>
          <Text as="h2" size={2} weight="semibold">
            D’où viennent les visites, en parts
          </Text>
          <Text size={1} muted>
            Sur {nf.format(total)} {total > 1 ? "visites" : "visite"} pendant les {stats.days} derniers jours.
          </Text>
        </Stack>

        {total === 0 ? (
          <Text size={1} muted>
            Aucune visite sur la période.
          </Text>
        ) : (
          <Stack space={5}>
            <Flex justify="center">
              <Box style={{ position: "relative", width: SIZE, height: SIZE }}>
                <svg
                  width={SIZE}
                  height={SIZE}
                  viewBox={`0 0 ${SIZE} ${SIZE}`}
                  role="img"
                  aria-label={drawn.map((s) => `${s.label} : ${pct(s.value)} %`).join(", ")}
                  onPointerLeave={() => setActive(null)}
                >
                  {drawn.map((s) => (
                    <path
                      key={s.key}
                      d={arc(s.a0, s.a1, active === s.key ? 6 : 0)}
                      fill={s.color}
                      fillRule="evenodd"
                      opacity={active && active !== s.key ? 0.45 : 1}
                      onPointerEnter={() => setActive(s.key)}
                      onPointerDown={() => setActive(s.key)}
                      style={{ transition: "opacity 150ms", cursor: "default" }}
                    />
                  ))}
                </svg>
                {/* Centre de l’anneau : la part survolée, sinon la plus grande. */}
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  style={{ position: "absolute", inset: INNER / 2, pointerEvents: "none", textAlign: "center" }}
                  aria-hidden="true"
                >
                  {(() => {
                    const s = focus ?? [...drawn].sort((a, b) => b.value - a.value)[0]
                    return (
                      <Stack space={2}>
                        <Text size={4} weight="semibold" align="center" style={{ fontSize: 32, lineHeight: 1 }}>
                          {pct(s.value)} %
                        </Text>
                        <Text size={1} muted align="center">
                          {s.label}
                        </Text>
                      </Stack>
                    )
                  })()}
                </Flex>
              </Box>
            </Flex>

            {/* Légende : une ligne par part, lisible sans la couleur ; survol et clavier comme sur l’anneau. */}
            <Stack space={1} as="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {drawn.map((s) => (
                <Box
                  as="li"
                  key={s.key}
                  tabIndex={0}
                  padding={2}
                  onPointerEnter={() => setActive(s.key)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(s.key)}
                  onBlur={() => setActive(null)}
                  style={{
                    borderRadius: 4,
                    background: active === s.key ? "var(--card-border-color)" : "transparent",
                    outlineOffset: 2,
                  }}
                >
                  <Flex align="center" gap={3}>
                    <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flex: "none" }} />
                    <Box flex={1}>
                      <Text size={1}>{s.label}</Text>
                    </Box>
                    <Text size={1} weight="semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {pct(s.value)} %
                    </Text>
                    <Text size={1} muted style={{ fontVariantNumeric: "tabular-nums", minWidth: 72, textAlign: "right" }}>
                      {nf.format(s.value)} {s.value > 1 ? "visites" : "visite"}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

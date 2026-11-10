import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { getHomePage } from "@/sanity/queries/home";
import { cn } from "@/lib/cn";

const tileTones = {
  garance: "bg-garance",
  ink: "bg-ink",
  "garance-dark": "bg-garance-dark",
} as const;

type Tile = { label: string; href: string; tone: keyof typeof tileTones };

/**
 * « Nos ateliers de médiation textile » : mosaïque de 3 tuiles entièrement cliquables
 * (grande à gauche, deux empilées à droite), léger zoom au survol, sans ombre.
 */
export async function WorkshopTiles() {
  const { title, intro, tiles, more, cta } = (await getHomePage()).workshops;
  const [main, ...others] = tiles;
  return (
    <Section spacing="none" className="py-[112px]" labelledBy="ateliers-titre">
      <RuledTitle id="ateliers-titre">{title}</RuledTitle>
      <p className="mt-10 px-[8%] text-center text-[1.2rem]">{intro}</p>

      <div className="mt-12 grid gap-5 md:grid-cols-[55fr_45fr]">
        <WorkshopTile tile={main} className="min-h-[420px] md:min-h-[600px]" />
        <div className="grid gap-5">
          {others.map((t) => (
            <WorkshopTile key={t.href} tile={t} className="min-h-[290px]" />
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <p className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-normal">{more}</p>
        <Button href={cta.href} variant="outline">
          {cta.label}
        </Button>
      </div>
    </Section>
  );
}

function WorkshopTile({ tile, className }: { tile: Tile; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden p-[1.6em] text-creme",
        "transition-transform duration-[350ms] ease-[var(--ease-soft)] will-change-transform",
        "hover:z-[2] hover:scale-[1.03] has-[a:focus-visible]:z-[2] has-[a:focus-visible]:scale-[1.03]",
        "has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-ink",
        "motion-reduce:hover:scale-100 motion-reduce:has-[a:focus-visible]:scale-100",
        tileTones[tile.tone],
        className,
      )}
    >
      {/* TODO(sanity) : photo de l’atelier en fond */}
      <p className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.05] font-normal">
        <Link
          href={tile.href}
          className="text-creme no-underline outline-none before:absolute before:inset-0 before:z-[3] before:content-[''] hover:text-creme"
        >
          {tile.label}
          <span aria-hidden="true"> →</span>
        </Link>
      </p>
    </div>
  );
}

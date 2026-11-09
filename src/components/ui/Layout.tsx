import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Width = "content" | "reading" | "wide" | "full";

const widths: Record<Width, string> = {
  content: "max-w-content",
  reading: "max-w-reading",
  wide: "max-w-wide",
  full: "max-w-none",
};

/** Conteneur centré avec la gouttière latérale du site. */
export function Container({
  width = "wide",
  className,
  children,
}: {
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("w-full px-s50", className)}>
      <div className={cn("mx-auto", widths[width])}>{children}</div>
    </div>
  );
}

type Tone = "blanc" | "pierre" | "garance" | "ink";

const tones: Record<Tone, string> = {
  blanc: "bg-blanc text-ink",
  pierre: "bg-pierre text-ink",
  // Le rouge garance est utilisé franchement (retour cliente : « pas assez flashy »)
  garance: "bg-garance text-creme [&_a:not([class])]:text-creme",
  ink: "bg-ink text-creme [&_a:not([class])]:text-creme",
};

const sectionWidths: Record<Width, string> = { ...widths, wide: "max-w-section" };

/**
 * Section pleine largeur avec fond et respiration verticale.
 * Comme la V1 : gouttière `s50` (30 à 50px) et contenu plafonné à 1240px
 * (le contenu commence à 100px du bord sur un écran de 1440px, à 30px sur mobile).
 */
export function Section({
  tone = "blanc",
  width = "wide",
  spacing = "default",
  className,
  innerClassName,
  id,
  labelledBy,
  children,
}: {
  tone?: Tone;
  width?: Width;
  spacing?: "default" | "large" | "none";
  className?: string;
  innerClassName?: string;
  id?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "px-s50",
        tones[tone],
        spacing === "default" && "py-s70",
        spacing === "large" && "py-s80",
        className,
      )}
    >
      <div className={cn("mx-auto w-full", sectionWidths[width], innerClassName)}>{children}</div>
    </section>
  );
}

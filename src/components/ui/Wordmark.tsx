import { introLetters, introViewBox } from "@/components/home/intro-glyphs";
import { cn } from "@/lib/cn";

const vb = introViewBox;

/**
 * « Néotisse » en Eagle Lake (mêmes tracés que l’intro animée), couleur du texte courant.
 * Décoratif : le nom accessible est porté par le lien qui l’entoure.
 * Donner la hauteur via `className` (ex. `h-10`), la largeur suit le ratio du mot.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
      className={cn("block w-auto", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {introLetters.map((l, i) => (
        <path key={i} d={l.d} />
      ))}
    </svg>
  );
}

/**
 * Conversion du texte enrichi Sanity (portable text) vers le format de paragraphes
 * utilisé par `<RichText>` : texte, gras, liens et retours à la ligne.
 */
import type { Inline, Paragraph } from "@/components/ui/RichText";

type Span = { _type: "span"; text: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
export type PortableBlock = {
  _type: string;
  style?: string;
  listItem?: "bullet" | "number";
  children?: Span[];
  markDefs?: MarkDef[];
};

/** Un bloc → un paragraphe (morceaux enrichis). */
export function blockToInlines(block: PortableBlock): Inline[] {
  const defs = new Map((block.markDefs ?? []).map((d) => [d._key, d]));
  const out: Inline[] = [];
  for (const span of block.children ?? []) {
    if (span._type !== "span") continue;
    const marks = span.marks ?? [];
    const link = marks.map((m) => defs.get(m)).find((d) => d?._type === "link" && d.href);
    const strong = marks.includes("strong");
    // Les retours à la ligne saisis (Maj + Entrée) deviennent des <br>.
    span.text.split("\n").forEach((piece, i) => {
      if (i > 0) out.push({ br: true });
      if (!piece) return;
      if (link?.href) out.push({ link: piece, href: link.href });
      else if (strong) out.push({ strong: piece });
      else out.push(piece);
    });
  }
  return out;
}

/** Texte brut d’un bloc. */
export function blockText(block: PortableBlock) {
  return (block.children ?? []).map((c) => c.text ?? "").join("");
}

/** Liste de blocs → paragraphes. Un paragraphe sans enrichissement reste une simple chaîne. */
export function toParagraphs(blocks: PortableBlock[] | null | undefined): Paragraph[] {
  if (!blocks) return [];
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => {
      const inlines = blockToInlines(b);
      return inlines.every((p) => typeof p === "string") ? inlines.join("") : inlines;
    })
    .filter((p) => (typeof p === "string" ? p.trim() !== "" : p.length > 0));
}

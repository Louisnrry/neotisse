/**
 * Génère les tracés SVG de « Néotisse » en Eagle Lake pour l’intro de l’accueil.
 * Sortie : src/components/home/intro-glyphs.ts (à committer).
 *
 * Relancer après un changement de mot ou de police :
 *   node scripts/generate-intro-glyphs.mjs
 *
 * Police : Eagle Lake (SIL Open Font License 1.1), paquet @fontsource/eagle-lake.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const WORD = "Néotisse";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const fontFile = join(dirname(require.resolve("@fontsource/eagle-lake/package.json")), "files/eagle-lake-latin-400-normal.woff");

const buf = readFileSync(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const size = font.unitsPerEm;
const baseline = font.ascender;

const glyphs = font.stringToGlyphs(WORD);
let x = 0;
const letters = [];
glyphs.forEach((g, i) => {
  const path = g.getPath(x, baseline, size);
  const box = path.getBoundingBox();
  letters.push({ char: WORD[i], d: path.toPathData(1), x1: box.x1, x2: box.x2, y1: box.y1, y2: box.y2 });
  const kern = i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) : 0;
  x += g.advanceWidth + kern;
});

// Cadre au plus juste autour du mot, avec une petite marge pour l’épaisseur du trait.
const pad = 24;
const minX = Math.min(...letters.map((l) => l.x1)) - pad;
const maxX = Math.max(...letters.map((l) => l.x2)) + pad;
const minY = Math.min(...letters.map((l) => l.y1)) - pad;
const maxY = Math.max(...letters.map((l) => l.y2)) + pad;
const r = (n) => Math.round(n * 10) / 10;

const out = `// Fichier généré par scripts/generate-intro-glyphs.mjs : ne pas modifier à la main.
// « ${WORD} » en Eagle Lake (SIL Open Font License 1.1), converti en tracés SVG.

export const introViewBox = { x: ${r(minX)}, y: ${r(minY)}, width: ${r(maxX - minX)}, height: ${r(maxY - minY)} } as const;

/** Une entrée par lettre : tracé et étendue horizontale (unités de la police). */
export const introLetters = ${JSON.stringify(
  letters.map((l) => ({ char: l.char, d: l.d, x1: r(l.x1), x2: r(l.x2) })),
  null,
  2,
)} as const;
`;

writeFileSync(join(root, "src/components/home/intro-glyphs.ts"), out);
console.log(`${WORD} : ${letters.length} lettres, cadre ${r(maxX - minX)} × ${r(maxY - minY)} unités`);
letters.forEach((l) => console.log(`  ${l.char}  x ${r(l.x1)} → ${r(l.x2)}`));

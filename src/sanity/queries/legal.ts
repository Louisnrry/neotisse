/**
 * Pages légales : leur contenu est un texte enrichi dans Sanity.
 * - Mentions légales : les titres 2 découpent le texte en rubriques (ce qui précède = introduction).
 * - Confidentialité : une rubrique par section ; dans chaque section, les titres 3 regroupent la liste qui suit.
 * Un lien vers « #cookies » devient le bouton « Gérer mes cookies ».
 */
import { withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { blockText, blockToInlines, type PortableBlock } from "../lib/portableText";
import type { LegalParagraph, LegalSection, PrivacyBlock, PrivacyInline, PrivacySection, PrivacyText } from "../types";
import { SEO, type Seo } from "./fragments";

const MENTIONS_QUERY = `*[_id == "mentionsLegalesPage"][0]{ ${SEO}, title, updatedAt, body }`;
const PRIVACY_QUERY = `*[_id == "politiqueConfidentialitePage"][0]{
  ${SEO}, title, intro, updatedAt, "sections": sections[]{ title, anchor, body }
}`;

const blocksOf = (body: PortableBlock[] | null | undefined) => (body ?? []).filter((b) => b._type === "block");

/** Bloc → texte enrichi, avec le bouton « Gérer mes cookies ». */
function richOf(block: PortableBlock): PrivacyInline[] {
  return blockToInlines(block).map((p) =>
    typeof p === "object" && "link" in p && p.href === "#cookies" ? { cookies: p.link } : p,
  );
}
const simplify = (parts: PrivacyInline[]): PrivacyText =>
  parts.every((p) => typeof p === "string") ? parts.join("") : parts;

/** Identifiant d’ancre à partir d’un titre (« Vos droits » → « vos-droits »). */
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export type MentionsContent = {
  seo: Seo;
  title: string;
  updatedAt: string;
  intro: LegalParagraph;
  sections: LegalSection[];
};

export async function getMentionsLegalesPage(): Promise<MentionsContent> {
  const remote = await fetchSanity<{ seo: Seo; title?: string; updatedAt?: string; body?: PortableBlock[] }>(MENTIONS_QUERY);
  const intro: LegalParagraph[] = [];
  const sections: LegalSection[] = [];
  for (const b of blocksOf(remote?.body)) {
    if (b.style === "h2") sections.push({ title: blockText(b), paragraphs: [] });
    else (sections.at(-1)?.paragraphs ?? intro).push(simplify(richOf(b)) as LegalParagraph);
  }
  return {
    seo: remote?.seo ?? null,
    title: remote?.title ?? "",
    updatedAt: remote?.updatedAt ?? "",
    // Les paragraphes d’introduction sont réunis en un seul.
    intro: intro.flatMap((p, i) => [...(i > 0 ? [" "] : []), ...(typeof p === "string" ? [p] : p)]),
    sections,
  };
}

export type PrivacyContent = {
  seo: Seo;
  title: string;
  intro: string;
  updatedAt: string;
  /** Libellé d’interface, non éditable. */
  tocTitle: string;
  sections: PrivacySection[];
};

/** Texte d’une section → paragraphes, listes à puces et intertitres suivis de leur liste. */
function privacyBlocks(body: PortableBlock[] | null | undefined): PrivacyBlock[] {
  const out: PrivacyBlock[] = [];
  for (const b of blocksOf(body)) {
    const last = out.at(-1);
    if (b.style === "h3") out.push({ type: "h3", title: blockText(b), items: [] });
    else if (b.listItem) {
      const text = simplify(richOf(b));
      if (last && (last.type === "ul" || last.type === "h3")) last.items.push(text);
      else out.push({ type: "ul", items: [text] });
    } else out.push({ type: "p", text: simplify(richOf(b)) });
  }
  return out;
}

export async function getConfidentialitePage(): Promise<PrivacyContent> {
  const remote = await fetchSanity<{
    seo: Seo;
    title?: string;
    intro?: string;
    updatedAt?: string;
    sections?: { title?: string; anchor?: string; body?: PortableBlock[] }[] | null;
  }>(PRIVACY_QUERY);
  const sections: PrivacySection[] = (remote?.sections ?? [])
    .filter((s) => s?.title)
    .map((s) => ({ anchor: s.anchor || slugify(s.title!), title: s.title!, blocks: privacyBlocks(s.body) }));
  return withDefaults(
    { ...remote, sections },
    { seo: null, title: "", intro: "", updatedAt: "", tocTitle: "Sommaire", sections: [] } as PrivacyContent,
  );
}

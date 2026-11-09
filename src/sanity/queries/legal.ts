/**
 * Pages légales : leur contenu est un texte enrichi dans Sanity.
 * - Mentions légales : les titres 2 découpent le texte en rubriques (ce qui précède = introduction).
 * - Confidentialité : une rubrique par section ; dans chaque section, les titres 3 regroupent la liste qui suit.
 * Un lien vers « #cookies » devient le bouton « Gérer mes cookies ».
 */
import { confidentialitePage as localPrivacy, type PrivacyBlock, type PrivacyInline, type PrivacySection, type PrivacyText } from "@/content/confidentialite";
import { mentionsLegalesPage as localMentions, type LegalSection, type Paragraph } from "@/content/mentions-legales";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { blockText, blockToInlines, type PortableBlock } from "../lib/portableText";
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

type MentionsContent = Omit<typeof localMentions, "seo"> & { seo: Seo };

export async function getMentionsLegalesPage(): Promise<MentionsContent> {
  const remote = await fetchSanity<{ seo: Seo; title?: string; updatedAt?: string; body?: PortableBlock[] }>(MENTIONS_QUERY);
  const blocks = blocksOf(remote?.body);
  let content: { intro?: Paragraph; sections?: LegalSection[] } = {};
  if (blocks.length) {
    const intro: Paragraph[] = [];
    const sections: LegalSection[] = [];
    for (const b of blocks) {
      if (b.style === "h2") sections.push({ title: blockText(b), paragraphs: [] });
      else (sections.at(-1)?.paragraphs ?? intro).push(simplify(richOf(b)) as Paragraph);
    }
    // Les paragraphes d’introduction sont réunis en un seul.
    content = { intro: intro.flatMap((p) => (typeof p === "string" ? [p, " "] : [...p, " "])).slice(0, -1), sections };
  }
  return withFallback(remote && { seo: remote.seo, title: remote.title, updatedAt: remote.updatedAt, ...content }, localMentions as MentionsContent);
}

type PrivacyContent = Omit<typeof localPrivacy, "seo"> & { seo: Seo };

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
  return withFallback(remote && { ...remote, sections }, localPrivacy as PrivacyContent);
}

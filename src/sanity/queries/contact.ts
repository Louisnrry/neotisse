import { EMPTY_LINK, withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import type { ContentImage, FaqItem, Link, Paragraph, RichPart } from "../types";
import { getSiteSettings } from "./settings";
import { IMAGE, imageOrUndefined, SEO, type SanityImage, type Seo } from "./fragments";

const FAQ_FIELDS = `{ question, answer }`;

const CONTACT_QUERY = `{
  "page": *[_id == "contactPage"][0]{
    ${SEO}, title, intro, phone{ label, href, person }, city,
    guestbookLink{ label, href },
    form{ title, subjectPlaceholder, projectPlaceholder, submit, sending, legal },
    faq{ title, intro, "image": image${IMAGE} }
  },
  // Ordre choisi sur la page Contact (glisser-déposer) ; sinon le champ « Ordre d’affichage ».
  "items": coalesce(
    *[_id == "contactPage"][0].faq.items[]->${FAQ_FIELDS},
    *[_type == "faqItem"] | order(order asc)${FAQ_FIELDS}
  )
}`;

/** Réponse en texte enrichi → morceaux de texte et liens (les paragraphes sont mis bout à bout). */
function answerParts(blocks: PortableBlock[] | null | undefined): RichPart[] {
  const parts: RichPart[] = [];
  (blocks ?? [])
    .filter((b) => b._type === "block")
    .forEach((block, i) => {
      if (i > 0) parts.push(" ");
      const defs = new Map((block.markDefs ?? []).map((d) => [d._key, d]));
      for (const span of block.children ?? []) {
        const link = (span.marks ?? []).map((m) => defs.get(m)).find((d) => d?._type === "link" && d.href);
        if (link?.href) {
          const external = link.external ?? /^https?:\/\//.test(link.href);
          parts.push({ text: span.text, href: link.href, ...(external && { external: true }) });
        } else parts.push(span.text);
      }
    });
  return parts;
}

export type ContactFormTexts = {
  title: string;
  subjectPlaceholder: string;
  projectPlaceholder: string;
  submit: string;
  sending: string;
};

export type ContactContent = {
  seo: Seo;
  title: string;
  intro: string;
  phone: { label: string; href: string; person: string };
  city: string;
  email: string;
  guestbookLink: Link;
  form: ContactFormTexts;
  /** Mention sous le formulaire (données personnelles). */
  legal: Paragraph[];
  faq: { title: string; intro: string; image?: ContentImage; items: FaqItem[] };
};

const EMPTY = {
  seo: null as Seo,
  title: "",
  intro: "",
  phone: { label: "", href: "", person: "" },
  city: "",
  guestbookLink: EMPTY_LINK,
  form: { title: "", subjectPlaceholder: "", projectPlaceholder: "", submit: "Envoyer", sending: "Envoi en cours…" },
  faq: { title: "", intro: "" },
};

type Remote = {
  page:
    | ({
        phone?: { label?: string; href?: string; person?: string } | null;
        city?: string | null;
        form?: ({ legal?: PortableBlock[] | null } & Record<string, unknown>) | null;
        faq?: ({ image?: Partial<SanityImage> | null } & Record<string, unknown>) | null;
      } & Record<string, unknown>)
    | null;
  items: ({ question?: string; answer?: PortableBlock[] } | null)[] | null;
};

/** Page Contact et FAQ. */
export async function getContactPage(): Promise<ContactContent> {
  const [remote, settings] = await Promise.all([fetchSanity<Remote>(CONTACT_QUERY), getSiteSettings()]);
  const page = remote?.page;
  const { legal, ...form } = page?.form ?? {};
  const merged = withDefaults(page && { ...page, form, faq: { ...page.faq, image: undefined } }, EMPTY);

  // Téléphone et ville : la page Contact, sinon les réglages du site.
  const phoneLabel = page?.phone?.label || settings.phone;
  return {
    ...merged,
    phone: {
      label: phoneLabel,
      href: page?.phone?.href || (phoneLabel ? `tel:${phoneLabel.replace(/[^\d+]/g, "").replace(/^0/, "+33")}` : ""),
      person: page?.phone?.person || settings.phonePerson,
    },
    city: page?.city || settings.city,
    email: settings.contactEmail,
    legal: toParagraphs(legal),
    faq: {
      ...merged.faq,
      image: imageOrUndefined(page?.faq?.image),
      items: (remote?.items ?? [])
        .filter((it) => it?.question)
        .map((it) => ({ question: it!.question!, answer: answerParts(it!.answer) })),
    },
  };
}

/** Texte brut d’une réponse (balisage FAQPage). */
export function plainAnswer(parts: RichPart[]) {
  return parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
}

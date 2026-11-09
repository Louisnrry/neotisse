import { contactPage as localPage, type FaqItem, type RichPart } from "@/content/contact";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import type { PortableBlock } from "../lib/portableText";
import { getSiteSettings } from "./settings";
import { IMAGE, imageOrUndefined, SEO, type SanityImage, type Seo } from "./fragments";

const FAQ_FIELDS = `{ question, answer }`;

const CONTACT_QUERY = `{
  "page": *[_id == "contactPage"][0]{
    ${SEO}, title, intro, phone{ label, href, person }, city,
    guestbookLink{ label, href },
    form{ title, subjectPlaceholder, projectPlaceholder, submit, sending },
    faq{ title, intro, "image": image${IMAGE} }
  },
  // Ordre choisi sur la page Contact (glisser-déposer) ; sinon le champ « Ordre d’affichage ».
  "items": coalesce(
    *[_id == "contactPage"][0].faq.items[]->${FAQ_FIELDS},
    *[_type == "faqItem"] | order(order asc)${FAQ_FIELDS}
  )
}`;

type RemoteBlock = PortableBlock;

/** Réponse en texte enrichi → morceaux de texte et liens (les paragraphes sont mis bout à bout). */
function answerParts(blocks: RemoteBlock[] | null | undefined): RichPart[] {
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

type ContactContent = Omit<typeof localPage, "seo" | "faq"> & {
  seo: Seo;
  faq: Omit<(typeof localPage)["faq"], "image" | "items"> & { image: SanityImage; items: FaqItem[] };
};

/** Page Contact et FAQ (valeurs de la V1 pour les champs vides). */
export async function getContactPage(): Promise<ContactContent> {
  const [remote, settings] = await Promise.all([
    fetchSanity<{
      page: (Partial<ContactContent> & { faq?: { image?: Partial<SanityImage> | null } }) | null;
      items: { question?: string; answer?: RemoteBlock[] }[] | null;
    }>(CONTACT_QUERY),
    getSiteSettings(),
  ]);

  const items = (remote?.items ?? [])
    .filter((it) => it?.question)
    .map((it) => ({ question: it.question!, answer: answerParts(it.answer) }));

  const page = remote?.page
    ? { ...remote.page, faq: { ...remote.page.faq, image: imageOrUndefined(remote.page.faq?.image) } }
    : null;

  const merged = withFallback(page, localPage as unknown as ContactContent);
  return {
    ...merged,
    // Téléphone et ville : la page Contact, sinon les réglages du site, sinon la V1.
    phone: {
      label: page?.phone?.label || settings.phone || merged.phone.label,
      href: page?.phone?.href || (settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : merged.phone.href),
      person: page?.phone?.person || settings.phonePerson || merged.phone.person,
    },
    city: page?.city || settings.city || merged.city,
    email: settings.contactEmail,
    faq: { ...merged.faq, items: items.length ? items : merged.faq.items },
  };
}

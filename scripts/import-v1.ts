/**
 * Import des contenus de la V1 (repris dans `src/content/*.ts`) dans le dataset Sanity.
 *
 *   npx sanity exec scripts/import-v1.ts --with-user-token            → import réel
 *   DRY=1 npx sanity exec scripts/import-v1.ts --with-user-token      → simulation, rien n’est écrit
 *
 * Sans danger pour ce qui existe déjà :
 * - un document absent est créé (`createIfNotExists`) ;
 * - un document existant (réglages, ateliers saisis à la main…) ne reçoit que ses champs vides
 *   (`setIfMissing`) : rien de ce qui a été saisi dans le Studio n’est écrasé.
 * Le script peut donc être relancé.
 *
 * Non importés : les avis du livre d’or (avis de test de la V1, sans e-mail).
 */
import { randomBytes } from "node:crypto";
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";

import { aPropos } from "@/content/a-propos";
import { ateliers } from "@/content/ateliers";
import { calendrierPage } from "@/content/calendrier";
import { confidentialitePage, type PrivacyInline, type PrivacyText } from "@/content/confidentialite";
import { contactPage, type RichPart } from "@/content/contact";
import { events } from "@/content/events";
import { home } from "@/content/home";
import { livreDorPage } from "@/content/livre-dor";
import { mentionsLegalesPage } from "@/content/mentions-legales";
import { partenairesPage } from "@/content/partenaires";
import { partners } from "@/content/partners";
import { siteSettings } from "@/content/site-settings";

const DRY = process.env.DRY === "1";
const client = getCliClient({ apiVersion: "2026-11-09" });

/* ------------------------------------------------------------------ outils */

const key = () => randomBytes(6).toString("hex");
const keyed = <T extends object>(items: T[]) => items.map((it) => ({ _key: key(), ...it }));
const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const link = (l: { label: string; href: string }) => ({ label: l.label, href: l.href, external: /^https?:/.test(l.href) });

/* ------------------------------------------------------------- texte enrichi */

/** Tous les morceaux de texte des contenus locaux (ateliers, légal, FAQ…). */
type AnyInline =
  | PrivacyInline
  | { text: string; href: string; external?: boolean } // FAQ
  | { sup: string };
type AnyParagraph = string | readonly AnyInline[];

/** Un paragraphe local → un bloc portable text. */
function block(p: AnyParagraph | PrivacyText | readonly RichPart[], opts: { style?: string; list?: boolean } = {}) {
  const markDefs: { _key: string; _type: "link"; href: string; external: boolean }[] = [];
  const children: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
  const push = (text: string, marks: string[] = []) => children.push({ _type: "span", _key: key(), text, marks });
  const addLink = (text: string, href: string, external?: boolean) => {
    const k = key();
    markDefs.push({ _key: k, _type: "link", href, external: external ?? /^https?:/.test(href) });
    push(text, [k]);
  };

  const parts: readonly AnyInline[] = typeof p === "string" ? [p] : (p as readonly AnyInline[]);
  for (const part of parts) {
    if (typeof part === "string") push(part);
    else if ("strong" in part) push(part.strong, ["strong"]);
    else if ("br" in part) {
      // Retour à la ligne dans le même paragraphe (Maj + Entrée dans le Studio).
      const last = children.at(-1);
      if (last && last.marks.length === 0) last.text += "\n";
      else push("\n");
    } else if ("sup" in part) push(part.sup);
    else if ("code" in part) push(part.code);
    else if ("cookies" in part) addLink(part.cookies, "#cookies", false);
    else if ("link" in part) addLink(part.link, part.href);
    else if ("text" in part) addLink(part.text, part.href, part.external);
  }
  return {
    _type: "block",
    _key: key(),
    style: opts.style ?? "normal",
    markDefs,
    children,
    ...(opts.list && { listItem: "bullet", level: 1 }),
  };
}
const blocks = (ps: readonly (AnyParagraph | PrivacyText)[]) => ps.map((p) => block(p));

/* ------------------------------------------------------------------ images */

const uploaded = new Map<string, string>();

/** Image du dossier `public/` → champ image Sanity avec texte alternatif. */
async function image(src: string, alt: string) {
  let id = uploaded.get(src);
  if (!id) {
    const file = join(process.cwd(), "public", src);
    if (DRY) id = `image-simulation-${basename(src)}`;
    else {
      // Sanity reconnaît un fichier déjà envoyé (même contenu) : pas de doublon en cas de relance.
      const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(src) });
      id = asset._id;
    }
    uploaded.set(src, id);
    console.log(`  image  ${src}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: id }, alt };
}

/* --------------------------------------------------------------- documents */

type Doc = { _id: string; _type: string; [k: string]: unknown };
const docs: Doc[] = [];
const add = (doc: Doc) => docs.push(doc);

async function main() {
  console.log(DRY ? "Simulation (DRY=1) : rien ne sera écrit.\n" : "Import dans le dataset production.\n");

  /* Réglages du site : existe déjà, on ne complète que les champs vides */
  add({
    _id: "siteSettings",
    _type: "siteSettings",
    title: siteSettings.title,
    description: siteSettings.description,
    contactEmail: siteSettings.contactEmail,
    contactRecipient: siteSettings.contactEmail,
    phone: contactPage.phone.label,
    phonePerson: contactPage.phone.person,
    city: contactPage.city,
    footerText: siteSettings.footerText,
    footerCta: siteSettings.footerCta,
    social: { instagram: siteSettings.social.instagram, facebook: siteSettings.social.facebook },
    legal: { publicationDirector: "Marie-Salomé Perrichon" },
  });

  /* Ateliers : on retrouve ceux déjà saisis par leur ancre */
  const existing = await client.fetch<{ _id: string; anchor: string }[]>(`*[_type == "workshop" && !(_id in path("drafts.**"))]{ _id, anchor }`);
  const workshopId = new Map(existing.map((w) => [w.anchor, w._id]));
  for (const [i, w] of ateliers.workshops.entries()) {
    const alreadyInSanity = workshopId.has(w.anchor);
    const id = workshopId.get(w.anchor) ?? `workshop-${w.anchor}`;
    workshopId.set(w.anchor, id);
    add({
      _id: id,
      _type: "workshop",
      title: w.title,
      anchor: w.anchor,
      kicker: w.kicker,
      subtitle: w.subtitle,
      hook: w.hook,
      facts: keyed(w.facts.map((f) => ({ _type: "fact", label: f.label, value: f.value }))),
      paragraphs: blocks(w.paragraphs),
      // Photo : seulement pour un atelier nouveau (celles du Studio ne sont jamais remplacées).
      ...(w.image && !alreadyInSanity && { image: await image(w.image.src, w.image.alt) }),
      tileColor: w.placeholder,
      order: (i + 1) * 10,
    });
  }

  /* Événements */
  for (const e of events) {
    add({
      _id: `event-${e.id}`,
      _type: "event",
      title: e.title,
      slug: { _type: "slug", current: e.id },
      startDate: e.startDate,
      ...(e.endDate && { endDate: e.endDate }),
      ...(e.hours && { hours: e.hours }),
      ...(e.place && { place: e.place }),
      ...(e.placeUrl && { placeUrl: e.placeUrl }),
      ...(e.placeUrlLabel && { placeUrlLabel: e.placeUrlLabel }),
      type: e.type,
      ...(e.excerpt && { excerpt: e.excerpt }),
      body: blocks(e.body),
      ...(e.image && { image: await image(e.image.src, e.image.alt) }),
    });
  }

  /* Partenaires */
  const partnerIds: string[] = [];
  for (const [i, p] of partners.entries()) {
    const id = `partner-${slug(p.name)}`;
    partnerIds.push(id);
    add({
      _id: id,
      _type: "partner",
      name: p.name,
      logo: await image(p.logo.src, p.logoAlt),
      ...(p.description && { description: p.description }),
      ...(p.url && { url: p.url }),
      order: (i + 1) * 10,
    });
  }

  /* Questions fréquentes */
  const faqIds: string[] = [];
  for (const [i, item] of contactPage.faq.items.entries()) {
    const id = `faq-${String(i + 1).padStart(2, "0")}`;
    faqIds.push(id);
    add({ _id: id, _type: "faqItem", question: item.question, answer: [block(item.answer)], order: (i + 1) * 10 });
  }

  /* Équipe */
  const teamIds: string[] = [];
  for (const [i, m] of aPropos.team.members.entries()) {
    const id = `team-${slug(m.name)}`;
    teamIds.push(id);
    const memberLink = "link" in m ? m.link : undefined;
    add({
      _id: id,
      _type: "teamMember",
      name: m.name,
      role: m.role,
      bio: blocks(m.bio),
      photoTone: m.photoTone,
      ...(memberLink && { link: { ...memberLink } }),
      order: (i + 1) * 10,
    });
  }

  /* Pages */
  add({
    _id: "homePage",
    _type: "homePage",
    seo: {
      title: "Médiation textile : 5 ateliers uniques | Néotisse",
      description:
        "Néotisse anime des ateliers de médiation textile autour des savoir-faire anciens : filage, tissage et teinture végétale, pour les musées et structures culturelles.",
      focusKeyword: "médiation textile",
      noindex: false,
    },
    hero: {
      title: home.hero.title,
      tagline: home.hero.tagline,
      cta: link(home.hero.cta),
      images: keyed(await Promise.all(home.hero.images.map((img) => image(img.src, img.alt)))),
    },
    partners: { title: home.partners.title, cta: link(home.partners.cta) },
    univers: { kicker: home.univers.kicker, title: home.univers.title, paragraphs: [...home.univers.paragraphs], cta: link(home.univers.cta) },
    events: { title: home.events.title, empty: home.events.empty, cta: link(home.events.cta) },
    workshops: {
      title: home.workshops.title,
      intro: home.workshops.intro,
      tiles: home.workshops.tiles.map((t) => ref(workshopId.get(t.href.split("#")[1])!)),
      more: home.workshops.more,
      cta: link(home.workshops.cta),
    },
    reviews: { title: home.reviews.title, count: home.reviews.count, cta: link(home.reviews.cta) },
    contact: { title: home.contact.title, text: home.contact.text, cta: link(home.contact.cta) },
  });

  add({
    _id: "ateliersPage",
    _type: "ateliersPage",
    seo: {
      title: "Tissage et teinture : 5 ateliers passionnants | Néotisse",
      description:
        "Tissage aux tablettes, filage et teinture végétale : découvrez les 5 ateliers de Néotisse pour musées, sites archéologiques et jeune public.",
      focusKeyword: "tissage",
      noindex: false,
    },
    title: ateliers.title,
    intro: ateliers.intro,
    audience: ateliers.audience,
    workshops: ateliers.workshops.map((w) => ref(workshopId.get(w.anchor)!)),
    cta: { title: ateliers.cta.title, text: ateliers.cta.text, button: link(ateliers.cta.button) },
  });

  const cal = calendrierPage;
  add({
    _id: "calendrierPage",
    _type: "calendrierPage",
    seo: { ...cal.seo, focusKeyword: "calendrier des ateliers", noindex: false },
    title: cal.title,
    intro: cal.intro,
    upcomingTitle: cal.upcoming.title,
    empty: cal.upcoming.empty,
    agendaTitle: cal.agenda.title,
    participationTitle: cal.participation.title,
    participationImage: await image(cal.participation.image.src, cal.participation.image.alt),
    participationText: blocks(cal.participation.paragraphs),
    structuresTitle: cal.participation.structures.title,
    structuresText: [block(cal.participation.structures.text)],
    structuresCta: link(cal.participation.structures.button),
  });

  add({
    _id: "partenairesPage",
    _type: "partenairesPage",
    seo: { ...partenairesPage.seo, focusKeyword: "partenaires", noindex: false },
    title: partenairesPage.title,
    intro: partenairesPage.intro,
    partners: partnerIds.map(ref),
    cta: { title: partenairesPage.cta.title, text: partenairesPage.cta.text, button: link(partenairesPage.cta.button) },
  });

  add({
    _id: "livreDorPage",
    _type: "livreDorPage",
    seo: { ...livreDorPage.seo, focusKeyword: "livre d’or", noindex: false },
    title: livreDorPage.title,
    intro: livreDorPage.intro,
    reviews: { ...livreDorPage.reviews },
    form: { ...livreDorPage.form },
  });

  add({
    _id: "aProposPage",
    _type: "aProposPage",
    seo: { ...aPropos.seo, focusKeyword: "savoir-faire textiles anciens", noindex: false },
    intro: { ...aPropos.intro },
    demarche: {
      title: aPropos.demarche.title,
      image: await image(aPropos.demarche.image.src, aPropos.demarche.image.alt),
      before: aPropos.demarche.before,
      pull: aPropos.demarche.pull,
      after: aPropos.demarche.after,
      conviction: aPropos.demarche.conviction,
    },
    engagements: {
      title: aPropos.engagements.title,
      intro: aPropos.engagements.intro,
      items: keyed(aPropos.engagements.items.map((it) => ({ _type: "engagement", ...it }))),
    },
    mediation: { ...aPropos.mediation },
    team: { title: aPropos.team.title, members: teamIds.map(ref) },
    cta: { title: aPropos.cta.title, text: aPropos.cta.text, button: link(aPropos.cta.button) },
  });

  add({
    _id: "contactPage",
    _type: "contactPage",
    seo: { ...contactPage.seo, focusKeyword: "organiser un atelier", noindex: false },
    title: contactPage.title,
    intro: contactPage.intro,
    phone: { ...contactPage.phone },
    city: contactPage.city,
    guestbookLink: link(contactPage.guestbookLink),
    form: { ...contactPage.form },
    faq: {
      title: contactPage.faq.title,
      image: await image(contactPage.faq.image.src, contactPage.faq.image.alt),
      intro: contactPage.faq.intro,
      items: faqIds.map(ref),
    },
  });

  // Mentions légales : introduction, puis chaque rubrique ouverte par un titre 2.
  const ml = mentionsLegalesPage;
  add({
    _id: "mentionsLegalesPage",
    _type: "mentionsLegalesPage",
    seo: { ...ml.seo, noindex: true },
    title: ml.title,
    updatedAt: ml.updatedAt,
    body: [
      block(ml.intro),
      ...ml.sections.flatMap((s) => [block(s.title, { style: "h2" }), ...blocks(s.paragraphs)]),
    ],
  });

  // Confidentialité : une section par rubrique ; titres 3 suivis de leur liste à puces.
  const pc = confidentialitePage;
  add({
    _id: "politiqueConfidentialitePage",
    _type: "politiqueConfidentialitePage",
    seo: { ...pc.seo, noindex: true },
    title: pc.title,
    intro: pc.intro,
    updatedAt: pc.updatedAt,
    sections: pc.sections.map((s) => ({
      _key: key(),
      _type: "section",
      title: s.title,
      anchor: s.anchor,
      body: s.blocks.flatMap((b) => {
        if (b.type === "p") return [block(b.text)];
        if (b.type === "ul") return b.items.map((it) => block(it, { list: true }));
        return [block(b.title, { style: "h3" }), ...b.items.map((it) => block(it, { list: true }))];
      }),
    })),
  });

  /* Écriture : création des absents, champs vides complétés sur les existants */
  const ids = docs.map((d) => d._id);
  const present = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }));
  const tx = client.transaction();
  for (const doc of docs) {
    if (present.has(doc._id)) {
      const { _id, _type, ...fields } = doc;
      void _type;
      tx.patch(_id, (p) => p.setIfMissing(fields));
      console.log(`  complète  ${_id}`);
    } else {
      tx.createIfNotExists(doc);
      console.log(`  crée      ${doc._id}`);
    }
  }
  console.log(`\n${docs.length} documents (${present.size} existants, ${docs.length - present.size} nouveaux), ${uploaded.size} images.`);
  if (DRY) return;
  await tx.commit({ visibility: "async" });
  console.log("Import terminé.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

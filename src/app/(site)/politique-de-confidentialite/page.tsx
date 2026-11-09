import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { CookieSettingsInline } from "@/components/confidentialite/CookieSettingsInline";
import { RuledTitle } from "@/components/ui/Typography";
import type { PrivacyText } from "@/sanity/types";
import { formatDate } from "@/lib/dates";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/sanity/lib/metadata";
import { getConfidentialitePage } from "@/sanity/queries/legal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getConfidentialitePage();
  return pageMetadata(seo, {
    title: "Politique de confidentialité - Néotisse",
    description:
      "Politique de confidentialité du site de l’association Néotisse : données collectées, cookies, durées de conservation et exercice de vos droits.",
    canonical: routes.confidentialite,
    // Page légale non indexée, liens suivis (Rank Math sur la V1 : noindex, follow)
    noindex: true,
  });
}

/** Texte enrichi : gras en 400 (gras relatif sur un corps en 300, comme la V1), liens soulignés garance. */
function Rich({ text }: { text: PrivacyText }): ReactNode {
  if (typeof text === "string") return text;
  return text.map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
    if ("br" in part) return <br key={i} />;
    if ("sup" in part) return <sup key={i}>{part.sup}</sup>;
    if ("code" in part) return <code key={i}>{part.code}</code>;
    if ("strong" in part)
      return (
        <strong key={i} className="font-normal">
          {part.strong}
        </strong>
      );
    if ("cookies" in part)
      return (
        <CookieSettingsInline key={i}>{part.cookies}</CookieSettingsInline>
      );
    const external = part.href.startsWith("http");
    return (
      <a key={i} href={part.href} {...(external && { target: "_blank", rel: "noreferrer noopener" })}>
        {part.link}
        {external && <span className="sr-only"> (nouvel onglet)</span>}
      </a>
    );
  });
}

/** Liste à puces de la V1 : retrait de 40px, 8px entre les éléments. */
function List({ items }: { items: PrivacyText[] }) {
  return (
    <ul className="mt-[1.2rem] list-disc pl-10 [&>li+li]:mt-2">
      {items.map((text, i) => (
        <li key={i}>
          <Rich text={text} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Politique de confidentialité (V1, page 201).
 * En-tête : colonne de 860px (padding 72px / 24px), H1 à filets + date de mise à jour (0.95rem fluide, centrée, 20px dessous).
 * Corps : colonne de 760px (padding 8px / 112px, 1.2rem plus bas) : intro, sommaire cliquable
 * (titre 1.2rem, liste numérotée interligne 1.9, liens encre soulignés d’un filet garance),
 * 9 sections numérotées (H2 à 56px au-dessus), intertitres H3 à 32px, 1.2rem entre les blocs.
 */
export default async function PolitiqueConfidentialitePage() {
  const { title, updatedAt, intro, tocTitle, sections } = await getConfidentialitePage();

  return (
    <>
      <div className="px-s50 pt-[72px] pb-6">
        <div className="mx-auto grid max-w-[860px] gap-5">
          <RuledTitle as="h1">{title}</RuledTitle>
          <p className="text-center text-[clamp(0.875rem,0.875rem+((1vw-0.2rem)*0.118),0.95rem)]">
            Dernière mise à jour : <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </p>
        </div>
      </div>

      <div className="mt-[1.2rem] px-s50 pt-2 pb-28">
        <div className="mx-auto max-w-[760px] [&_a]:underline [&_sup]:text-[0.833em]">
          <p>{intro}</p>

          <nav aria-labelledby="sommaire">
            <h2 id="sommaire" className="mt-10 text-lead">
              {tocTitle}
            </h2>
            <ol className="mt-[1.2rem] list-decimal pl-[1.4em] leading-[1.9] [&>li+li]:mt-2">
              {sections.map((section) => (
                <li key={section.anchor}>
                  <a
                    href={`#${section.anchor}`}
                    className="border-b border-garance text-ink no-underline! hover:text-garance focus-visible:text-garance"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((section, i) => (
            <section key={section.anchor} aria-labelledby={section.anchor}>
              <h2 id={section.anchor} className="mt-14 text-[clamp(1.5rem,2.4vw,1.9rem)]">
                {i + 1}. {section.title}
              </h2>
              {section.blocks.map((block, j) => {
                if (block.type === "p")
                  return (
                    <p key={j} className="mt-[1.2rem]">
                      <Rich text={block.text} />
                    </p>
                  );
                if (block.type === "ul") return <List key={j} items={block.items} />;
                return (
                  <Fragment key={j}>
                    <h3 className="mt-8 text-[clamp(0.9rem,0.9rem+((1vw-0.2rem)*0.706),1.35rem)]">{block.title}</h3>
                    <List items={block.items} />
                  </Fragment>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

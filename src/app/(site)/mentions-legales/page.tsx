import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { RuledTitle } from "@/components/ui/Typography";
import { mentionsLegalesPage, type Paragraph } from "@/content/mentions-legales";
import { formatDate } from "@/lib/dates";
import { routes } from "@/lib/routes";

// TODO(sanity) : titre, description et contenu depuis le singleton `mentionsLegalesPage`.
export const metadata: Metadata = {
  title: { absolute: mentionsLegalesPage.seo.title },
  description: mentionsLegalesPage.seo.description,
  alternates: { canonical: routes.mentionsLegales },
  // Page légale non indexée, liens suivis (Rank Math sur la V1 : noindex, follow)
  robots: { index: false, follow: true },
};

/** Texte enrichi : gras en 400 (gras relatif sur un corps en 300, comme la V1), liens soulignés garance. */
function Rich({ paragraph }: { paragraph: Paragraph }): ReactNode {
  if (typeof paragraph === "string") return paragraph;
  return paragraph.map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
    if ("br" in part) return <br key={i} />;
    if ("sup" in part) return <sup key={i}>{part.sup}</sup>;
    if ("strong" in part) return <strong key={i} className="font-normal">{part.strong}</strong>;
    const external = part.href.startsWith("http");
    return (
      <a key={i} href={part.href} {...(external && { target: "_blank", rel: "noreferrer noopener" })}>
        {part.link}
      </a>
    );
  });
}

/**
 * Mentions légales (V1, page 197).
 * En-tête : colonne de 860px (padding 72px / 24px), H1 à filets + date de mise à jour (0.95rem, centrée, 20px dessous).
 * Corps : colonne de 760px (padding 8px / 112px, 1.2rem plus bas), intertitres H2 à 48px au-dessus,
 * 1.2rem entre les blocs.
 */
export default function MentionsLegalesPage() {
  const { title, updatedAt, intro, sections } = mentionsLegalesPage;

  return (
    <>
      <div className="px-s50 pt-[72px] pb-6">
        <div className="mx-auto grid max-w-[860px] gap-5">
          <RuledTitle as="h1">{title}</RuledTitle>
          <p className="text-center text-[0.95rem]">
            Dernière mise à jour : <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </p>
        </div>
      </div>

      <div className="mt-[1.2rem] px-s50 pt-2 pb-28">
        <div className="mx-auto max-w-[760px] [&_a]:underline [&_sup]:text-[0.833em] [&_sup]:leading-[1.65]">
          <p>
            <Rich paragraph={intro} />
          </p>

          {sections.map((section, i) => (
            <section key={section.title} aria-labelledby={`mentions-${i}`}>
              <h2 id={`mentions-${i}`} className="mt-12 text-[clamp(1.5rem,2.4vw,1.9rem)]">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph, j) => (
                <p key={j} className="mt-[1.2rem]">
                  <Rich paragraph={paragraph} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

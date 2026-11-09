import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { contactPage, plainAnswer, type RichPart } from "@/content/contact";

function Rich({ parts }: { parts: RichPart[] }) {
  return parts.map((part, i) => {
    if (typeof part === "string") return part;
    if (part.external) {
      return (
        <a key={i} href={part.href} target="_blank" rel="noreferrer noopener">
          {part.text}
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
      );
    }
    return (
      <Link key={i} href={part.href}>
        {part.text}
      </Link>
    );
  });
}

/**
 * « Organiser un atelier : vos questions » (comme la V1) : titre à filets, puis photo 4/5 et texte à gauche (36 %),
 * accordéon de 10 questions à droite (64 %). Accordéon en `<details>` natif : clavier et lecteurs d’écran sans script.
 * Balisage FAQPage (JSON-LD) inclus.
 */
export function Faq() {
  const { title, image, intro, items } = contactPage.faq;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.answer) },
    })),
  };

  return (
    <Section spacing="none" className="mt-[1.2rem] pt-24 pb-28" innerClassName="grid gap-10" labelledBy="faq-titre">
      <RuledTitle id="faq-titre">{title}</RuledTitle>
      <div className="grid gap-10 min-[782px]:grid-cols-[36fr_64fr] min-[782px]:gap-20">
        <div>
          {/* TODO(sanity) : image de la page */}
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 782px) 30vw, 100vw" className="object-cover" />
          </div>
          <p className="mt-[1.2rem]">{intro}</p>
        </div>
        <div>
          {items.map((item) => (
            <details key={item.question} className="neo-faq-item group border-b border-filet first:border-t first:border-t-ink">
              <summary className="relative cursor-pointer list-none py-5 pr-11 font-serif text-[1.35rem] leading-[1.25] font-bold text-ink transition-colors duration-200 group-open:text-garance hover:text-garance [&::-webkit-details-marker]:hidden">
                {item.question}
                {/* « + » en deux traits garance, qui devient « − » à l’ouverture */}
                <span aria-hidden="true" className="absolute top-1/2 right-2 h-0.5 w-4 bg-garance" />
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 right-2 h-0.5 w-4 rotate-90 bg-garance transition-transform duration-[250ms] group-open:rotate-0"
                />
              </summary>
              <p className="-mt-1 mb-[22px] max-w-[64ch] leading-[1.7]">
                <Rich parts={item.answer} />
              </p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Section>
  );
}

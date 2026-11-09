import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { getHomePage } from "@/sanity/queries/home";

/** « Découvrez l’univers Néotisse » : photo (provisoire) à gauche, présentation à droite. */
export async function Univers() {
  const { kicker, title, paragraphs, cta } = (await getHomePage()).univers;
  return (
    <Section spacing="none" className="pt-16 pb-[112px]" labelledBy="univers-titre">
      <RuledTitle as="p">{kicker}</RuledTitle>
      <div className="mt-12 grid items-center gap-s50 md:grid-cols-[42fr_58fr]">
        {/* TODO(sanity) : photo de l’association */}
        <PhotoPlaceholder tone="garance" className="aspect-[4/5] w-full" />
        <div>
          <ThreadHeading id="univers-titre">{title}</ThreadHeading>
          <div className="mt-5 grid gap-5">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <div className="mt-5">
            <Button href={cta.href}>{cta.label}</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

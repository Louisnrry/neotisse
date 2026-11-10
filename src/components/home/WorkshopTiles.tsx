import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { getHomePage } from "@/sanity/queries/home";
import { WorkshopScroller } from "./WorkshopScroller";
import { TypeText } from "@/components/ui/Reveal";

/**
 * « Nos ateliers de médiation textile » : titre, intro, puis les ateliers en section épinglée
 * qui défilent un par un (voir WorkshopScroller), et « Et bien plus encore à découvrir ».
 */
export async function WorkshopTiles() {
  const { title, intro, tiles, more, cta } = (await getHomePage()).workshops;
  return (
    <Section spacing="none" className="py-[112px]" labelledBy="ateliers-titre">
      <RuledTitle id="ateliers-titre">{title}</RuledTitle>
      <TypeText className="mt-10 px-[8%] text-center text-[1.2rem]" value={intro} />

      <div className="mt-12">
        <WorkshopScroller tiles={tiles} />
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <p className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-normal">{more}</p>
        <Button href={cta.href} variant="outline">
          {cta.label}
        </Button>
      </div>
    </Section>
  );
}


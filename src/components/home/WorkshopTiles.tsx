import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { getHomePage } from "@/sanity/queries/home";
import { WorkshopScroller } from "./WorkshopScroller";
import { TypeText } from "@/components/ui/Reveal";

/**
 * « Nos ateliers de médiation textile » : titre, intro, puis les ateliers en section épinglée
 * qui défilent un par un (voir WorkshopScroller).
 */
export async function WorkshopTiles() {
  const { title, intro, tiles } = (await getHomePage()).workshops;
  return (
    <Section spacing="none" className="pt-[112px] pb-12 min-[900px]:pb-0" labelledBy="ateliers-titre">
      <RuledTitle id="ateliers-titre">{title}</RuledTitle>
      <TypeText className="mt-10 px-[8%] text-center text-[1.2rem]" value={intro} />

      <div className="mt-12">
        <WorkshopScroller tiles={tiles} />
      </div>
    </Section>
  );
}


import { Section } from "@/components/ui/Layout";
import { ThreadHeading } from "@/components/ui/Typography";
import type { EngagementTone } from "@/sanity/types";
import { getAProposPage } from "@/sanity/queries/aPropos";
import { cn } from "@/lib/cn";
import { TypeText } from "@/components/ui/Reveal";

const cardTones: Record<EngagementTone, string> = {
  garance: "bg-garance text-creme",
  // Décalée de 48px à partir de 900px
  outline: "border-2 border-garance text-ink min-[900px]:mt-12",
  // Décalée de 96px à partir de 900px
  ink: "bg-ink text-creme min-[900px]:mt-24",
};

/** « Nos engagements » : trois cartes décalées verticalement (garance, contour garance, encre). */
export async function Engagements() {
  const { title, intro, items } = (await getAProposPage()).engagements;
  return (
    <Section spacing="none" className="mt-[1.2rem] py-24" labelledBy="engagements-titre">
      <div className="grid gap-6">
        <ThreadHeading id="engagements-titre">{title}</ThreadHeading>
        <TypeText className="text-center text-lead" value={intro} />
      </div>
      <ul className="mt-8 grid items-start gap-[30px] md:grid-cols-3 md:gap-6">
        {items.map((item) => (
          <li key={item.title} className={cn("grid gap-3 px-8 py-9", cardTones[item.tone])}>
            <h3>{item.title}</h3>
            <TypeText value={item.text} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

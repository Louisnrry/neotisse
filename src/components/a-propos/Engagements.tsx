import { Section } from "@/components/ui/Layout";
import { ThreadHeading } from "@/components/ui/Typography";
import { aPropos, type EngagementTone } from "@/content/a-propos";
import { cn } from "@/lib/cn";

const cardTones: Record<EngagementTone, { card: string; tagline: string }> = {
  garance: { card: "bg-garance text-creme", tagline: "text-creme" },
  // Décalée de 48px à partir de 900px
  outline: { card: "border-2 border-garance text-ink min-[900px]:mt-12", tagline: "text-garance" },
  // Décalée de 96px à partir de 900px
  ink: { card: "bg-ink text-creme min-[900px]:mt-24", tagline: "text-garance-soft" },
};

/** « Nos engagements » : trois cartes décalées verticalement (garance, contour garance, encre). */
export function Engagements() {
  const { title, intro, items } = aPropos.engagements;
  return (
    <Section spacing="none" className="mt-[1.2rem] py-24" labelledBy="engagements-titre">
      <div className="grid gap-6">
        <ThreadHeading id="engagements-titre">{title}</ThreadHeading>
        <p className="text-center text-lead">{intro}</p>
      </div>
      <ul className="mt-8 grid items-start gap-[30px] md:grid-cols-3 md:gap-6">
        {items.map((item) => (
          <li key={item.title} className={cn("grid gap-3 px-8 py-9", cardTones[item.tone].card)}>
            <h3>{item.title}</h3>
            <p
              className={cn(
                "font-serif text-tagline font-semibold italic leading-[1.25]",
                cardTones[item.tone].tagline,
              )}
            >
              {item.tagline}
            </p>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

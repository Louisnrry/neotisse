import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { ThreadHeading } from "@/components/ui/Typography";
import { aPropos } from "@/content/a-propos";

/** « Une médiation… par le geste et la matière » : grand visuel 21/9 et encart blanc qui le chevauche à droite. */
export function Mediation() {
  const { title, text } = aPropos.mediation;
  return (
    <Section spacing="none" className="mt-[1.2rem] pt-12 pb-24" labelledBy="mediation-titre">
      {/* TODO(sanity) : photo d’atelier */}
      <PhotoPlaceholder tone="garance-dark" className="aspect-[21/9] w-full" />
      <div className="flex justify-end">
        <div className="relative -mt-10 grid w-full max-w-[640px] gap-4 bg-blanc p-[44px] shadow-[0_30px_60px_-34px_rgb(30_43_51/0.3)] min-[701px]:-mt-24">
          <ThreadHeading id="mediation-titre">{title}</ThreadHeading>
          <p>{text}</p>
        </div>
      </div>
    </Section>
  );
}

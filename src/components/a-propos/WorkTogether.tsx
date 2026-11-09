import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { ThreadHeading } from "@/components/ui/Typography";
import { aPropos } from "@/content/a-propos";

/** « Travaillons ensemble » : section fond garance, colonne de 760px, bouton vers la page Contact. */
export function WorkTogether() {
  const { title, text, button } = aPropos.cta;
  return (
    <Section tone="garance" width="full" spacing="none" className="py-24" labelledBy="ensemble-titre">
      <div className="mx-auto grid max-w-[760px] gap-7">
        <ThreadHeading id="ensemble-titre" tone="creme">
          {title}
        </ThreadHeading>
        <p className="text-center text-lead">{text}</p>
        <div className="flex justify-center">
          <Button href={button.href} variant="on-red">
            {button.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}

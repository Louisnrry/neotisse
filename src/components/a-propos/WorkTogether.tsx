import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { ThreadHeading } from "@/components/ui/Typography";
import { getAProposPage } from "@/sanity/queries/aPropos";
import { TypeText } from "@/components/ui/Reveal";

/** « Travaillons ensemble » : section fond garance, colonne de 760px, bouton vers la page Contact. */
export async function WorkTogether() {
  const { title, text, button } = (await getAProposPage()).cta;
  return (
    <Section tone="garance" width="full" spacing="none" className="py-24" labelledBy="ensemble-titre">
      <div className="mx-auto grid max-w-[760px] gap-7">
        <ThreadHeading id="ensemble-titre" tone="creme" center>
          {title}
        </ThreadHeading>
        <TypeText className="text-center text-lead" value={text} />
        <div className="flex justify-center">
          <Button href={button.href} variant="on-red">
            {button.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}

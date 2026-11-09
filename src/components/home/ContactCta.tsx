import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { RuledTitle } from "@/components/ui/Typography";
import { home } from "@/content/home";

/** « Contact » : invitation centrée et bouton vers la page Contact. */
export function ContactCta() {
  const { title, text, cta } = home.contact;
  return (
    <Section spacing="none" className="py-[112px]" labelledBy="contact-titre">
      <RuledTitle id="contact-titre">{title}</RuledTitle>
      <p className="mx-auto mt-8 max-w-[62ch] text-center text-[1.2rem]">{text}</p>
      <div className="mt-6 flex justify-center">
        <Button href={cta.href} className="text-[1.075rem]">
          {cta.label}
        </Button>
      </div>
    </Section>
  );
}

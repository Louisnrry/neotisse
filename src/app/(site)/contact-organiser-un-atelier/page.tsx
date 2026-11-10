import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { Faq } from "@/components/contact/Faq";
import { Button } from "@/components/ui/Button";
import { FormLegal } from "@/components/ui/Field";
import { Section } from "@/components/ui/Layout";
import { RichText } from "@/components/ui/RichText";
import { ThreadHeading } from "@/components/ui/Typography";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/sanity/lib/metadata";
import { getContactPage } from "@/sanity/queries/contact";
import { TypeText } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  return pageMetadata(seo, {
    title: "Organiser un atelier : 10 réponses essentielles | Néotisse",
    description:
      "Organiser un atelier de tissage ou de teinture végétale avec Néotisse : écrivez-nous et trouvez les réponses à vos questions sur nos interventions.",
    canonical: routes.contact,
  });
}

export default async function ContactPage() {
  const { title, intro, guestbookLink, form, legal } = await getContactPage();
  return (
    <>
      {/* Coordonnées (45 %) et formulaire « Écrivez-nous » (55 %), comme la V1 */}
      <Section spacing="none" className="pt-20 pb-28">
        <div className="grid gap-14 min-[782px]:grid-cols-[45fr_55fr] min-[782px]:gap-28">
          <div>
            <ThreadHeading as="h1" className="text-[clamp(3rem,6vw,4.6rem)] leading-none">
              {title}
            </ThreadHeading>
            <TypeText className="mt-7 mb-10 text-[1.1rem]" value={intro} />
            <ContactDetails />
            <div className="mt-8">
              <Button href={guestbookLink.href} variant="outline-thin">
                {guestbookLink.label}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="mb-7 text-[clamp(1.6rem,2.4vw,2rem)]">{form.title}</h2>
            <ContactForm form={form} />
            {legal.length > 0 && (
              <div className="mt-[1.2rem] grid gap-2">
                {legal.map((p, k) => (
                  <FormLegal key={k}>
                    <RichText value={p} />
                  </FormLegal>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Faq />
    </>
  );
}

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

// Rangée des boutons : 34px au-dessus (écart V1 entre le message et « Envoyer »), boutons centrés verticalement
// l’un par rapport à l’autre (« Envoyer » est un peu plus haut que le bouton contour).
const actionsRow = "flex items-center pt-[34px] short:pt-6 shorter:pt-4";

export default async function ContactPage() {
  const { title, intro, guestbookLink, form, legal } = await getContactPage();
  return (
    <>
      {/* Coordonnées (45 %) et formulaire « Écrivez-nous » (55 %), comme la V1.
          À partir de 782px, les deux colonnes partagent leurs rangées (subgrid) : contenu, boutons, mention RGPD.
          Le bouton du livre d’or est ainsi toujours sur la même ligne que « Envoyer » (demande de Louis du 13/11/2026).
          Sur un écran d’ordinateur peu haut (variante `short`), tout se resserre pour que les deux boutons soient visibles
          dès l’arrivée, sans défiler (demande de Louis du 13/11/2026). */}
      <Section spacing="none" className="pt-20 pb-28 short:pt-8 shorter:pt-4">
        <div className="grid gap-14 min-[782px]:grid-cols-[45fr_55fr] min-[782px]:grid-rows-[auto_auto_auto] min-[782px]:gap-x-28 min-[782px]:gap-y-0">
          <div className="min-[782px]:row-span-3 min-[782px]:grid min-[782px]:grid-rows-subgrid">
            <div>
              <ThreadHeading as="h1" className="text-[clamp(3rem,6vw,4.6rem)] leading-none short:text-[clamp(2.6rem,4.4vw,3.6rem)] shorter:text-[clamp(2.4rem,4vw,3.2rem)]">
                {title}
              </ThreadHeading>
              <TypeText className="mt-7 mb-10 text-[1.1rem] short:mt-4 short:mb-6 shorter:mt-3 shorter:mb-4" value={intro} />
              <ContactDetails />
            </div>
            <div className={actionsRow}>
              <Button href={guestbookLink.href} variant="outline-thin">
                {guestbookLink.label}
              </Button>
            </div>
          </div>

          <div className="grid min-[782px]:row-span-3 min-[782px]:grid-rows-subgrid">
            <ContactForm
              form={form}
              heading={<h2 className="mb-7 text-[clamp(1.6rem,2.4vw,2rem)] short:mb-4 shorter:mb-3">{form.title}</h2>}
              actionsClassName={actionsRow}
            />
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

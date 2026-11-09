import type { Metadata } from "next";
import Link from "next/link";
import { GuestbookForm } from "@/components/livre-dor/GuestbookForm";
import { ReviewList } from "@/components/livre-dor/ReviewList";
import { FormLegal } from "@/components/ui/Field";
import { Section } from "@/components/ui/Layout";
import { RuledTitle, ThreadHeading } from "@/components/ui/Typography";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/sanity/lib/metadata";
import { getLivreDorPage } from "@/sanity/queries/livreDor";
import { getReviews, reviewStats } from "@/sanity/queries/reviews";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLivreDorPage();
  return pageMetadata(seo, {
    title: "Livre d’or : avis sur nos ateliers textiles | Néotisse",
    description:
      "Livre d’or de Néotisse : lisez les avis des participants et des structures qui ont accueilli nos ateliers textiles, puis partagez le vôtre.",
    canonical: routes.livreDor,
  });
}

/**
 * Livre d’or (V1, page 126) : une seule colonne de 860px, padding 72px / 112px, écart 28px entre les blocs.
 * En-tête (H1 à filets + intro), « Ils nous ont laissé un mot » (48px au-dessus),
 * « Signer le livre d’or » (64px au-dessus), formulaire, mention RGPD.
 */
export default async function LivreDorPage() {
  const [{ title, intro, reviews: list, form, email }, reviews] = await Promise.all([getLivreDorPage(), getReviews()]);
  const { average } = reviewStats(reviews);

  return (
    <Section width="full" spacing="none" className="pt-[72px] pb-28">
      <div className="mx-auto grid max-w-[860px] gap-7">
        <RuledTitle as="h1">{title}</RuledTitle>
        <p className="text-center text-lead">{intro}</p>

        <section aria-labelledby="avis-titre" className="mt-5 grid gap-7">
          <ThreadHeading id="avis-titre">{list.title}</ThreadHeading>
          {reviews.length > 0 ? (
            <ReviewList reviews={reviews} average={average} step={list.step} moreLabel={list.more} />
          ) : (
            <p className="text-gris">{list.empty}</p>
          )}
        </section>

        <section aria-labelledby="signer-titre" className="mt-9 grid gap-7">
          <ThreadHeading id="signer-titre">{form.title}</ThreadHeading>
          <GuestbookForm form={form} />
          {/* Toute la largeur de la colonne, comme la V1 (la mise en page WordPress annule les 70ch) */}
          <FormLegal className="mt-8 max-w-none!">
            Seuls votre nom, le titre, la note et le texte de votre avis sont publiés, après relecture par l’association.
            Votre adresse e-mail et votre adresse IP restent confidentielles. Vous pouvez demander la suppression de votre
            avis à tout moment à <a href={`mailto:${email}`}>{email}</a>.{" "}
            <Link href={routes.confidentialite}>En savoir plus sur vos données</Link>
          </FormLegal>
        </section>
      </div>
    </Section>
  );
}

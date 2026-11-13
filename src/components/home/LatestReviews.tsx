import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { ReviewCard, ReviewSummary } from "@/components/ui/ReviewCard";
import { RuledTitle } from "@/components/ui/Typography";
import { getHomePage } from "@/sanity/queries/home";
import { getReviews, reviewStats } from "@/sanity/queries/reviews";

/** « Ils nous ont laissé un mot » : note moyenne puis les 4 derniers avis approuvés. */
export async function LatestReviews() {
  const { title, count, cta } = (await getHomePage()).reviews;
  const reviews = await getReviews();
  const latest = reviews.slice(0, count);
  const stats = reviewStats(reviews);

  return (
    <Section spacing="none" className="pt-24 pb-8" labelledBy="avis-titre">
      <RuledTitle id="avis-titre">{title}</RuledTitle>

      {latest.length > 0 && (
        <>
          <ReviewSummary average={stats.average} count={stats.count} className="mt-9" />

          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {latest.map((r) => (
              <li key={r.id}>
                <ReviewCard review={r} className="rounded-[4px]" />
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 flex justify-center">
        <Button href={cta.href} variant="outline">
          {cta.label}
        </Button>
      </div>
    </Section>
  );
}

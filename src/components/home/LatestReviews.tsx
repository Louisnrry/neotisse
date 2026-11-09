import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { Card, Stars } from "@/components/ui/Media";
import { RuledTitle } from "@/components/ui/Typography";
import { getHomePage } from "@/sanity/queries/home";
import { getReviews, reviewStats } from "@/sanity/queries/reviews";
import { formatDate } from "@/lib/dates";

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
          <p className="mt-9 flex flex-wrap items-center gap-2.5 border-b border-ink pt-3.5 pb-[18px] font-semibold">
            <span>Note moyenne :</span>
            <Stars rating={stats.average} />
            <span>
              {stats.count} avis
            </span>
          </p>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {latest.map((r) => (
              <li key={r.id}>
                <Card className="flex h-full flex-col p-6">
                  {r.title && <h3 className="mb-1.5 text-[1.5rem] leading-[1.2]">{r.title}</h3>}
                  <Stars rating={r.rating} />
                  <p className="mt-1 text-small text-gris">
                    {formatDate(r.createdAt)} · par <span className="font-semibold text-ink">{r.name}</span>
                  </p>
                  <blockquote className="mt-3.5 flex-1 border-l-[3px] border-garance py-1 pl-5 leading-[1.7]">
                    <p>{r.text}</p>
                  </blockquote>
                </Card>
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

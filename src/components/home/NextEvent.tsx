import Image from "next/image";
import { cacheLife } from "next/cache";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { RuledTitle } from "@/components/ui/Typography";
import { eventTeaser, getNextEvent } from "@/content/events";
import { home } from "@/content/home";
import { formatEventDates } from "@/lib/dates";

/**
 * « Tenez-vous au courant des prochains événements » : section rouge avec le prochain événement
 * (fin ≥ aujourd’hui, fuseau Europe/Paris). Recalculé au plus toutes les heures.
 */
export async function NextEvent() {
  "use cache";
  cacheLife("hours");

  const event = getNextEvent();
  const { title, empty, cta } = home.events;

  return (
    <Section tone="garance" spacing="none" className="py-24" labelledBy={event ? "prochain-evenement" : undefined}>
      <RuledTitle as="p" tone="creme">
        {title}
      </RuledTitle>

      {event ? (
        <div className="mt-12 grid items-center gap-12 md:grid-cols-[58fr_42fr] md:gap-[88px]">
          <div className="grid gap-5">
            <p className="font-serif text-event-date leading-none font-bold">
              {formatEventDates(event.startDate, event.endDate)}
            </p>
            <h2 id="prochain-evenement" className="text-creme">
              {event.title}
            </h2>
            {event.place && <p className="font-semibold">{event.place}</p>}
            <p>{eventTeaser(event)}</p>
            <div>
              <Button href={cta.href} variant="on-red">
                {cta.label}
              </Button>
            </div>
          </div>
          {event.image ? (
            <div className="relative aspect-[4/5] bg-garance-dark">
              <Image src={event.image.src} alt={event.image.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <PhotoPlaceholder tone="garance-dark" className="aspect-[4/5] w-full" label={`Visuel à venir : ${event.title}`} />
          )}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-6 text-center">
          <p>{empty}</p>
          <Button href={cta.href} variant="on-red">
            {cta.label}
          </Button>
        </div>
      )}
    </Section>
  );
}

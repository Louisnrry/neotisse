import { cacheLife } from "next/cache";
import { EventCalendar } from "@/components/calendrier/EventCalendar";
import { calendrierPage } from "@/content/calendrier";
import { eventTeaser, getAllEvents, getUpcomingEvents, type NeoEvent } from "@/content/events";
import { todayInParis } from "@/lib/dates";

/**
 * Données du calendrier calculées côté serveur (liste « À venir » lisible par les moteurs + JSON-LD `Event`).
 * Recalculé au plus toutes les heures, comme le prochain événement de l’accueil.
 */
export async function CalendarBoard() {
  "use cache";
  cacheLife("hours");

  const today = todayInParis();
  const upcoming = getUpcomingEvents(today);
  // Mois affiché à l’arrivée : celui du prochain événement (ou du jour s’il est en cours), comme la V1
  const initialMonth = upcoming[0] && upcoming[0].startDate > today ? upcoming[0].startDate : today;
  const { upcoming: up, agenda, dialogContact } = calendrierPage;

  return (
    <>
      <EventCalendar
        events={getAllEvents()}
        upcoming={upcoming}
        serverToday={today}
        initialMonth={initialMonth}
        texts={{
          upcomingTitle: up.title,
          empty: up.empty,
          more: up.more,
          agendaTitle: agenda.title,
          contact: dialogContact,
        }}
      />
      {upcoming.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd(upcoming)).replace(/</g, "\\u003c") }}
        />
      )}
    </>
  );
}

function eventsJsonLd(list: NeoEvent[]) {
  return {
    "@context": "https://schema.org",
    "@graph": list.map((e) => ({
      "@type": "Event",
      name: e.title,
      startDate: e.startDate,
      endDate: e.endDate ?? e.startDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      description: eventTeaser(e),
      organizer: { "@type": "Organization", name: "Néotisse", url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://neotisse.fr" },
      ...(e.place && {
        location: { "@type": "Place", name: e.place, address: e.place, ...(e.placeUrl && { url: e.placeUrl }) },
      }),
      ...(e.image && { image: e.image.src }),
    })),
  };
}

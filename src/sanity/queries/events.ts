import { todayInParis } from "@/lib/dates";
import { fetchSanity } from "../lib/live";
import { toParagraphs, type PortableBlock } from "../lib/portableText";
import type { EventType, NeoEvent } from "../types";
import { IMAGE, imageOrUndefined, stripNulls, type SanityImage } from "./fragments";

const EVENTS_QUERY = `*[_type == "event" && defined(startDate) && defined(title)] | order(startDate asc){
  "id": coalesce(slug.current, _id), title, startDate, endDate, hours,
  place, placeUrl, placeUrlLabel, type, excerpt, body, "image": image${IMAGE}
}`;

type RemoteEvent = Omit<NeoEvent, "body" | "image" | "type"> & {
  type?: EventType | null;
  body?: PortableBlock[] | null;
  image?: Partial<SanityImage> | null;
};

/** Tous les événements publiés, triés par date de début (passés compris). */
export async function getAllEvents(): Promise<NeoEvent[]> {
  const remote = await fetchSanity<RemoteEvent[]>(EVENTS_QUERY);
  return (remote ?? []).map(({ body, image, type, ...e }) =>
    stripNulls({
      ...e,
      type: type ?? "autre",
      body: toParagraphs(body),
      image: imageOrUndefined(image),
    }) as NeoEvent,
  );
}

/** Événements en cours ou à venir (fin ≥ aujourd’hui à Paris). */
export function upcomingEvents(list: NeoEvent[], today = todayInParis()) {
  return list.filter((e) => (e.endDate ?? e.startDate) >= today);
}

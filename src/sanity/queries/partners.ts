import { fetchSanity } from "../lib/live";
import { orderByPageList, orderedListQuery } from "../lib/ordering";
import type { Partner } from "../types";
import { IMAGE, stripNulls, type SanityImage } from "./fragments";

const PARTNER_FIELDS = `{ name, description, url, "logo": logo${IMAGE} }`;

// Tous les partenaires publiés : ceux de la liste de la page d’abord, puis les autres (voir `ordering.ts`).
const PARTNERS_QUERY = orderedListQuery("partner", "partenairesPage", "partners", PARTNER_FIELDS);

type RemotePartner = { _id: string; name: string; description?: string | null; url?: string | null; logo?: Partial<SanityImage> | null };

/** Partenaires, dans l’ordre d’affichage. Ceux sans nom ou sans logo chargé sont ignorés. */
export async function getPartners(): Promise<Partner[]> {
  const remote = await fetchSanity<{ refs: string[] | null; docs: (RemotePartner | null)[] | null }>(PARTNERS_QUERY);
  return orderByPageList(remote)
    .filter((p): p is RemotePartner & { logo: SanityImage } => Boolean(p?.name && p.logo?.src))
    .map(({ logo, ...p }) =>
      stripNulls({
        ...p,
        logoAlt: logo.alt ?? "",
        logo: { src: logo.src, width: logo.width ?? 400, height: logo.height ?? 400 },
      }) as Partner,
    );
}

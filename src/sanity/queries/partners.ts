import { partners as localPartners, type Partner } from "@/content/partners";
import { listOr } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { IMAGE, stripNulls, type SanityImage } from "./fragments";

const PARTNER_FIELDS = `{ name, description, url, "logo": logo${IMAGE} }`;

// Ordre choisi sur la page Partenaires (glisser-déposer) ; sinon le champ « Ordre d’affichage ».
const PARTNERS_QUERY = `coalesce(
  *[_id == "partenairesPage"][0].partners[]->${PARTNER_FIELDS},
  *[_type == "partner"] | order(order asc, name asc)${PARTNER_FIELDS}
)`;

type RemotePartner = { name: string; description?: string | null; url?: string | null; logo?: Partial<SanityImage> | null };

/** Partenaires, dans l’ordre d’affichage. Ceux sans logo chargé sont ignorés. */
export async function getPartners(): Promise<Partner[]> {
  const remote = await fetchSanity<RemotePartner[]>(PARTNERS_QUERY);
  const mapped = remote
    ?.filter((p): p is RemotePartner & { logo: SanityImage } => Boolean(p?.logo?.src))
    .map(({ logo, ...p }) =>
      stripNulls({
        ...p,
        logoAlt: logo.alt ?? "",
        logo: { src: logo.src, width: logo.width ?? 400, height: logo.height ?? 400 },
      }) as Partner,
    );
  return listOr(mapped, localPartners);
}

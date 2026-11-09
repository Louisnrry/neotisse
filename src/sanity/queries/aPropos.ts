import { aPropos as localPage, type TeamMember } from "@/content/a-propos";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { blockText, type PortableBlock } from "../lib/portableText";
import { IMAGE, imageOrUndefined, SEO, stripNulls, type SanityImage, type Seo } from "./fragments";

const MEMBER_FIELDS = `{ name, role, bio, photoTone, "photo": photo${IMAGE}, link{ intro, label, href } }`;

const A_PROPOS_QUERY = `{
  "page": *[_id == "aProposPage"][0]{
    ${SEO},
    intro{ title, subtitle, text },
    demarche{ title, "image": image${IMAGE}, before, pull, after, conviction },
    engagements{ title, intro, "items": items[]{ tone, title, tagline, text } },
    mediation{ title, text, "image": image${IMAGE} },
    team{ title },
    cta{ title, text, button{ label, href } }
  },
  // Ordre choisi sur la page À propos (glisser-déposer) ; sinon le champ « Ordre d’affichage ».
  "members": coalesce(
    *[_id == "aProposPage"][0].team.members[]->${MEMBER_FIELDS},
    *[_type == "teamMember"] | order(order asc)${MEMBER_FIELDS}
  )
}`;

export type Member = TeamMember & { photo?: SanityImage };

type RemoteMember = Omit<Member, "bio" | "photo" | "link" | "photoTone"> & {
  bio?: PortableBlock[] | null;
  photo?: Partial<SanityImage> | null;
  photoTone?: string | null;
  link?: { intro?: string; label?: string; href?: string } | null;
};

type AProposContent = Omit<typeof localPage, "seo" | "demarche" | "mediation" | "team"> & {
  seo: Seo;
  demarche: Omit<(typeof localPage)["demarche"], "image"> & { image: SanityImage };
  mediation: (typeof localPage)["mediation"] & { image?: SanityImage };
  team: { title: string; members: Member[] };
};

/** Page À propos et équipe (valeurs de la V1 pour les champs vides). */
export async function getAProposPage(): Promise<AProposContent> {
  type RemoteSection = { image?: Partial<SanityImage> | null } & Record<string, unknown>;
  type RemotePage = { demarche?: RemoteSection | null; mediation?: RemoteSection | null } & Record<string, unknown>;
  const remote = await fetchSanity<{ page: RemotePage | null; members: RemoteMember[] | null }>(A_PROPOS_QUERY);
  const r = remote?.page;
  const page = r && {
    ...r,
    demarche: r.demarche && { ...r.demarche, image: imageOrUndefined(r.demarche.image) },
    mediation: r.mediation && { ...r.mediation, image: imageOrUndefined(r.mediation.image) },
  };
  const merged = withFallback(page, localPage as unknown as AProposContent);

  const members: Member[] = (remote?.members ?? [])
    .filter((m) => m?.name)
    .map(({ bio, photo, photoTone, link, ...m }) =>
      stripNulls({
        ...m,
        bio: (bio ?? []).filter((b) => b._type === "block").map(blockText).filter(Boolean),
        photoTone: photoTone === "ink" ? "ink" : "garance",
        photo: imageOrUndefined(photo),
        link: link?.href && link.label ? { intro: link.intro ?? "", label: link.label, href: link.href } : undefined,
      }) as Member,
    );

  return { ...merged, team: { ...merged.team, members: members.length ? members : merged.team.members } };
}

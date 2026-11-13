import { EMPTY_LINK, withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";
import { orderByPageList, orderedListQuery } from "../lib/ordering";
import { blockText, type PortableBlock } from "../lib/portableText";
import type { ContentImage, EngagementTone, Link, TeamMember } from "../types";
import { IMAGE, imageOrUndefined, SEO, stripNulls, type SanityImage, type Seo } from "./fragments";

const MEMBER_FIELDS = `{ name, role, bio, photoTone, "photo": photo${IMAGE}, link{ intro, label, href } }`;

const A_PROPOS_QUERY = `{
  "page": *[_id == "aProposPage"][0]{
    ${SEO},
    intro{ title, text },
    demarche{ title, "image": image${IMAGE}, before, after, conviction },
    engagements{ title, intro, "items": items[]{ tone, title, text } },
    mediation{ title, text, "image": image${IMAGE} },
    team{ title },
    cta{ title, text, button{ label, href } }
  },
  "members": ${orderedListQuery("teamMember", "aProposPage", "team.members", MEMBER_FIELDS)}
}`;

export type Engagement = { tone: EngagementTone; title: string; text: string };

export type AProposContent = {
  seo: Seo;
  intro: { title: string; text: string };
  demarche: { title: string; image?: ContentImage; before: string; after: string; conviction: string };
  engagements: { title: string; intro: string; items: Engagement[] };
  mediation: { title: string; text: string; image?: ContentImage };
  team: { title: string; members: TeamMember[] };
  cta: { title: string; text: string; button: Link };
};

const EMPTY: Omit<AProposContent, "team" | "demarche" | "mediation"> & {
  team: { title: string };
  demarche: Omit<AProposContent["demarche"], "image">;
  mediation: Omit<AProposContent["mediation"], "image">;
} = {
  seo: null,
  intro: { title: "", text: "" },
  demarche: { title: "", before: "", after: "", conviction: "" },
  engagements: { title: "", intro: "", items: [] },
  mediation: { title: "", text: "" },
  team: { title: "" },
  cta: { title: "", text: "", button: EMPTY_LINK },
};

type RemoteMember = {
  _id: string;
  name?: string;
  role?: string | null;
  bio?: PortableBlock[] | null;
  photo?: Partial<SanityImage> | null;
  photoTone?: string | null;
  link?: { intro?: string; label?: string; href?: string } | null;
};

type RemoteSection = ({ image?: Partial<SanityImage> | null } & Record<string, unknown>) | null;

/** Page À propos et équipe. */
export async function getAProposPage(): Promise<AProposContent> {
  const remote = await fetchSanity<{
    page:
      | ({ demarche?: RemoteSection; mediation?: RemoteSection; engagements?: Record<string, unknown> | null } & Record<
          string,
          unknown
        >)
      | null;
    members: { refs: string[] | null; docs: (RemoteMember | null)[] | null } | null;
  }>(A_PROPOS_QUERY);
  const r = remote?.page;
  const merged = withDefaults(r, EMPTY);

  const items = ((r?.engagements?.items as (Partial<Engagement> | null)[] | null) ?? [])
    .filter((it) => it?.title)
    .map((it) => withDefaults(it, { tone: "garance" as EngagementTone, title: "", text: "" }));

  const members: TeamMember[] = orderByPageList(remote?.members ?? null)
    .filter((m): m is RemoteMember & { name: string } => Boolean(m?.name))
    .map(
      ({ bio, photo, photoTone, link, ...m }) =>
        stripNulls({
          name: m.name,
          role: m.role ?? "",
          bio: (bio ?? [])
            .filter((b) => b._type === "block")
            .map(blockText)
            .filter(Boolean),
          photoTone: photoTone === "ink" ? "ink" : "garance",
          photo: imageOrUndefined(photo),
          link: link?.href && link.label ? { intro: link.intro ?? "", label: link.label, href: link.href } : undefined,
        }) as TeamMember,
    );

  return {
    ...merged,
    demarche: { ...merged.demarche, image: imageOrUndefined(r?.demarche?.image) },
    mediation: { ...merged.mediation, image: imageOrUndefined(r?.mediation?.image) },
    engagements: { ...merged.engagements, items },
    team: { title: merged.team.title, members },
  };
}

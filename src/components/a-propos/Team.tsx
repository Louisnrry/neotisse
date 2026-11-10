import { Section } from "@/components/ui/Layout";
import { PhotoPlaceholder } from "@/components/ui/Media";
import { RuledTitle } from "@/components/ui/Typography";
import Image from "next/image";
import { getAProposPage } from "@/sanity/queries/aPropos";
import type { TeamMember } from "@/sanity/types";
import { RevealImage, TypeText } from "@/components/ui/Reveal";

/** « Notre équipe » : fond pierre, une ligne par membre (photo 4/5 à 26 %, texte à 74 %). */
export async function Team() {
  const { title, members } = (await getAProposPage()).team;
  return (
    <Section
      tone="pierre"
      width="full"
      spacing="none"
      className="mt-[1.2rem] pt-24 pb-[112px]"
      labelledBy="equipe-titre"
    >
      <div className="mx-auto max-w-[1040px]">
        <RuledTitle id="equipe-titre">{title}</RuledTitle>
        <div className="flex flex-col gap-16">
          {members.map((member) => (
            <Member key={member.name} member={member} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function Member({ member }: { member: TeamMember }) {
  return (
    <article className="grid gap-[30px] md:grid-cols-[minmax(0,26fr)_minmax(0,74fr)] md:gap-12">
      <RevealImage>
      {member.photo ? (
        <Image
          src={member.photo.src}
          alt={member.photo.alt}
          width={member.photo.width ?? 800}
          height={member.photo.height ?? 1000}
          sizes="(min-width: 768px) 26vw, 100vw"
          className="aspect-[4/5] w-full object-cover"
        />
      ) : (
        <PhotoPlaceholder
          tone={member.photoTone}
          label={`Photo de ${member.name} à venir`}
          className="aspect-[4/5] w-full"
        />
      )}
      </RevealImage>
      <div className="grid content-start gap-[1.2rem]">
        <div>
          <h3>{member.name}</h3>
          <p className="mt-[1.2rem] font-serif text-tagline font-semibold italic leading-[1.25] text-garance">
            {member.role}
          </p>
        </div>
        {member.bio.map((p) => (
          <TypeText key={p.slice(0, 24)} value={p} />
        ))}
        {member.link && (
          <p className="border-t border-filet pt-3.5 font-semibold">
            {member.link.intro}{" "}
            <a href={member.link.href} target="_blank" rel="noreferrer noopener">
              {member.link.label}
            </a>
          </p>
        )}
      </div>
    </article>
  );
}

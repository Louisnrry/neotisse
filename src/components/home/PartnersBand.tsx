import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RuledTitle } from "@/components/ui/Typography";
import type { Partner } from "@/sanity/types";
import { getHomePage } from "@/sanity/queries/home";
import { getPartners } from "@/sanity/queries/partners";
import { routes } from "@/lib/routes";

/**
 * « Ils nous ont fait confiance » : section rouge, logos sur toile de lin qui défilent en boucle
 * (45s, pause au survol et au focus). La liste est doublée pour une boucle sans à-coup ;
 * le double est masqué aux lecteurs d’écran et au clavier.
 */
export async function PartnersBand() {
  const [home, partners] = await Promise.all([getHomePage(), getPartners()]);
  return (
    <section className="bg-garance py-[72px] text-creme" aria-labelledby="partenaires-titre">
      <div className="px-s50">
        <RuledTitle id="partenaires-titre" tone="creme">
          {home.partners.title}
        </RuledTitle>
      </div>

      <div className="neo-marquee mt-10">
        <ul className="neo-marquee__track">
          {partners.map((p) => (
            <LogoTile key={p.name} partner={p} />
          ))}
          {partners.map((p) => (
            <LogoTile key={`${p.name}-copie`} partner={p} copy />
          ))}
        </ul>
      </div>

      <div className="mt-10 flex justify-center px-s50">
        <Button href={home.partners.cta.href} variant="on-red">
          {home.partners.cta.label}
        </Button>
      </div>
    </section>
  );
}

function LogoTile({ partner, copy = false }: { partner: Partner; copy?: boolean }) {
  return (
    <li
      data-copy={copy || undefined}
      aria-hidden={copy || undefined}
      className="bg-lin h-[140px] w-[196px] flex-none transition-shadow duration-200 has-[a:hover]:shadow-[inset_0_0_0_2px_var(--color-ink)]"
    >
      <Link
        href={routes.partenaires}
        tabIndex={copy ? -1 : undefined}
        className="grid h-full w-full place-items-center p-3.5"
      >
        <Image
          src={partner.logo.src}
          alt={copy ? "" : partner.logoAlt}
          width={partner.logo.width}
          height={partner.logo.height}
          sizes="168px"
          className="max-h-20 w-auto max-w-full object-contain"
        />
      </Link>
    </li>
  );
}

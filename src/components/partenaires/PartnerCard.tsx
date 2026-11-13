import Image from "next/image";
import type { Partner } from "@/sanity/types";
import { cn } from "@/lib/cn";

/**
 * Carte partenaire (comme la V1) : logo sur toile de lin (170px, filet garance de 3px en bas),
 * nom en H3 (lien vers le site s’il est renseigné), description. Bordure filet → garance et léger
 * grossissement (×1.03) au survol. Angles arrondis de 4px (demande de Louis du 13/11/2026).
 * Quand le partenaire a un site, toute la carte est cliquable : le lien du nom s’étend sur la carte
 * (pseudo-élément), et le contour de focus est porté par la carte.
 */
export function PartnerCard({ partner }: { partner: Partner }) {
  const { name, logo, logoAlt, description, url } = partner;
  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-[4px] border border-filet bg-blanc transition-[border-color,scale] duration-200",
        "hover:scale-[1.03] hover:border-garance",
        "has-[a:focus-visible]:scale-[1.03] has-[a:focus-visible]:border-garance has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-garance",
      )}
    >
      <div className="bg-lin grid h-[170px] place-items-center border-b-[3px] border-garance">
        <Image
          src={logo.src}
          alt={logoAlt}
          width={logo.width}
          height={logo.height}
          sizes="240px"
          className="max-h-[104px] w-auto max-w-[80%] object-contain"
        />
      </div>
      <h3 className={cn("px-[22px] pt-5 text-[1.5rem] leading-[1.15]", description ? "pb-0" : "pb-6")}>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="underline outline-none after:absolute after:inset-0 after:content-['']"
          >
            {name}
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        ) : (
          name
        )}
      </h3>
      {description && <p className="px-[22px] pt-2 pb-6 leading-[1.6]">{description}</p>}
    </li>
  );
}

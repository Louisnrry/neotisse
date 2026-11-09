import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Button } from "@/components/ui/Button";
import { siteSettings } from "@/content/site-settings";
import { mainNav, routes } from "@/lib/routes";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { CookieSettingsLink } from "./CookieSettingsLink";

// Liens texte du pied de page (pas les boutons, qui gardent leurs propres couleurs).
const footerLink = "text-creme no-underline hover:text-garance-soft";
const legalLink = "text-creme no-underline hover:text-creme hover:underline hover:underline-offset-[3px]";

/** Pied de page : fond encre, texte crème, trois colonnes (comme la V1). */
export function Footer() {
  return (
    <footer className="bg-ink px-s50 pt-[72px] pb-7 text-creme">
      <div className="mx-auto max-w-wide">
        <div className="grid gap-12 md:grid-cols-[38fr_24fr_38fr]">
          <div>
            <Image
              src="/images/logo-neotisse.png"
              alt=""
              width={56}
              height={55}
              className="w-14 opacity-90 brightness-0 invert"
            />
            <p className="mt-5 font-serif text-[2.1rem] leading-none font-bold">Néotisse</p>
            <p className="mt-4 max-w-[34ch]">{siteSettings.footerText}</p>
          </div>

          <nav aria-label="Pied de page">
            <ul className="flex flex-col gap-2 font-serif text-[1.25rem] font-bold">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-5">
            <p className="font-serif text-[1.45rem] leading-[1.25] font-semibold">{siteSettings.footerCta}</p>
            <Button href={routes.contact} variant="on-ink">
              Écrivez-nous
            </Button>
            <p className="font-semibold">
              <a href={`mailto:${siteSettings.contactEmail}`} className={footerLink}>{siteSettings.contactEmail}</a>
            </p>
            <ul className="flex gap-4">
              <li>
                <a href={siteSettings.social.instagram} aria-label="Instagram de Néotisse" className={`block ${footerLink}`}>
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a href={siteSettings.social.facebook} aria-label="Facebook de Néotisse" className={`block ${footerLink}`}>
                  <FacebookIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-creme/14 pt-5 text-legal">
          © <CurrentYear /> Association Néotisse <span aria-hidden="true">·</span>{" "}
          <Link href={routes.mentionsLegales} className={legalLink}>Mentions légales</Link> <span aria-hidden="true">·</span>{" "}
          <CookieSettingsLink /> <span aria-hidden="true">·</span>{" "}
          <Link href={routes.confidentialite} className={legalLink}>Politique de confidentialité</Link>
        </p>
      </div>
    </footer>
  );
}

/** Année courante, mise en cache une journée (exigence des Cache Components). */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

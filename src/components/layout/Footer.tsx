import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Button } from "@/components/ui/Button";
import { siteSettings } from "@/content/site-settings";
import { mainNav, routes } from "@/lib/routes";
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
            <Button href={routes.contact} variant="on-red">
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

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
      <path d="M12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.3-3.6 3.7-3.7.9-.1 1.2-.1 3.6-.1zM12 3c-2.4 0-2.8 0-3.7.1-3.3.2-5.1 2-5.2 5.2C3 9.2 3 9.6 3 12s0 2.8.1 3.7c.2 3.3 2 5.1 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.2-.2 5.1-2 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7c-.2-3.2-2-5.1-5.2-5.2C14.8 3 14.4 3 12 3zm0 4.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm4.8-8.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z" />
    </svg>
  );
}

/** Année courante, mise en cache une journée (exigence des Cache Components). */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

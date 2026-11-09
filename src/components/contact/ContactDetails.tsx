import type { ReactNode } from "react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { getContactPage } from "@/sanity/queries/contact";
import { getSiteSettings } from "@/sanity/queries/settings";

const link = "text-ink no-underline hover:text-garance hover:underline";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-filet py-[18px] min-[521px]:grid-cols-[130px_minmax(0,1fr)] min-[521px]:gap-5">
      <dt className="pt-[3px] text-kicker font-bold uppercase tracking-[0.14em] text-gris">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Coordonnées (comme la V1) : liste à libellés en petites capitales grises, filet encre en haut, filets fins entre les lignes. */
export async function ContactDetails() {
  const [{ phone, city }, siteSettings] = await Promise.all([getContactPage(), getSiteSettings()]);
  return (
    <dl className="border-t border-ink">
      <Row label="E-mail">
        <a href={`mailto:${siteSettings.contactEmail}`} className={link}>
          {siteSettings.contactEmail}
        </a>
      </Row>
      <Row label="Téléphone">
        <a href={phone.href} className={`${link} font-semibold tracking-[0.04em] tabular-nums`}>
          {phone.label}
        </a>
        <br />
        <span className="text-gris">{phone.person}</span>
      </Row>
      <Row label="Basées à">{city}</Row>
      <Row label="Suivez-nous">
        {/* Comme la V1 : icônes 24px et libellés sur une seule ligne, un peu sous le libellé « Suivez-nous » */}
        <ul className="mt-[1.2rem] flex flex-wrap gap-[1.2rem] text-[0.975rem] leading-6">
          <li className="flex">
            <a href={siteSettings.social.instagram} className={`flex items-center gap-2 pr-2 ${link}`}>
              <InstagramIcon />
              Instagram
            </a>
          </li>
          <li className="flex">
            <a href={siteSettings.social.facebook} className={`flex items-center gap-2 pr-2 ${link}`}>
              <FacebookIcon />
              Facebook
            </a>
          </li>
        </ul>
      </Row>
    </dl>
  );
}

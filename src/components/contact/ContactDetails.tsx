import type { ReactNode } from "react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { contactPage } from "@/content/contact";
import { siteSettings } from "@/content/site-settings";

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
export function ContactDetails() {
  const { phone, city } = contactPage;
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
        <ul className="grid justify-items-start gap-[19px] text-[0.975rem]">
          <li>
            <a href={siteSettings.social.instagram} className={`inline-flex items-center gap-2 ${link}`}>
              <InstagramIcon />
              Instagram
            </a>
          </li>
          <li>
            <a href={siteSettings.social.facebook} className={`inline-flex items-center gap-2 ${link}`}>
              <FacebookIcon />
              Facebook
            </a>
          </li>
        </ul>
      </Row>
    </dl>
  );
}

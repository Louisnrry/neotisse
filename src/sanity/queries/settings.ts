import { withDefaults } from "../lib/fallback";
import { fetchSanity } from "../lib/live";

const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  title, description, contactEmail, contactRecipient, phone, phonePerson, city,
  footerText, footerCta, social{ instagram, facebook, linkedin }, gaMeasurementId
}`;

export type SiteSettings = {
  title: string;
  description: string;
  contactEmail: string;
  contactRecipient: string;
  phone: string;
  phonePerson: string;
  city: string;
  footerText: string;
  footerCta: string;
  social: { instagram: string; facebook: string; linkedin: string };
  gaMeasurementId: string;
};

const EMPTY: SiteSettings = {
  title: "Néotisse",
  description: "",
  contactEmail: "",
  contactRecipient: "",
  phone: "",
  phonePerson: "",
  city: "",
  footerText: "",
  footerCta: "",
  social: { instagram: "", facebook: "", linkedin: "" },
  gaMeasurementId: "",
};

/** Document « Réglages du site ». */
export async function getSiteSettings(): Promise<SiteSettings> {
  return withDefaults(await fetchSanity(SITE_SETTINGS_QUERY), EMPTY);
}

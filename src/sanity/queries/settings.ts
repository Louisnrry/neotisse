import { siteSettings as localSettings } from "@/content/site-settings";
import { withFallback } from "../lib/fallback";
import { fetchSanity } from "../lib/live";

const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  title, description, contactEmail, contactRecipient, phone, phonePerson, city,
  footerText, footerCta, social{ instagram, facebook, linkedin }, gaMeasurementId
}`;

type LocalSettings = typeof localSettings;

export type SiteSettings = LocalSettings & {
  contactRecipient?: string;
  phone?: string;
  phonePerson?: string;
  city?: string;
  gaMeasurementId?: string;
  social: LocalSettings["social"] & { linkedin?: string };
};

/** Document « Réglages du site » (valeurs de la V1 pour les champs vides). */
export async function getSiteSettings(): Promise<SiteSettings> {
  const remote = await fetchSanity<Partial<SiteSettings>>(SITE_SETTINGS_QUERY);
  return withFallback(remote, localSettings as SiteSettings);
}

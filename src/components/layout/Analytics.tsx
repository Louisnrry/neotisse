"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { getConsentState, getServerConsentState, subscribeConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4, chargé **uniquement** après acceptation des « Statistiques »
 * (CLAUDE.md § 7.5) : aucune requête vers Google avant. Rien n’est chargé tant que
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` n’est pas renseigné.
 */
export function Analytics() {
  const { consent } = useSyncExternalStore(subscribeConsent, getConsentState, getServerConsentState);
  if (!GA_ID || !consent?.statistics) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{cookie_expires:${13 * 30 * 24 * 60 * 60}});`}
      </Script>
    </>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { introDecideScript } from "@/components/home/intro-script";
import { siteSettings } from "@/content/site-settings";
import "./globals.css";

// Polices auto-hébergées (aucun appel à Google Fonts, RGPD).
// Fichiers variables repris du site WordPress V1.
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-normal-latin.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-italic-latin.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Garamond", "Georgia", "serif"],
});

const quicksand = localFont({
  src: [{ path: "./fonts/quicksand-latin.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-quicksand",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteSettings.title,
    template: "%s | Néotisse",
  },
  description: siteSettings.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : le script de l’intro ajoute une classe à <html> avant l’hydratation.
    // data-scroll-behavior="smooth" : défilement doux pour les ancres, mais arrivée instantanée
    // en haut de page lors d’un changement de page (Next.js 16 ne le fait plus par défaut).
    <html
      lang="fr"
      className={`${cormorant.variable} ${quicksand.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introDecideScript }} />
      </head>
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}

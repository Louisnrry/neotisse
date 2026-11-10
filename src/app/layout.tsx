import type { Metadata } from "next";
import localFont from "next/font/local";
import { introDecideScript } from "@/components/home/intro-script";
import { getSiteSettings } from "@/sanity/queries/settings";
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

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: siteSettings.title,
      template: "%s | Néotisse",
    },
    description: siteSettings.description,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : le script de l’intro ajoute une classe à <html> avant l’hydratation.
    // Le défilement doux est géré par Lenis (components/layout/SmoothScroll.tsx), pas en CSS.
    <html lang="fr" className={`${cormorant.variable} ${quicksand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introDecideScript }} />
      </head>
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}

import { Analytics } from "@/components/layout/Analytics";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SanityLive } from "@/sanity/lib/live";
import { getCookieBanner } from "@/sanity/queries/cookies";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const cookieTexts = await getCookieBanner();
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-creme"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner texts={cookieTexts} />
      <Analytics />
      {/* Met la page à jour dès qu’un contenu est publié dans le Studio. */}
      <SanityLive includeDrafts={false} />
    </>
  );
}

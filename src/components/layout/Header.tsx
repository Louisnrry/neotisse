"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";
import { mainNav, routes } from "@/lib/routes";

/**
 * En-tête du site.
 * Présentation (maquette Figma « navbar à faire », 10/11/2026) : barre flottante crème aux coins
 * arrondis, trois liens à gauche, « Néotisse » en Eagle Lake au centre, deux liens et « Contact » à droite.
 * Comportement (repris de navbar.js de la V1) :
 * - collant, se cache au scroll vers le bas et revient au scroll vers le haut ;
 * - sur l’accueil : fixé par-dessus le héro et transparent jusqu’au premier défilement ;
 * - sous 1200px : mot centré + menu burger (focus piégé, Échap pour fermer).
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === routes.accueil;

  const [arrival, setArrival] = useState(isHome);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Réinitialise l’état à chaque changement de page.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setArrival(isHome && typeof window !== "undefined" ? window.scrollY <= 10 : isHome);
    setHidden(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    let arrived = isHome && window.scrollY <= 10;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const d = y - last;
      if (document.documentElement.classList.contains("dialog-open")) {
        last = y;
        return;
      }
      if (arrived) {
        if (y > 10) {
          arrived = false;
          setArrival(false);
        }
        last = y;
        return;
      }
      if (y < 80) setHidden(false);
      else if (d > 6) setHidden(true);
      else if (d < -6) setHidden(false);
      if (Math.abs(d) > 6) last = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  }, []);

  // Menu mobile : Échap, focus piégé, défilement bloqué.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []).filter((el) => !el.hasAttribute("disabled"));
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  const transparent = arrival && !menuOpen;
  const leftNav = mainNav.slice(0, 3);
  const rightNav = mainNav.slice(3);

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "top-0 z-[100] w-full px-s50 pt-4 transition-transform duration-[350ms] ease-out motion-reduce:transition-none",
        isHome ? "fixed inset-x-0" : "sticky",
        hidden && !menuOpen && "-translate-y-[calc(100%+46px)]",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-wide grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-[24px] border px-3 py-2.5",
          "transition-[background-color,border-color,box-shadow] duration-[350ms] nav:gap-14 nav:px-6 nav:py-3",
          transparent
            ? "border-transparent bg-transparent"
            : "border-filet bg-creme/95 shadow-[0_10px_30px_-18px_rgb(30_43_51/0.35)] backdrop-blur-[8px]",
        )}
      >
        {/* Liens de gauche (grand écran) */}
        <nav aria-label="Navigation principale, début" className="hidden justify-self-end nav:block">
          <ul className="flex items-center gap-9">
            {leftNav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} active={isActive(pathname, item.href)} onDark={transparent}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <span aria-hidden="true" className="nav:hidden" />

        {/* « Néotisse » au centre : retour à l’accueil */}
        <Link
          href={routes.accueil}
          aria-label="Néotisse, accueil"
          className={cn(
            "group no-underline outline-offset-4 transition-colors duration-[350ms]",
            transparent ? "text-creme hover:text-creme" : "text-ink hover:text-ink",
          )}
        >
          <Wordmark className="h-8 transition-transform duration-250 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none nav:h-10" />
        </Link>

        {/* Liens de droite + Contact (grand écran) */}
        <nav aria-label="Navigation principale, fin" className="hidden items-center gap-9 justify-self-start nav:flex">
          <ul className="flex items-center gap-9">
            {rightNav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} active={isActive(pathname, item.href)} onDark={transparent}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button href={routes.contact} className="rounded-[16px]">
            Contact
          </Button>
        </nav>

        {/* Bouton burger (petit écran) */}
        <button
          ref={burgerRef}
          type="button"
          className={cn(
            "grid h-11 w-11 place-items-center justify-self-end rounded-[14px] nav:hidden",
            transparent ? "text-creme" : "text-ink",
          )}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={() => setMenuOpen(true)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Menu mobile plein écran, fond encre */}
      {menuOpen && (
        <div
          ref={menuRef}
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[110] flex flex-col overflow-y-auto bg-ink px-s50 pt-4 pb-10 text-creme nav:hidden"
        >
          <div className="flex justify-end">
            <button type="button" onClick={closeMenu} className="grid h-11 w-11 place-items-center text-creme">
              <span className="sr-only">Fermer le menu</span>
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <nav aria-label="Navigation principale" className="mt-8 flex flex-1 flex-col">
            <ul className="flex flex-col gap-5">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-serif text-[2.2rem] leading-tight font-bold no-underline",
                        active ? "text-garance-soft" : "text-creme hover:text-garance-soft",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10">
              <Button href={routes.contact} variant="on-ink" className="rounded-[16px]" onClick={() => setMenuOpen(false)}>
                Contact
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/** Page active : même chemin ou sous-page, avec ou sans barre finale. */
function isActive(pathname: string, href: string) {
  const strip = (p: string) => p.replace(/\/+$/, "");
  const path = strip(pathname);
  const target = strip(href);
  return path === target || path.startsWith(`${target}/`);
}

/** Lien de la barre : encre sur fond crème, crème quand la barre est transparente (au-dessus du héro). */
function NavLink({
  href,
  active,
  onDark = false,
  children,
}: {
  href: string;
  active: boolean;
  onDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative font-serif text-[1.2rem] font-bold no-underline",
        "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:transition-transform after:duration-250",
        onDark
          ? cn(
              "text-creme after:bg-creme [text-shadow:0_1px_12px_rgb(16_22_27/0.45)]",
              active ? "after:scale-x-100" : "after:scale-x-0 hover:text-creme hover:after:scale-x-100",
            )
          : active
            ? "text-garance after:scale-x-100 after:bg-garance"
            : "text-ink after:scale-x-0 after:bg-garance hover:text-garance hover:after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}

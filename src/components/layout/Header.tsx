"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mainNav, routes } from "@/lib/routes";

/**
 * En-tête du site (reprend le comportement de navbar.js de la V1) :
 * - collant, se cache au scroll vers le bas et revient au scroll vers le haut ;
 * - sur l’accueil : fixé par-dessus le héro et transparent jusqu’au premier défilement ;
 * - menu burger sous 960px (focus piégé, Échap pour fermer).
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

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "top-0 z-[100] w-full transition-transform duration-[350ms] ease-out motion-reduce:transition-none",
        isHome ? "fixed inset-x-0" : "sticky",
        hidden && !menuOpen && "-translate-y-[calc(100%+46px)]",
      )}
    >
      <div
        className={cn(
          "border-b px-s50 py-1 transition-[background-color,border-color] duration-[350ms]",
          transparent
            ? "border-transparent bg-transparent"
            : "border-filet bg-blanc/96 backdrop-blur-[8px]",
        )}
      >
        <div className="mx-auto flex max-w-wide items-center justify-between gap-6">
          <Link href={routes.accueil} className="group shrink-0 outline-none" aria-label="Néotisse, accueil">
            <Image
              src="/images/logo-neotisse.png"
              alt=""
              width={52}
              height={51}
              priority
              className="w-[52px] transition-transform duration-250 group-hover:scale-112 group-focus-visible:scale-112 motion-reduce:transition-none"
            />
          </Link>

          {/* Navigation grand écran */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-9 nav:flex">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} active={isActive(pathname, item.href)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Button href={routes.contact} size="compact">
              Prenez contact
            </Button>
          </nav>

          {/* Bouton burger */}
          <button
            ref={burgerRef}
            type="button"
            className="grid h-11 w-11 place-items-center text-ink nav:hidden"
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
              <Button href={routes.contact} variant="on-red" onClick={() => setMenuOpen(false)}>
                Prenez contact
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

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative font-serif text-[1.2rem] font-bold no-underline",
        "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:bg-garance after:transition-transform after:duration-250",
        active ? "text-garance after:scale-x-100" : "text-ink after:scale-x-0 hover:text-garance hover:after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}

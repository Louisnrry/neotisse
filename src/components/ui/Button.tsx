import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "outline-garance" | "on-red";
type Size = "default" | "compact" | "large";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold leading-[1.3] no-underline transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70";

const variants: Record<Variant, string> = {
  // Plein garance, survol garance foncé
  primary: "bg-garance text-creme hover:bg-garance-dark hover:text-creme",
  // Contour encre, survol fond encre
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-blanc",
  // Contour garance, se remplit au survol (« Plus d’avis », « Refuser »)
  "outline-garance": "border border-garance text-garance hover:bg-garance hover:text-blanc",
  // Sur fond rouge ou encre : fond crème, texte garance foncé
  "on-red": "bg-creme text-garance-dark hover:bg-ink hover:text-blanc",
};

const sizes: Record<Size, string> = {
  default: "px-[1.7em] py-[0.85em] text-button",
  compact: "px-[1.1em] py-[0.5em] text-[0.9rem]",
  large: "px-[2.4em] py-[0.95em] text-[1.05rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className">;

export function buttonClasses({ variant = "primary", size = "default", className }: Omit<CommonProps, "children">) {
  // Les variantes à contour compensent l’épaisseur de la bordure pour garder la même taille.
  const borderFix = variant === "outline" ? "px-[calc(1.7em-2px)] py-[calc(0.85em-2px)]" : "";
  return cn(base, variants[variant], sizes[size], size === "default" && borderFix, className);
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, ...rest } = props;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a href={href} className={buttonClasses({ variant, size, className })}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

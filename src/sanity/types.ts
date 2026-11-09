/**
 * Types des contenus lus dans Sanity, sous la forme attendue par les composants.
 */
import type { Inline as BaseInline, Paragraph } from "@/components/ui/RichText";

export type { Inline, Paragraph } from "@/components/ui/RichText";

export type Link = { label: string; href: string };

export type ContentImage = { src: string; alt: string; width?: number; height?: number };

/* Ateliers */

export type Tone = "garance" | "garance-dark" | "ink";

export type Workshop = {
  anchor: string;
  kicker: string;
  title: string;
  subtitle: string;
  hook: string;
  facts: { label: string; value: string }[];
  paragraphs: Paragraph[];
  /** Photo de l’atelier, sinon cadre provisoire de la couleur indiquée. */
  image?: ContentImage;
  placeholder: Tone;
};

/* Événements */

export type EventType = "atelier" | "festival" | "conference" | "autre";

export type NeoEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  hours?: string;
  place?: string;
  placeUrl?: string;
  placeUrlLabel?: string;
  type: EventType;
  /** 2–3 phrases, affichées sur l’accueil */
  excerpt?: string;
  /** Texte complet (modale du calendrier) : un paragraphe par entrée */
  body: Paragraph[];
  image?: ContentImage;
};

/* Partenaires */

export type Partner = {
  name: string;
  /** Texte alternatif du logo */
  logoAlt: string;
  logo: { src: string; width: number; height: number };
  description?: string;
  url?: string;
};

/* Avis */

export type Review = {
  id: string;
  name: string;
  title?: string;
  rating: number;
  text: string;
  /** ISO « AAAA-MM-JJ » */
  createdAt: string;
};

/* Contact */

/** Morceau de réponse de la FAQ : texte simple ou lien. */
export type RichPart = string | { text: string; href: string; external?: boolean };

export type FaqItem = { question: string; answer: RichPart[] };

/* À propos */

export type EngagementTone = "garance" | "outline" | "ink";

export type TeamMember = {
  name: string;
  role: string;
  bio: string[];
  photoTone: "garance" | "ink";
  photo?: ContentImage;
  link?: { intro: string; label: string; href: string };
};

/* Pages légales */

/** Texte enrichi des pages légales, plus l’exposant (« 1er » juillet 1901). */
export type LegalInline = BaseInline | { sup: string };
export type LegalParagraph = string | LegalInline[];
export type LegalSection = { title: string; paragraphs: LegalParagraph[] };

/** Morceau de texte de la politique de confidentialité. `cookies` = bouton « Gérer mes cookies ». */
export type PrivacyInline =
  | string
  | { strong: string }
  | { code: string }
  | { sup: string }
  | { br: true }
  | { link: string; href: string }
  | { cookies: string };
export type PrivacyText = string | PrivacyInline[];

/** Bloc d’une section : paragraphe, liste à puces ou intertitre (H3) suivi de sa liste. */
export type PrivacyBlock =
  | { type: "p"; text: PrivacyText }
  | { type: "ul"; items: PrivacyText[] }
  | { type: "h3"; title: string; items: PrivacyText[] };

export type PrivacySection = { anchor: string; title: string; blocks: PrivacyBlock[] };

/* Bandeau cookies */

export type CookieBannerContent = {
  title: string;
  message: string;
  accept: string;
  deny: string;
  customize: string;
  save: string;
  alwaysActive: string;
  categories: {
    functional: { title: string; description: string };
    statistics: { title: string; description: string };
  };
};

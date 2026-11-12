import type { SchemaTypeDefinition } from "sanity"

import { event } from "./documents/event"
import { faqItem } from "./documents/faqItem"
import { partner } from "./documents/partner"
import { review } from "./documents/review"
import { reviewPrivate } from "./documents/reviewPrivate"
import { teamMember } from "./documents/teamMember"
import { workshop } from "./documents/workshop"

import { aProposPage } from "./singletons/aProposPage"
import { ateliersPage } from "./singletons/ateliersPage"
import { calendrierPage } from "./singletons/calendrierPage"
import { contactPage } from "./singletons/contactPage"
import { cookieBanner } from "./singletons/cookieBanner"
import { homePage } from "./singletons/homePage"
import { livreDorPage } from "./singletons/livreDorPage"
import { mentionsLegalesPage } from "./singletons/mentionsLegalesPage"
import { partenairesPage } from "./singletons/partenairesPage"
import { politiqueConfidentialitePage } from "./singletons/politiqueConfidentialitePage"
import { siteSettings } from "./singletons/siteSettings"

export const schemaTypes: SchemaTypeDefinition[] = [
  // Contenus réutilisables (plusieurs documents)
  event,
  partner,
  review,
  reviewPrivate,
  workshop,
  teamMember,
  faqItem,

  // Pages et réglages (un seul document par type)
  siteSettings,
  cookieBanner,
  homePage,
  ateliersPage,
  calendrierPage,
  partenairesPage,
  livreDorPage,
  aProposPage,
  contactPage,
  mentionsLegalesPage,
  politiqueConfidentialitePage,
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}

/**
 * Types qui ne doivent exister qu'en un seul exemplaire.
 * Les documents correspondants utilisent leur nom de type comme identifiant.
 */
export const singletonTypes = new Set([
  "siteSettings",
  "cookieBanner",
  "homePage",
  "ateliersPage",
  "calendrierPage",
  "partenairesPage",
  "livreDorPage",
  "aProposPage",
  "contactPage",
  "mentionsLegalesPage",
  "politiqueConfidentialitePage",
])

/** Identifiants fixes des documents uniques, utilisés par la navigation du Studio. */
/** Types qu’on ne crée jamais à la main depuis le menu « Créer ». */
export const hiddenFromCreateTypes = new Set(["reviewPrivate"])

export const singletonIds: Record<string, string> = Object.fromEntries(
  [...singletonTypes].map((type) => [type, type]),
)

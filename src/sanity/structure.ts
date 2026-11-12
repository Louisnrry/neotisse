import { CalendarIcon } from "@sanity/icons/Calendar"
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle"
import { ClockIcon } from "@sanity/icons/Clock"
import { CloseCircleIcon } from "@sanity/icons/CloseCircle"
import { CogIcon } from "@sanity/icons/Cog"
import { CommentIcon } from "@sanity/icons/Comment"
import { ComponentIcon } from "@sanity/icons/Component"
import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { DocumentsIcon } from "@sanity/icons/Documents"
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe"
import { HelpCircleIcon } from "@sanity/icons/HelpCircle"
import { HomeIcon } from "@sanity/icons/Home"
import { LockIcon } from "@sanity/icons/Lock"
import { StarIcon } from "@sanity/icons/Star"
import { UserIcon } from "@sanity/icons/User"
import { UsersIcon } from "@sanity/icons/Users"
import type { ElementType } from "react"
import { map } from "rxjs"
import type { DefaultDocumentNodeResolver, StructureResolver } from "sanity/structure"

import { apiVersion } from "./env"
import { singletonIds } from "./schemaTypes"
import { ReviewPrivateView } from "./studio/ReviewPrivateView"

/** Avis en attente (versions publiées : celles que crée le formulaire du site). */
const PENDING_COUNT = `count(*[_type == "review" && status == "pending" && !(_id in path("drafts.**"))])`

/** « Avis (2 à modérer) », ou « Avis » s’il n’y a rien à modérer. */
const withCount = (title: string, count: number) => (count > 0 ? `${title} (${count} à modérer)` : title)

/** Chaque avis a un onglet « Coordonnées privées » (e-mail et IP, jamais publics). */
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) =>
  schemaType === "review"
    ? S.document().views([
        S.view.form().title("Avis"),
        S.view.component(ReviewPrivateView).title("Coordonnées privées").icon(LockIcon),
      ])
    : S.document()

type SingletonDefinition = {
  type: string
  title: string
  icon: ElementType
}

const siteSettingsItem: SingletonDefinition = {
  type: "siteSettings",
  title: "Réglages du site",
  icon: CogIcon,
}

const pageItems: SingletonDefinition[] = [
  { type: "homePage", title: "Accueil", icon: HomeIcon },
  { type: "ateliersPage", title: "Ateliers", icon: ComponentIcon },
  { type: "calendrierPage", title: "Calendrier", icon: CalendarIcon },
  { type: "partenairesPage", title: "Partenaires", icon: EarthGlobeIcon },
  { type: "livreDorPage", title: "Livre d’or", icon: StarIcon },
  { type: "aProposPage", title: "À propos", icon: UserIcon },
  { type: "contactPage", title: "Contact", icon: CommentIcon },
  { type: "mentionsLegalesPage", title: "Mentions légales", icon: DocumentTextIcon },
  {
    type: "politiqueConfidentialitePage",
    title: "Politique de confidentialité",
    icon: LockIcon,
  },
]

// Le menu est recalculé à chaque changement du nombre d’avis à modérer.
export const structure: StructureResolver = (S, context) =>
  context.documentStore
    .listenQuery(PENDING_COUNT, {}, { tag: "avis-a-moderer" })
    .pipe(map((count) => buildStructure(S, Number(count) || 0)))

function buildStructure(S: Parameters<StructureResolver>[0], pending: number) {
  const singletonItem = ({ type, title, icon }: SingletonDefinition) =>
    S.listItem()
      .title(title)
      .icon(icon)
      .child(
        S.document()
          .schemaType(type)
          .documentId(singletonIds[type])
          .title(title),
      )

  return S.list()
    .title("Contenu")
    .items([
      singletonItem(siteSettingsItem),
      singletonItem({ type: "cookieBanner", title: "Bandeau cookies", icon: LockIcon }),
      S.divider(),
      S.listItem()
        .title("Pages du site")
        .icon(DocumentsIcon)
        .child(S.list().title("Pages du site").items(pageItems.map(singletonItem))),
      S.divider(),
      S.documentTypeListItem("event").title("Événements").icon(CalendarIcon),
      S.documentTypeListItem("workshop").title("Ateliers").icon(ComponentIcon),
      S.documentTypeListItem("partner").title("Partenaires").icon(EarthGlobeIcon),
      S.documentTypeListItem("teamMember").title("Équipe").icon(UsersIcon),
      S.documentTypeListItem("faqItem").title("Questions fréquentes").icon(HelpCircleIcon),
      S.divider(),
      S.listItem()
        .id("avis")
        .title(withCount("Avis", pending))
        .icon(StarIcon)
        .child(
          S.list()
            .title("Avis")
            .items([
              S.listItem()
                .id("a-moderer")
                .title(pending > 0 ? `À modérer (${pending})` : "À modérer")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("Avis à modérer")
                    .apiVersion(apiVersion)
                    .filter('_type == "review" && status == "pending"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.listItem()
                .id("publies")
                .title("Publiés")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title("Avis publiés")
                    .apiVersion(apiVersion)
                    .filter('_type == "review" && status == "approved"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.listItem()
                .id("refuses")
                .title("Refusés")
                .icon(CloseCircleIcon)
                .child(
                  S.documentList()
                    .title("Avis refusés")
                    .apiVersion(apiVersion)
                    .filter('_type == "review" && status == "rejected"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.divider(),
              S.listItem()
                .id("tous")
                .title("Tous les avis")
                .icon(StarIcon)
                .child(S.documentTypeList("review").title("Tous les avis")),
            ]),
        ),
    ])
}

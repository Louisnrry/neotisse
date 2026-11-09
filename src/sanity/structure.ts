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
import type { StructureResolver } from "sanity/structure"

import { singletonIds } from "./schemaTypes"

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

export const structure: StructureResolver = (S) => {
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
        .title("Avis")
        .icon(StarIcon)
        .child(
          S.list()
            .title("Avis")
            .items([
              S.listItem()
                .title("À modérer")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("Avis à modérer")
                    .filter('_type == "review" && status == "pending"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Publiés")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title("Avis publiés")
                    .filter('_type == "review" && status == "approved"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Refusés")
                .icon(CloseCircleIcon)
                .child(
                  S.documentList()
                    .title("Avis refusés")
                    .filter('_type == "review" && status == "rejected"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.divider(),
              S.listItem()
                .title("Tous les avis")
                .icon(StarIcon)
                .child(S.documentTypeList("review").title("Tous les avis")),
            ]),
        ),
    ])
}

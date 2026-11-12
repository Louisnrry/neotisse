/**
 * Modération des avis dans le Studio :
 * - boutons « Approuver » et « Refuser » qui changent le statut **et publient** en un clic ;
 * - badge de statut en bas de la fiche.
 *
 * Refuser supprime aussi les coordonnées privées de l’avis (e-mail et IP) : on ne garde pas
 * de données personnelles pour un avis qui ne sera pas publié.
 */
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle"
import { CloseCircleIcon } from "@sanity/icons/CloseCircle"
import { useState } from "react"
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
  type DocumentBadgeComponent,
} from "sanity"

import { apiVersion } from "../env"
import { reviewPrivateId } from "../lib/reviewPrivate"
import type { ReviewStatus } from "../schemaTypes/documents/review"

const statusOf = (props: Pick<DocumentActionProps, "draft" | "published">) =>
  (props.draft ?? props.published)?.status as ReviewStatus | undefined

/** Change le statut puis publie ; `busy` tant que la publication n’est pas revenue. */
function useSetStatus(props: DocumentActionProps, target: ReviewStatus) {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  // Révision publiée au moment du clic : on attend qu’une nouvelle version publiée arrive.
  const [startedFrom, setStartedFrom] = useState<string | null | undefined>(undefined)
  const done = !props.draft && props.published?.status === target
  const busy = startedFrom !== undefined && !done && (props.published?._rev ?? null) === startedFrom

  const run = () => {
    setStartedFrom(props.published?._rev ?? null)
    patch.execute([{ set: { status: target } }])
    publish.execute()
  }
  const alreadyThere = statusOf(props) === target && !props.draft
  return { busy, run, alreadyThere }
}

export const ApproveReviewAction: DocumentActionComponent = (props) => {
  const { busy, run, alreadyThere } = useSetStatus(props, "approved")
  return {
    label: busy ? "Publication…" : alreadyThere ? "Publié" : "Approuver",
    icon: CheckmarkCircleIcon,
    tone: "positive",
    disabled: busy || alreadyThere,
    title: alreadyThere ? "Cet avis est déjà affiché sur le site." : "Afficher cet avis sur le site.",
    onHandle: () => {
      run()
      props.onComplete()
    },
  }
}

export const RejectReviewAction: DocumentActionComponent = (props) => {
  const { busy, run, alreadyThere } = useSetStatus(props, "rejected")
  const client = useClient({ apiVersion })
  const [confirming, setConfirming] = useState(false)
  return {
    label: busy ? "Enregistrement…" : alreadyThere ? "Refusé" : "Refuser",
    icon: CloseCircleIcon,
    tone: "critical",
    disabled: busy || alreadyThere,
    title: "Ne pas afficher cet avis et supprimer ses coordonnées privées.",
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      tone: "critical",
      message:
        "L’avis ne sera pas affiché sur le site. Son adresse e-mail et son adresse IP seront supprimées définitivement.",
      onCancel: () => setConfirming(false),
      onConfirm: () => {
        setConfirming(false)
        run()
        client.delete(reviewPrivateId(props.id)).catch((error) => {
          console.error("[avis] suppression des coordonnées privées en échec", error)
        })
        props.onComplete()
      },
    },
  }
}

const badges: Record<ReviewStatus, { label: string; color: "warning" | "success" | "danger" }> = {
  pending: { label: "À modérer", color: "warning" },
  approved: { label: "Publié sur le site", color: "success" },
  rejected: { label: "Refusé", color: "danger" },
}

export const ReviewStatusBadge: DocumentBadgeComponent = (props) => {
  // Le badge montre l’état visible sur le site : celui de la version publiée.
  const status = props.published?.status as ReviewStatus | undefined
  return status ? badges[status] : null
}

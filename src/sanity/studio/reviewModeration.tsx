/**
 * Modération des avis dans le Studio :
 * - boutons « Approuver » et « Refuser » qui changent le statut **et publient** en un clic ;
 * - badge de statut en bas de la fiche.
 *
 * - « Supprimer » remplacé : l’avis et ses coordonnées privées partent ensemble.
 *
 * Refuser supprime aussi les coordonnées privées de l’avis (e-mail et IP) : on ne garde pas
 * de données personnelles pour un avis qui ne sera pas publié. Refuser et Supprimer passent
 * par une seule transaction Sanity (tout ou rien), avec un message si elle échoue.
 */
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle"
import { CloseCircleIcon } from "@sanity/icons/CloseCircle"
import { TrashIcon } from "@sanity/icons/Trash"
import { useToast } from "@sanity/ui"
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

type Transaction = ReturnType<ReturnType<typeof useClient>["transaction"]>

/** Exécute une transaction Sanity et affiche un message d’erreur si elle échoue. */
function useTransactionRunner() {
  const client = useClient({ apiVersion })
  const toast = useToast()
  const [working, setWorking] = useState(false)
  const runTransaction = async (build: (tx: Transaction) => Transaction, errorTitle: string) => {
    setWorking(true)
    try {
      await build(client.transaction()).commit()
      return true
    } catch (error) {
      console.error(`[avis] ${errorTitle}`, error)
      toast.push({
        status: "error",
        title: errorTitle,
        description: "Rien n’a été modifié. Réessayez dans quelques instants.",
      })
      return false
    } finally {
      setWorking(false)
    }
  }
  return { working, runTransaction }
}

/**
 * Refuser : en une seule transaction, l’avis passe en « Refusé » (version publiée), son brouillon
 * éventuel est abandonné et ses coordonnées privées sont supprimées. Tout ou rien.
 */
export const RejectReviewAction: DocumentActionComponent = (props) => {
  const { working, runTransaction } = useTransactionRunner()
  const [confirming, setConfirming] = useState(false)
  const alreadyThere = statusOf(props) === "rejected" && !props.draft
  return {
    label: working ? "Enregistrement…" : alreadyThere ? "Refusé" : "Refuser",
    icon: CloseCircleIcon,
    tone: "critical",
    disabled: working || alreadyThere,
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
        void runTransaction((tx) => {
          if (props.published) {
            tx.patch(props.id, (p) => p.set({ status: "rejected" }))
          } else if (props.draft) {
            // Avis jamais publié (saisi à la main) : on publie sa version « Refusé ».
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _rev, _createdAt, _updatedAt, ...draft } = props.draft
            tx.createOrReplace({ ...draft, _id: props.id, status: "rejected" })
          }
          if (props.draft) tx.delete(props.draft._id)
          return tx.delete(reviewPrivateId(props.id))
        }, "Le refus de l’avis a échoué").then(() => props.onComplete())
      },
    },
  }
}

/**
 * Supprimer : remplace le bouton d’origine pour les avis. En une seule transaction,
 * supprime l’avis (version publiée et brouillon) et ses coordonnées privées : jamais
 * d’adresse e-mail ou IP orpheline.
 */
export const DeleteReviewAction: DocumentActionComponent = (props) => {
  const { working, runTransaction } = useTransactionRunner()
  const [confirming, setConfirming] = useState(false)
  return {
    label: working ? "Suppression…" : "Supprimer",
    icon: TrashIcon,
    tone: "critical",
    disabled: working || (!props.published && !props.draft),
    title: "Supprimer définitivement cet avis et ses coordonnées privées.",
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      tone: "critical",
      message:
        "L’avis et ses coordonnées privées (adresse e-mail et adresse IP) seront supprimés définitivement. Cette action est irréversible.",
      onCancel: () => setConfirming(false),
      onConfirm: () => {
        setConfirming(false)
        void runTransaction((tx) => {
          if (props.published) tx.delete(props.published._id)
          if (props.draft) tx.delete(props.draft._id)
          return tx.delete(reviewPrivateId(props.id))
        }, "La suppression de l’avis a échoué").then(() => props.onComplete())
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

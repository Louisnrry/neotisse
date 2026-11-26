'use client'

/**
 * Configuration du Studio Sanity embarqué dans l’application Next.js.
 * Le Studio est disponible sur /studio.
 */

import { BarChartIcon } from '@sanity/icons/BarChart'
import { frFRLocale } from '@sanity/locale-fr-fr'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { hiddenFromCreateTypes, schema, singletonTypes } from './src/sanity/schemaTypes'
import { defaultDocumentNode, structure } from './src/sanity/structure'
import {
  ApproveReviewAction,
  DeleteReviewAction,
  RejectReviewAction,
  ReviewStatusBadge,
} from './src/sanity/studio/reviewModeration'
import { StatsTool } from './src/sanity/studio/stats/StatsTool'

export default defineConfig({
  basePath: '/studio',
  title: 'Néotisse',
  projectId,
  dataset,
  schema,
  document: {
    // Les pages et réglages sont des documents uniques : on empêche
    // la création de doublons depuis le menu « Créer ».
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(
            (template) =>
              !singletonTypes.has(template.templateId) &&
              !hiddenFromCreateTypes.has(template.templateId),
          )
        : prev,
    actions: (prev, { schemaType }) => {
      // On évite de supprimer ou dupliquer accidentellement un document unique.
      if (singletonTypes.has(schemaType)) {
        return prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate')
      }
      // Avis : « Approuver » et « Refuser » publient en un clic. On n’en duplique pas, et
      // « Supprimer » est remplacé pour effacer aussi l’e-mail et l’IP de l’avis.
      if (schemaType === 'review') {
        return [
          ApproveReviewAction,
          RejectReviewAction,
          ...prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete'),
          DeleteReviewAction,
        ]
      }
      // Messages de contact : lecture seule. Ni publication, ni duplication, ni suppression.
      if (schemaType === 'contactMessage') return []
      return prev
    },
    badges: (prev, { schemaType }) =>
      schemaType === 'review' ? [ReviewStatusBadge, ...prev] : prev,
  },
  // Onglet « Statistiques » : chiffres de Google Analytics et avis (voir src/sanity/studio/stats/).
  tools: (prev) => [
    ...prev,
    { name: 'statistiques', title: 'Statistiques', icon: BarChartIcon, component: StatsTool },
  ],
  plugins: [
    frFRLocale(),
    structureTool({ structure, defaultDocumentNode }),
    // Vision permet d’interroger le contenu avec GROQ depuis le Studio.
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})

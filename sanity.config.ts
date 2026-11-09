'use client'

/**
 * Configuration du Studio Sanity embarqué dans l’application Next.js.
 * Le Studio est disponible sur /studio.
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema, singletonTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

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
        ? prev.filter((template) => !singletonTypes.has(template.templateId))
        : prev,
    // Et on évite de supprimer ou dupliquer accidentellement un document unique.
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate')
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    // Vision permet d’interroger le contenu avec GROQ depuis le Studio.
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})

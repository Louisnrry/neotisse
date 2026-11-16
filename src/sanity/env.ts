/**
 * Configuration Sanity partagée (site, Studio, CLI).
 * L’ID de projet et le dataset sont publics (envoyés au navigateur de toute façon) :
 * ils ont une valeur par défaut pour que le build passe même si les variables
 * ne sont pas renseignées sur l’hébergeur (Netlify). Les variables d’environnement
 * restent prioritaires.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-11-09'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 't4k96qs7'

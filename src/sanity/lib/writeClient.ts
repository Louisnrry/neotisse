/**
 * Client Sanity avec droits d’écriture : **serveur uniquement** (routes API).
 * Le token `SANITY_API_WRITE_TOKEN` n’est jamais envoyé au navigateur.
 */
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

if (typeof window !== "undefined") {
  throw new Error("Le client d’écriture Sanity ne doit jamais être utilisé dans le navigateur.");
}

/** Client d’écriture, ou `null` si le token n’est pas configuré. */
export function getWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

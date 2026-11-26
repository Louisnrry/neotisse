/**
 * Formulaire de contact : reçoit un message et l’enregistre dans Sanity (type `contactMessage`),
 * où l’association le lit, en lecture seule (Studio → Messages de contact).
 *
 * Données personnelles : le document a pour identifiant `contact.<uuid>`. Sanity ne rend jamais
 * publics les documents dont l’identifiant contient un point, même sur un dataset public.
 *
 * Anti-spam : champ piège, délai minimal de 2 s, validation serveur, et au plus 5 messages
 * par adresse IP et par heure (comptés dans Sanity, donc valables sur tous les serveurs Netlify).
 *
 * TODO : envoyer aussi un e-mail à l’association (service d’envoi à choisir, CLAUDE.md § 7.4).
 */
import { CONTACT_MIN_DELAY_MS, validateContact, type ContactValues } from "@/lib/contactForm";
import { getWriteClient } from "@/sanity/lib/writeClient";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const RECENT_FROM_IP = `count(*[_type == "contactMessage" && ip == $ip && createdAt > $since])`;

/** Adresse IP du visiteur (Netlify, puis proxys standards). */
function clientIp(request: Request) {
  const h = request.headers;
  return (
    h.get("x-nf-client-connection-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "inconnue"
  );
}

const json = (body: unknown, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }

  const str = (k: string) => (typeof payload[k] === "string" ? (payload[k] as string) : "");
  // Robot : champ piège rempli ou envoi trop rapide → réponse « ok », mais rien n’est enregistré.
  if (str("site") || Number(payload.elapsed) < CONTACT_MIN_DELAY_MS) return json({ ok: true }, 201);

  const values: ContactValues = {
    nom: str("nom").trim(),
    prenom: str("prenom").trim(),
    email: str("email").trim(),
    objet: str("objet").trim(),
    projet: str("projet").trim(),
  };
  const errors = validateContact(values);
  if (Object.keys(errors).length) return json({ errors }, 400);

  const client = getWriteClient();
  if (!client) {
    console.error("[contact] SANITY_API_WRITE_TOKEN manquant : le message n’a pas pu être enregistré.");
    return json({ error: "Le formulaire est momentanément indisponible. Écrivez-nous directement par e-mail." }, 503);
  }

  const ip = clientIp(request);
  const now = new Date();
  try {
    const since = new Date(now.getTime() - RATE_WINDOW_MS).toISOString();
    const recent = await client.fetch<number>(RECENT_FROM_IP, { ip, since });
    if (recent >= RATE_LIMIT) return json({ error: "Trop d’envois en peu de temps. Réessayez plus tard." }, 429);
  } catch (error) {
    // Le comptage a échoué : on n’empêche pas l’envoi pour autant.
    console.error("[contact] comptage des envois en échec", error);
  }

  try {
    await client.create({
      _id: `contact.${crypto.randomUUID()}`,
      _type: "contactMessage",
      lastName: values.nom,
      firstName: values.prenom,
      email: values.email,
      subject: values.objet,
      message: values.projet,
      ip,
      createdAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[contact] enregistrement du message en échec", error);
    return json({ error: "L’envoi a échoué. Réessayez dans quelques instants." }, 500);
  }
  return json({ ok: true }, 201);
}

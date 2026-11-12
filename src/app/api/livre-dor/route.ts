/**
 * Livre d’or : reçoit un avis et le crée dans Sanity avec le statut « À modérer ».
 * Seule l’association le publie, depuis le Studio (Avis → À modérer → « Approuver »).
 *
 * Données privées : l’avis (nom, titre, note, texte) et ses coordonnées (e-mail, IP) sont
 * deux documents distincts, créés dans la même transaction. Les coordonnées vont dans
 * `private.<identifiant de l’avis>` : Sanity ne rend jamais publics les documents dont
 * l’identifiant contient un point, même sur un dataset public.
 *
 * Anti-spam : champ piège, délai minimal de 2 s, case « pas un robot », validation serveur,
 * et au plus 5 avis par adresse IP et par heure (comptés dans Sanity, donc valables
 * quel que soit le serveur qui reçoit la requête).
 */
import { GUESTBOOK_MIN_DELAY_MS, validateGuestbook, type GuestbookValues } from "@/lib/guestbook";
import { reviewPrivateId } from "@/sanity/lib/reviewPrivate";
import { getWriteClient } from "@/sanity/lib/writeClient";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const RECENT_FROM_IP = `count(*[_type == "reviewPrivate" && ip == $ip && createdAt > $since])`;

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
  if (str("site") || Number(payload.elapsed) < GUESTBOOK_MIN_DELAY_MS) return json({ ok: true }, 201);

  const values: GuestbookValues = {
    nom: str("nom").trim(),
    email: str("email").trim(),
    titre: str("titre").trim(),
    note: str("note"),
    avis: str("avis").trim(),
    robot: str("robot"),
  };
  const errors = validateGuestbook(values);
  if (Object.keys(errors).length) return json({ errors }, 400);

  const client = getWriteClient();
  if (!client) {
    console.error("[livre-dor] SANITY_API_WRITE_TOKEN manquant : l’avis n’a pas pu être enregistré.");
    return json({ error: "Le livre d’or est momentanément indisponible." }, 503);
  }

  const ip = clientIp(request);
  const now = new Date();
  try {
    const since = new Date(now.getTime() - RATE_WINDOW_MS).toISOString();
    const recent = await client.fetch<number>(RECENT_FROM_IP, { ip, since });
    if (recent >= RATE_LIMIT) return json({ error: "Trop d’envois en peu de temps. Réessayez plus tard." }, 429);
  } catch (error) {
    // Le comptage a échoué : on n’empêche pas l’envoi pour autant.
    console.error("[livre-dor] comptage des envois en échec", error);
  }

  const reviewId = `review-${crypto.randomUUID()}`;
  const createdAt = now.toISOString();
  try {
    await client
      .transaction()
      .create({
        _id: reviewId,
        _type: "review",
        status: "pending",
        name: values.nom,
        ...(values.titre && { title: values.titre }),
        rating: Number(values.note),
        text: values.avis,
        createdAt,
      })
      .create({
        _id: reviewPrivateId(reviewId),
        _type: "reviewPrivate",
        reviewId,
        email: values.email,
        ip,
        createdAt,
      })
      .commit();
  } catch (error) {
    console.error("[livre-dor] création de l’avis en échec", error);
    return json({ error: "L’envoi a échoué. Réessayez dans quelques instants." }, 500);
  }
  return json({ ok: true }, 201);
}

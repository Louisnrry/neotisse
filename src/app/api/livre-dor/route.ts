/**
 * Livre d’or : reçoit un avis et le crée dans Sanity avec le statut « À modérer ».
 * Seule l’association le publie, depuis le Studio (Avis → À modérer).
 *
 * Anti-spam : champ piège, délai minimal de 2 s, case « pas un robot », validation serveur,
 * et au plus 5 avis par adresse IP et par heure (compteur en mémoire, par instance du serveur).
 */
import { GUESTBOOK_MIN_DELAY_MS, validateGuestbook, type GuestbookValues } from "@/lib/guestbook";
import { getWriteClient } from "@/sanity/lib/writeClient";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const recent = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

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

  const ip = clientIp(request);
  if (tooMany(ip)) return json({ error: "Trop d’envois en peu de temps. Réessayez plus tard." }, 429);

  const client = getWriteClient();
  if (!client) {
    console.error("[livre-dor] SANITY_API_WRITE_TOKEN manquant : l’avis n’a pas pu être enregistré.");
    return json({ error: "Le livre d’or est momentanément indisponible." }, 503);
  }

  try {
    await client.create({
      _type: "review",
      name: values.nom,
      email: values.email,
      ...(values.titre && { title: values.titre }),
      rating: Number(values.note),
      text: values.avis,
      status: "pending",
      createdAt: new Date().toISOString(),
      ip,
    });
  } catch (error) {
    console.error("[livre-dor] création de l’avis en échec", error);
    return json({ error: "L’envoi a échoué. Réessayez dans quelques instants." }, 500);
  }
  return json({ ok: true }, 201);
}

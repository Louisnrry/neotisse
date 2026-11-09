/**
 * Livre d’or : validation partagée entre le formulaire (navigateur) et la route API (serveur).
 */

export type GuestbookValues = { nom: string; email: string; titre: string; note: string; avis: string; robot: string };
export type GuestbookErrors = Partial<Record<keyof GuestbookValues, string>>;

export const guestbookLimits = { nom: 150, email: 150, titre: 150, avis: 2000 } as const;

/** Délai minimal entre l’affichage du formulaire et l’envoi (anti-robot). */
export const GUESTBOOK_MIN_DELAY_MS = 2000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateGuestbook(v: GuestbookValues): GuestbookErrors {
  const e: GuestbookErrors = {};
  const note = Number(v.note);
  if (!v.nom.trim()) e.nom = "Indiquez votre nom.";
  else if (v.nom.length > guestbookLimits.nom) e.nom = "Ce nom est trop long.";
  if (!v.email.trim()) e.email = "Indiquez votre adresse e-mail.";
  else if (!emailPattern.test(v.email.trim()) || v.email.length > guestbookLimits.email)
    e.email = "Cette adresse e-mail ne semble pas valide.";
  if (v.titre.length > guestbookLimits.titre) e.titre = "Ce titre est trop long.";
  if (!v.note) e.note = "Choisissez une note de 1 à 5 étoiles.";
  else if (!Number.isInteger(note) || note < 1 || note > 5) e.note = "Choisissez une note de 1 à 5 étoiles.";
  if (!v.avis.trim()) e.avis = "Écrivez quelques mots sur votre expérience.";
  else if (v.avis.length > guestbookLimits.avis) e.avis = `Votre avis dépasse ${guestbookLimits.avis} caractères.`;
  if (!v.robot) e.robot = "Cochez la case pour confirmer que vous n’êtes pas un robot.";
  return e;
}

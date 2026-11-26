/**
 * Formulaire de contact : validation partagée entre le formulaire (navigateur) et la route API (serveur).
 */

export type ContactValues = { nom: string; prenom: string; email: string; objet: string; projet: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const contactLimits = { nom: 150, prenom: 150, email: 150, objet: 200, projet: 5000 } as const;

/** Délai minimal entre l’affichage du formulaire et l’envoi (anti-robot). */
export const CONTACT_MIN_DELAY_MS = 2000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (!v.nom.trim()) e.nom = "Indiquez votre nom.";
  else if (v.nom.length > contactLimits.nom) e.nom = "Ce nom est trop long.";
  if (!v.prenom.trim()) e.prenom = "Indiquez votre prénom.";
  else if (v.prenom.length > contactLimits.prenom) e.prenom = "Ce prénom est trop long.";
  if (!v.email.trim()) e.email = "Indiquez votre adresse e-mail.";
  else if (!emailPattern.test(v.email.trim()) || v.email.length > contactLimits.email)
    e.email = "Cette adresse e-mail ne semble pas valide.";
  if (!v.objet.trim()) e.objet = "Indiquez l’objet de votre message.";
  else if (v.objet.length > contactLimits.objet) e.objet = "Cet objet est trop long.";
  if (!v.projet.trim()) e.projet = "Parlez-nous de votre projet.";
  else if (v.projet.length > contactLimits.projet) e.projet = `Votre message dépasse ${contactLimits.projet} caractères.`;
  return e;
}

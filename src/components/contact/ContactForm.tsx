"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormMessage, TextArea, TextField } from "@/components/ui/Field";
import { contactPage } from "@/content/contact";

type Values = { nom: string; prenom: string; email: string; objet: string; projet: string };
type Errors = Partial<Record<keyof Values, string>>;

/** Libellé suivi d’un astérisque garance (le caractère obligatoire est porté par l’attribut `required`). */
function Required({ children }: { children: string }) {
  return (
    <>
      {children} <span aria-hidden="true" className="font-normal text-garance">*</span>
    </>
  );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.nom.trim()) e.nom = "Indiquez votre nom.";
  if (!v.prenom.trim()) e.prenom = "Indiquez votre prénom.";
  if (!v.email.trim()) e.email = "Indiquez votre adresse e-mail.";
  else if (!emailPattern.test(v.email.trim())) e.email = "Cette adresse e-mail ne semble pas valide.";
  if (!v.objet.trim()) e.objet = "Indiquez l’objet de votre message.";
  if (!v.projet.trim()) e.projet = "Parlez-nous de votre projet.";
  return e;
}

/**
 * Formulaire « Écrivez-nous » (CLAUDE.md § 7.4) : Nom et Prénom sur deux colonnes (une seule sous 521px),
 * e-mail, objet, projet, bouton « Envoyer ». Validation côté client, erreurs reliées par `aria-describedby`.
 * Anti-spam : champ piège caché + délai minimal de 2s.
 * TODO(phase 3) : envoyer vers une route API (e-mail via Resend, Reply-To = visiteur, validation serveur).
 * En attendant, un envoi valide affiche directement la confirmation.
 */
export function ContactForm() {
  const { form } = contactPage;
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Robot : champ piège rempli ou envoi trop rapide → on fait comme si de rien n’était.
    if (data.get("site") || Date.now() - startedAt.current < 2000) {
      setStatus("ok");
      return;
    }
    const values = Object.fromEntries(
      (["nom", "prenom", "email", "objet", "projet"] as const).map((k) => [k, String(data.get(k) ?? "")]),
    ) as Values;
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    // TODO(phase 3) : `await fetch("/api/contact", …)` puis gestion de l’erreur d’envoi.
    setStatus("ok");
  }

  if (status === "ok") {
    return (
      <FormMessage tone="ok">
        <strong className="font-bold">Merci, votre message est bien parti !</strong> Nous revenons vers vous très vite.
      </FormMessage>
    );
  }

  const field = (name: keyof Values) => ({
    id: `contact-${name}`,
    name,
    error: errors[name],
    onChange: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
  });

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5" aria-label={form.title}>
      <div className="grid gap-5 min-[521px]:grid-cols-2">
        <TextField {...field("nom")} label={<Required>Nom</Required>} autoComplete="family-name" required />
        <TextField {...field("prenom")} label={<Required>Prénom</Required>} autoComplete="given-name" required />
      </div>
      <TextField {...field("email")} label={<Required>Adresse e-mail</Required>} type="email" autoComplete="email" spellCheck={false} required />
      <TextField {...field("objet")} label={<Required>Objet</Required>} placeholder={form.subjectPlaceholder} required />
      <TextArea {...field("projet")} label={<Required>Votre projet</Required>} placeholder={form.projectPlaceholder} required />

      {/* Champ piège pour les robots, invisible et hors tabulation */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-site">Site web</label>
        <input id="contact-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 34px entre le message et le bouton, comme la V1 */}
      <div className="mt-[14px]">
        <Button type="submit" size="large" aria-busy={status === "sending" || undefined} disabled={status === "sending"}>
          {status === "sending" ? form.sending : form.submit}
        </Button>
      </div>
    </form>
  );
}

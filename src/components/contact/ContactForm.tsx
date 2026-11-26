"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { FormMessage, TextArea, TextField } from "@/components/ui/Field";
import { CONTACT_MIN_DELAY_MS, validateContact, type ContactErrors, type ContactValues } from "@/lib/contactForm";
import type { ContactFormTexts } from "@/sanity/queries/contact";

type Values = ContactValues;
type Errors = ContactErrors;

/** Libellé suivi d’un astérisque garance (le caractère obligatoire est porté par l’attribut `required`). */
function Required({ children }: { children: string }) {
  return (
    <>
      {children} <span aria-hidden="true" className="font-normal text-garance">*</span>
    </>
  );
}

/**
 * Formulaire « Écrivez-nous » (CLAUDE.md § 7.4) : Nom et Prénom sur deux colonnes (une seule sous 521px),
 * e-mail, objet, projet, bouton « Envoyer ». Validation côté client, erreurs reliées par `aria-describedby`.
 * Anti-spam : champ piège caché + délai minimal de 2s.
 * Envoi à `POST /api/contact/`, qui valide à nouveau et enregistre le message dans Sanity
 * (Studio → Messages de contact, en lecture seule). TODO : e-mail à l’association en plus.
 */
const formId = "contact-form";

/** Champs un peu moins hauts sur un écran d’ordinateur peu haut (variante `short`, voir globals.css). */
const shortInput = "short:py-2.5 shorter:py-2";

export function ContactForm({
  form,
  heading,
  actionsClassName,
}: {
  form: ContactFormTexts;
  /** Titre « Écrivez-nous », rendu au-dessus des champs (et du message de confirmation). */
  heading?: ReactNode;
  /** Classes du bloc qui contient le bouton « Envoyer » (rangée partagée avec le bouton du livre d’or). */
  actionsClassName?: string;
}) {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok">("idle");
  const [sendError, setSendError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const elapsed = Date.now() - startedAt.current;
    // Robot : champ piège rempli ou envoi trop rapide → on fait comme si de rien n’était.
    if (data.get("site") || elapsed < CONTACT_MIN_DELAY_MS) {
      setStatus("ok");
      return;
    }
    const values = Object.fromEntries(
      (["nom", "prenom", "email", "objet", "projet"] as const).map((k) => [k, String(data.get(k) ?? "")]),
    ) as Values;
    const found = validateContact(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    setSendError("");
    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, site: String(data.get("site") ?? ""), elapsed }),
      });
      if (response.ok) {
        setStatus("ok");
        return;
      }
      const body = (await response.json().catch(() => ({}))) as { errors?: Errors; error?: string };
      if (body.errors) {
        setErrors(body.errors);
        const firstError = Object.keys(body.errors)[0];
        if (firstError) document.getElementById(`contact-${firstError}`)?.focus();
      } else {
        setSendError(body.error ?? "L’envoi a échoué. Réessayez dans quelques instants.");
      }
    } catch {
      setSendError("L’envoi a échoué. Vérifiez votre connexion puis réessayez.");
    }
    setStatus("idle");
  }

  if (status === "ok") {
    return (
      <div>
        {heading}
        <FormMessage tone="ok">
          <strong className="font-bold">Merci, votre message est bien parti !</strong> Nous revenons vers vous très vite.
        </FormMessage>
      </div>
    );
  }

  const field = (name: keyof Values) => ({
    id: `contact-${name}`,
    name,
    error: errors[name],
    onChange: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
  });

  // Deux blocs frères (champs, puis bouton) pour que la page aligne le bouton « Envoyer » sur celui du livre d’or :
  // le bouton est hors du <form> mais lui reste rattaché par l’attribut `form` (Entrée envoie toujours le formulaire).
  return (
    <>
      <div>
        {heading}
        <form id={formId} noValidate onSubmit={onSubmit} className="grid gap-5 short:gap-3.5 shorter:gap-3" aria-label={form.title}>
          <div className="grid gap-5 short:gap-3.5 shorter:gap-3 min-[521px]:grid-cols-2">
            <TextField {...field("nom")} inputClassName={shortInput} label={<Required>Nom</Required>} placeholder={form.lastNamePlaceholder} autoComplete="family-name" required />
            <TextField {...field("prenom")} inputClassName={shortInput} label={<Required>Prénom</Required>} placeholder={form.firstNamePlaceholder} autoComplete="given-name" required />
          </div>
          <TextField {...field("email")} inputClassName={shortInput} label={<Required>Adresse e-mail</Required>} type="email" placeholder={form.emailPlaceholder} autoComplete="email" spellCheck={false} required />
          <TextField {...field("objet")} inputClassName={shortInput} label={<Required>Objet</Required>} placeholder={form.subjectPlaceholder} required />
          <TextArea {...field("projet")} inputClassName={`${shortInput} short:h-24 short:min-h-24 shorter:h-20 shorter:min-h-20`} label={<Required>Votre projet</Required>} placeholder={form.projectPlaceholder} required />

          {/* Champ piège pour les robots, invisible et hors tabulation */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="contact-site">Site web</label>
            <input id="contact-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {sendError && <FormMessage tone="error">{sendError}</FormMessage>}
        </form>
      </div>

      {/* 34px entre le message et le bouton, comme la V1 */}
      <div className={actionsClassName}>
        <Button
          type="submit"
          form={formId}
          size="large"
          aria-busy={status === "sending" || undefined}
          disabled={status === "sending"}
        >
          {status === "sending" ? form.sending : form.submit}
        </Button>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormMessage, TextArea, TextField } from "@/components/ui/Field";
import { Card } from "@/components/ui/Media";
import {
  GUESTBOOK_MIN_DELAY_MS,
  validateGuestbook as validate,
  type GuestbookErrors as Errors,
  type GuestbookValues as Values,
} from "@/lib/guestbook";
import type { GuestbookFormTexts } from "@/sanity/queries/livreDor";


/** Libellé suivi d’un astérisque garance (l’obligation est portée par `required`). */
function Required({ children }: { children: string }) {
  return (
    <>
      {children} <span aria-hidden="true" className="font-normal text-garance">*</span>
    </>
  );
}

const starPath = "M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z";

/** Note en 5 étoiles : boutons radio natifs (flèches du clavier), étoiles dessinées par-dessus. */
function RatingInput({ error, onChange }: { error?: string; onChange: () => void }) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const lit = hover || value;
  return (
    <fieldset aria-describedby={error ? "avis-note-error" : undefined} className="grid gap-[7px]">
      <legend className="mb-[7px] text-small leading-[1.4] font-bold tracking-[0.04em]">
        <Required>Votre note</Required>
      </legend>
      <div
        className="flex w-fit gap-1 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-garance"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="relative cursor-pointer text-garance" onMouseEnter={() => setHover(n)}>
            <input
              type="radio"
              name="note"
              value={n}
              id={n === 1 ? "avis-note" : undefined}
              className="sr-only"
              onChange={() => {
                setValue(n);
                onChange();
              }}
            />
            <span className="sr-only">
              {n} étoile{n > 1 ? "s" : ""} sur 5
            </span>
            <svg viewBox="0 0 20 20" className="h-7 w-7" aria-hidden="true">
              <path
                d={starPath}
                fill={n <= lit ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </label>
        ))}
      </div>
      {error && (
        <p id="avis-note-error" className="text-[0.88rem] font-semibold text-garance-dark">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Formulaire « Signer le livre d’or » (CLAUDE.md § 6.5 et § 7.3), toujours ouvert, dans une carte à filet rouge :
 * Nom et E-mail sur deux colonnes (une seule sous 561px), titre, note, avis, case anti-robot, bouton « Envoyer ».
 * Anti-spam : champ piège caché + délai minimal de 2s (vérifiés aussi par le serveur).
 * L’avis est envoyé à `/api/livre-dor/`, qui le crée dans Sanity avec le statut « À modérer ».
 */
export function GuestbookForm({ form }: { form: GuestbookFormTexts }) {
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
    if (data.get("site") || elapsed < GUESTBOOK_MIN_DELAY_MS) {
      setStatus("ok");
      return;
    }
    const values = Object.fromEntries(
      (["nom", "email", "titre", "note", "avis", "robot"] as const).map((k) => [k, String(data.get(k) ?? "")]),
    ) as Values;
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`avis-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    setSendError("");
    try {
      const response = await fetch("/api/livre-dor/", {
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
        if (firstError) document.getElementById(`avis-${firstError}`)?.focus();
      } else {
        setSendError(body.error ?? "L’envoi a échoué. Réessayez dans quelques instants.");
      }
    } catch {
      setSendError("L’envoi a échoué. Vérifiez votre connexion puis réessayez.");
    }
    setStatus("idle");
  }

  const clear = (name: keyof Values) => () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined }));
  const field = (name: keyof Values) => ({ id: `avis-${name}`, name, error: errors[name], onChange: clear(name) });

  return (
    <Card className="p-[clamp(24px,4vw,40px)]">
      <h3 className="mb-6 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.1]">{form.cardTitle}</h3>

      {status === "ok" ? (
        <FormMessage tone="ok">
          <strong className="font-bold">Merci, votre avis est bien arrivé&nbsp;!</strong> Il sera publié après relecture par
          l’association.
        </FormMessage>
      ) : (
        <form noValidate onSubmit={onSubmit} className="grid gap-5" aria-label={form.title}>
          <div className="grid gap-5 min-[561px]:grid-cols-2">
            <TextField {...field("nom")} label={<Required>Nom</Required>} autoComplete="name" maxLength={150} required />
            <TextField
              {...field("email")}
              label={<Required>Adresse e-mail</Required>}
              type="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={150}
              required
            />
          </div>
          <TextField {...field("titre")} label="Titre de votre avis" maxLength={150} />
          <RatingInput error={errors.note} onChange={clear("note")} />
          <TextArea {...field("avis")} label={<Required>Votre avis</Required>} required />

          <div className="grid gap-[7px]">
            <Checkbox
              id="avis-robot"
              name="robot"
              value="1"
              label={form.robot}
              required
              aria-invalid={errors.robot ? true : undefined}
              aria-describedby={errors.robot ? "avis-robot-error" : undefined}
              onChange={clear("robot")}
            />
            {errors.robot && (
              <p id="avis-robot-error" className="text-[0.88rem] font-semibold text-garance-dark">
                {errors.robot}
              </p>
            )}
          </div>

          {/* Champ piège pour les robots, invisible et hors tabulation */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="avis-site">Site web</label>
            <input id="avis-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {sendError && <FormMessage tone="error">{sendError}</FormMessage>}

          <div className="mt-1">
            <Button type="submit" size="large" aria-busy={status === "sending" || undefined} disabled={status === "sending"}>
              {status === "sending" ? form.sending : form.submit}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

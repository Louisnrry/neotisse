import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full border border-champ bg-blanc p-3.5 font-sans text-base text-ink placeholder:text-gris/80 transition-[border-color,box-shadow] duration-200 focus:border-ink focus:shadow-[0_0_0_3px_rgb(200_54_31/0.18)] focus:outline-none aria-[invalid=true]:border-garance aria-[invalid=true]:bg-erreur-bg";

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

function FieldShell({ id, label, error, hint, className, children }: FieldShellProps) {
  return (
    <div className={cn("grid gap-[7px]", className)}>
      <label htmlFor={id} className="text-small font-bold tracking-[0.04em]">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-small text-gris">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[0.88rem] font-semibold text-garance-dark">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "className"> &
  Omit<FieldShellProps, "children">;

export function TextField({ id, label, error, hint, className, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <input
        id={id}
        className={control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
      />
    </FieldShell>
  );
}

type TextAreaProps = Omit<ComponentProps<"textarea">, "id" | "className"> &
  Omit<FieldShellProps, "children">;

export function TextArea({ id, label, error, hint, className, rows = 6, ...textarea }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        rows={rows}
        className={cn(control, "min-h-[150px] resize-y")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...textarea}
      />
    </FieldShell>
  );
}

/** Case à cocher garance. */
export function Checkbox({ id, label, ...input }: Omit<ComponentProps<"input">, "type"> & { id: string; label: ReactNode }) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2.5 text-[0.95rem]">
      <input id={id} type="checkbox" className="h-[18px] w-[18px] accent-garance" {...input} />
      {label}
    </label>
  );
}

/** Message de retour d’un formulaire (succès ou erreur). */
export function FormMessage({ tone, children }: { tone: "ok" | "error"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-l-4 px-[18px] py-3.5 font-semibold",
        tone === "ok" ? "border-ink bg-succes-bg" : "border-garance bg-alerte-bg text-garance-dark",
      )}
    >
      {children}
    </p>
  );
}

/** Mention RGPD sous un formulaire. */
export function FormLegal({ children }: { children: ReactNode }) {
  return <p className="max-w-[70ch] text-small leading-[1.6] text-gris [&_a]:underline-offset-[3px]">{children}</p>;
}

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "./form-context";

/**
 * Form primitives for the account area.
 *
 * Every input has a real <label>, an error message wired through
 * aria-describedby and aria-invalid, and inherits the site's global
 * :focus-visible ring. Errors are never colour-only — they carry an
 * icon and text.
 */

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  name: string;
  label: string;
  hint?: string;
}

export function TextField({ name, label, hint, className, ...props }: TextFieldProps) {
  const { fieldErrors, pending, formId } = useFormContext();
  const error = fieldErrors[name];
  const id = `${formId}-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="kicker block text-fg-muted">
        {label}
      </label>
      <input
        id={id}
        name={name}
        disabled={pending || props.disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          "h-12 w-full rounded-xl border bg-bone-100 px-4 text-[0.95rem] text-ink transition-colors outline-none",
          "placeholder:text-fg-subtle disabled:opacity-60",
          error ? "border-ember" : "border-line-strong hover:border-ink/40",
          className,
        )}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-ember">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface CheckboxFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  name: string;
  label: string;
  description?: string;
}

export function CheckboxField({ name, label, description, ...props }: CheckboxFieldProps) {
  const { pending, formId } = useFormContext();
  const id = `${formId}-${name}`;
  const descriptionId = `${id}-description`;

  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        name={name}
        type="checkbox"
        disabled={pending || props.disabled}
        aria-describedby={description ? descriptionId : undefined}
        className="mt-0.5 size-4.5 shrink-0 rounded-[0.3rem] border border-line-strong accent-ink"
        {...props}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm leading-snug text-ink">
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="mt-0.5 text-xs leading-relaxed text-fg-subtle">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

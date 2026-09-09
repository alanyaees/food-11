"use client";

import { useActionState, useId } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { idleFormState, type FormState } from "@/lib/form-state";
import { cn } from "@/lib/utils";
import { FormContext } from "./form-context";

export type AuthAction = (state: FormState, formData: FormData) => Promise<FormState>;

/**
 * Wraps a server action in a form with a live status region.
 *
 * The status paragraph is `aria-live="polite"` and always present in
 * the DOM, so a screen reader announces the result of a submission
 * without the region appearing and disappearing.
 */
export function AuthForm({
  action,
  submitLabel,
  pendingLabel = "Working…",
  children,
  footer,
  className,
  submitVariant = "primary",
}: {
  action: AuthAction;
  submitLabel: string;
  pendingLabel?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  submitVariant?: "primary" | "accent" | "outline";
}) {
  const [state, formAction, pending] = useActionState(action, idleFormState);
  const formId = useId();
  const statusId = `${formId}-status`;

  return (
    <FormContext.Provider value={{ fieldErrors: state.fieldErrors, pending, formId }}>
      <form action={formAction} noValidate className={cn("space-y-5", className)}>
        <div className="space-y-4">{children}</div>

        <Button
          type="submit"
          variant={submitVariant}
          size="lg"
          block
          disabled={pending}
          aria-describedby={statusId}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>

        <p
          id={statusId}
          role="status"
          aria-live="polite"
          className={cn(
            "flex min-h-5 items-start gap-1.5 text-[0.8125rem] leading-relaxed",
            state.status === "error" && "text-ember",
            state.status === "success" && "text-ink",
            state.status === "idle" && "text-fg-subtle",
          )}
        >
          {state.status === "error" ? (
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          ) : null}
          {state.status === "success" ? (
            <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          ) : null}
          <span>{state.message}</span>
        </p>

        {footer}
      </form>
    </FormContext.Provider>
  );
}

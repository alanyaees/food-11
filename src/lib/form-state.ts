/**
 * Shared shape for `useActionState` results.
 *
 * Lives outside the "use server" module because a server-actions file
 * may only export async functions.
 */

export interface FormState {
  status: "idle" | "error" | "success";
  /** One sentence, safe to show a human. Never a raw provider error. */
  message: string;
  /** Keyed by input `name`, rendered under the field. */
  fieldErrors: Record<string, string>;
}

export const idleFormState: FormState = { status: "idle", message: "", fieldErrors: {} };

export function errorState(
  message: string,
  fieldErrors: Record<string, string> = {},
): FormState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): FormState {
  return { status: "success", message, fieldErrors: {} };
}

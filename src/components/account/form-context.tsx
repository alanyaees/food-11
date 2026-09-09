"use client";

import { createContext, useContext } from "react";

/**
 * Lets field components read validation errors and the pending state
 * from the enclosing <AuthForm> without prop-drilling through every
 * input.
 */
export interface FormContextValue {
  fieldErrors: Record<string, string>;
  pending: boolean;
  /** Unique per form instance, so ids and aria-describedby never collide. */
  formId: string;
}

export const FormContext = createContext<FormContextValue>({
  fieldErrors: {},
  pending: false,
  formId: "form",
});

export function useFormContext() {
  return useContext(FormContext);
}

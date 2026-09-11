"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  cookHabitsQuestion,
  type SurveyAnswers,
  type SurveyResultsPayload,
  type YesNo,
  type YesNoQuestionId,
  yesNoQuestions,
} from "@/lib/survey";

type Status = "idle" | "submitting" | "success" | "error";

type Field = YesNoQuestionId | "cookHabits";

const initialValues: SurveyAnswers = {
  wouldTryProduct: "",
  cooksAtHome: "",
  cookHabits: "",
  eatsOutLazy: "",
  junkFoodWhenOut: "",
  packsLunchToUni: "",
};

type Props = {
  onSubmitted?: (results?: SurveyResultsPayload) => void;
};

function validate(values: SurveyAnswers) {
  const errors: Partial<Record<Field, string>> = {};
  for (const question of yesNoQuestions) {
    if (values[question.id] !== "yes" && values[question.id] !== "no") {
      errors[question.id] = "Pick yes or no.";
    }
  }
  if (values.cooksAtHome === "yes" && values.cookHabits.trim().length < 3) {
    errors.cookHabits = "Tell us roughly how often you cook, and which meals.";
  } else if (values.cookHabits.trim().length > 500) {
    errors.cookHabits = "Keep that under 500 characters.";
  }
  return errors;
}

export function SurveyForm({ onSubmitted }: Props) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<SurveyAnswers>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const setYesNo = (field: YesNoQuestionId, value: YesNo) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status === "error") setStatus("idle");
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setStatusMessage(
        `${Object.keys(nextErrors).length} field${Object.keys(nextErrors).length === 1 ? "" : "s"} still need${Object.keys(nextErrors).length === 1 ? "s" : ""} an answer.`,
      );
      const firstInvalid = Object.keys(nextErrors)[0] as Field;
      formRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)
        ?.focus({ preventScroll: false });
      return;
    }

    setStatus("submitting");
    setStatusMessage("Saving your answers…");

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wouldTryProduct: values.wouldTryProduct,
          cooksAtHome: values.cooksAtHome,
          cookHabits: values.cookHabits.trim(),
          eatsOutLazy: values.eatsOutLazy,
          junkFoodWhenOut: values.junkFoodWhenOut,
          packsLunchToUni: values.packsLunchToUni,
        }),
      });

      let data: {
        ok?: boolean;
        message?: string;
        results?: SurveyResultsPayload;
      } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        // non-JSON still fails below
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "We couldn't save that. Try again in a moment.");
      }

      setStatus("success");
      setStatusMessage(data.message ?? "Thanks — you're in.");
      setErrors({});
      onSubmitted?.(data.results);
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong on our side. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-bone-100 p-8 sm:p-10">
        <CheckCircle2 className="size-8 text-ember" aria-hidden />
        <h2 className="font-display mt-5 text-2xl font-extrabold tracking-[-0.03em] uppercase">
          Thanks — you&apos;re in
        </h2>
        <p
          role="status"
          aria-live="polite"
          className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted"
        >
          {statusMessage}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/shop" variant="accent" size="md" className="w-full sm:w-auto">
            Explore meals
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => {
              setStatus("idle");
              setStatusMessage("");
              setValues(initialValues);
            }}
          >
            Submit another response
          </Button>
        </div>
      </div>
    );
  }

  const cookHabitsRequired = values.cooksAtHome === "yes";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${formId}-heading`}
      className="rounded-2xl border border-line bg-bone-100 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-6">
        <div>
          <p className="kicker text-fg-subtle">About two minutes</p>
          <h2
            id={`${formId}-heading`}
            className="font-display mt-2 text-xl font-extrabold tracking-[-0.03em] uppercase sm:text-2xl"
          >
            Food form
          </h2>
        </div>
        <p className="max-w-[16rem] text-right text-[0.72rem] leading-relaxed text-fg-subtle">
          Required questions are marked. Answers feed the live results on this page.
        </p>
      </div>

      <ol className="mt-2 divide-y divide-line">
        {yesNoQuestions.map((question) => {
          const insertHabitsAfterCooks = question.id === "cooksAtHome";
          const questionNumber =
            question.id === "wouldTryProduct"
              ? 1
              : question.id === "cooksAtHome"
                ? 2
                : question.id === "eatsOutLazy"
                  ? 4
                  : question.id === "junkFoodWhenOut"
                    ? 5
                    : 6;

          return (
            <li key={question.id} className="py-7">
              <YesNoField
                index={questionNumber}
                questionId={question.id}
                label={question.label}
                value={values[question.id]}
                error={errors[question.id]}
                onChange={(value) => setYesNo(question.id, value)}
              />

              {insertHabitsAfterCooks ? (
                <div className="mt-7 border-t border-line/80 pt-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <label
                      htmlFor={`${formId}-habits`}
                      className="block text-[0.98rem] leading-snug font-medium tracking-tight text-ink"
                    >
                      <span className="kicker mb-2 block text-fg-subtle">
                        03
                        {cookHabitsRequired ? (
                          <span className="text-ember" aria-hidden>
                            {" "}
                            *
                          </span>
                        ) : null}
                      </span>
                      {cookHabitsQuestion.label}
                      {cookHabitsRequired ? (
                        <span className="sr-only"> (required)</span>
                      ) : (
                        <span className="mt-1 block text-[0.8rem] font-normal text-fg-subtle">
                          Optional if you don&apos;t cook at home.
                        </span>
                      )}
                    </label>
                    <span className="num shrink-0 text-[0.7rem] text-fg-subtle">
                      {values.cookHabits.length}/500
                    </span>
                  </div>
                  <textarea
                    id={`${formId}-habits`}
                    name="cookHabits"
                    data-field="cookHabits"
                    rows={3}
                    maxLength={500}
                    value={values.cookHabits}
                    onChange={(event) => {
                      setValues((current) => ({ ...current, cookHabits: event.target.value }));
                      setErrors((current) => {
                        if (!current.cookHabits) return current;
                        const next = { ...current };
                        delete next.cookHabits;
                        return next;
                      });
                    }}
                    aria-invalid={errors.cookHabits ? true : undefined}
                    aria-describedby={errors.cookHabits ? `${formId}-habits-error` : undefined}
                    placeholder={cookHabitsQuestion.placeholder}
                    className={cn(
                      "mt-3 w-full resize-y rounded-lg border bg-bone px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-fg-subtle",
                      errors.cookHabits
                        ? "border-ember"
                        : "border-line-strong focus:border-ink",
                    )}
                  />
                  {errors.cookHabits ? (
                    <p
                      id={`${formId}-habits-error`}
                      className="mt-2 text-[0.78rem] font-medium text-ember-600"
                    >
                      {errors.cookHabits}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-2 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="press inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ember px-7 text-[0.9375rem] font-semibold text-white hover:bg-ember-600 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving
            </>
          ) : (
            <>
              Submit answers
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
        <p className="max-w-xs text-[0.72rem] leading-relaxed text-fg-subtle">
          No email required. Aggregated answers and cooking notes are shown publicly on this page.
        </p>
      </div>

      <div aria-live="polite" role="status" className="mt-5 empty:mt-0">
        {status === "error" && statusMessage ? (
          <div className="flex gap-3 rounded-lg border border-ember/40 bg-ember-100/60 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-ember-600" aria-hidden />
            <p className="text-[0.85rem] leading-relaxed text-ink/80">{statusMessage}</p>
          </div>
        ) : status === "submitting" ? (
          <p className="text-[0.85rem] text-fg-muted">{statusMessage}</p>
        ) : null}
      </div>
    </form>
  );
}

function YesNoField({
  index,
  questionId,
  label,
  value,
  error,
  onChange,
}: {
  index: number;
  questionId: YesNoQuestionId;
  label: string;
  value: YesNo | "";
  error?: string;
  onChange: (value: YesNo) => void;
}) {
  const labelId = `${questionId}-label`;
  return (
    <fieldset data-field={questionId} tabIndex={-1} className="min-w-0 outline-none">
      <legend id={labelId} className="text-[0.98rem] leading-snug font-medium tracking-tight text-ink">
        <span className="kicker mb-2 block text-fg-subtle">
          {String(index).padStart(2, "0")}
          <span className="text-ember" aria-hidden>
            {" *"}
          </span>
        </span>
        {label}
        <span className="sr-only"> (required)</span>
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        className="mt-4 flex flex-wrap gap-2.5"
      >
        {(["yes", "no"] as const).map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={cn(
                "press inline-flex h-11 min-w-[5.5rem] flex-1 items-center justify-center rounded-full border px-5 text-sm font-semibold capitalize transition-colors sm:flex-none",
                selected
                  ? "border-ink bg-ink text-on-ink"
                  : "border-line-strong bg-bone text-ink hover:border-ink/50",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 text-[0.78rem] font-medium text-ember-600">{error}</p>
      ) : null}
    </fieldset>
  );
}

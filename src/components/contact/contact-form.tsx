"use client";

import { useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { brand } from "@/lib/brand";
import { contact } from "@/lib/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

type Field = "name" | "email" | "topic" | "message";

const initialValues: Record<Field, string> = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = "Tell us what to call you.";
  if (!values.email.trim()) {
    errors.email = "We need an email address to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }
  if (!values.topic) errors.topic = "Pick the closest topic.";
  if (values.message.trim().length < MESSAGE_MIN) {
    errors.message = `A little more detail helps — at least ${MESSAGE_MIN} characters.`;
  }
  return errors;
}

/**
 * The contact form.
 *
 * Validated in the browser so nobody loses a long message to a round
 * trip, submitted as JSON to /api/contact, and every outcome — field
 * errors, a rejected request, a network failure — is announced through
 * one polite live region with an email fallback so a broken API never
 * becomes a dead end.
 */
export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
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
        `${Object.keys(nextErrors).length} field${Object.keys(nextErrors).length === 1 ? "" : "s"} need${Object.keys(nextErrors).length === 1 ? "s" : ""} attention before this can send.`,
      );
      const firstInvalid = Object.keys(nextErrors)[0] as Field;
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setStatusMessage("Sending your message…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          topic: values.topic,
          message: values.message.trim(),
        }),
      });

      let data: { ok?: boolean; message?: string } = {};
      try {
        data = (await response.json()) as { ok?: boolean; message?: string };
      } catch {
        // A non-JSON body is still a failure we need to describe.
      }

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ?? "We couldn't send that message. Please try again in a moment.",
        );
      }

      setStatus("success");
      setStatusMessage(data.message ?? "Message sent. We'll be in touch.");
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error && error.message
          ? error.message
          : `Something went wrong on our side. Email us at ${brand.contact.email} instead and it will reach the same place.`,
      );
    }
  }

  const fieldClass = (field: Field) =>
    cn(
      "w-full rounded-lg border bg-bone-100 px-4 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-fg-subtle",
      errors[field] ? "border-ember" : "border-line-strong focus:border-ink",
    );

  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-bone-100 p-8 sm:p-10">
        <CheckCircle2 className="size-8 text-ember" aria-hidden />
        <h2 className="font-display mt-5 text-2xl font-extrabold tracking-[-0.03em] uppercase">
          Message sent
        </h2>
        <p role="status" aria-live="polite" className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
          {statusMessage} {contact.expectation.body[0]}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setStatusMessage("");
          }}
          className="press mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-ink/25 px-5 text-sm font-semibold text-ink hover:border-ink"
        >
          Send another message
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-heading"
      className="rounded-2xl border border-line bg-bone-100 p-6 sm:p-8"
    >
      <h2
        id="contact-form-heading"
        className="font-display text-xl font-extrabold tracking-[-0.03em] uppercase"
      >
        Send us a message
      </h2>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="contact-name" className="kicker block text-fg-subtle">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            placeholder="Your name"
            className={cn(fieldClass("name"), "mt-2.5 h-12")}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-[0.78rem] font-medium text-ember-600">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="contact-email" className="kicker block text-fg-subtle">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={update("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            placeholder={brand.newsletter.placeholder}
            className={cn(fieldClass("email"), "mt-2.5 h-12")}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-[0.78rem] font-medium text-ember-600">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-topic" className="kicker block text-fg-subtle">
            Topic
          </label>
          <div className="relative mt-2.5">
            <select
              id="contact-topic"
              name="topic"
              value={values.topic}
              onChange={update("topic")}
              aria-invalid={errors.topic ? true : undefined}
              aria-describedby={describedBy("topic")}
              className={cn(fieldClass("topic"), "h-12 appearance-none pr-10")}
            >
              <option value="">Choose a topic</option>
              {contact.topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 12 8"
              className="pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2 text-fg-muted"
            >
              <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          {errors.topic ? (
            <p id="topic-error" className="mt-2 text-[0.78rem] font-medium text-ember-600">
              {errors.topic}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="contact-message" className="kicker block text-fg-subtle">
              Message
            </label>
            <span className="num text-[0.7rem] text-fg-subtle">
              {values.message.length} / {MESSAGE_MAX}
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={MESSAGE_MAX}
            value={values.message}
            onChange={update("message")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message")}
            placeholder="What's on your mind?"
            className={cn(fieldClass("message"), "mt-2.5 resize-y py-3.5 leading-relaxed")}
          />
          {errors.message ? (
            <p id="message-error" className="mt-2 text-[0.78rem] font-medium text-ember-600">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="press inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-[0.9375rem] font-semibold text-on-ink hover:bg-ink-700 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
        <p className="max-w-xs text-[0.72rem] leading-relaxed text-fg-subtle">
          We use your message and email only to reply to you. See our{" "}
          <a href="/privacy" className="link-underline font-semibold text-fg-muted">
            privacy policy
          </a>
          .
        </p>
      </div>

      {/* One live region for every outcome. */}
      <div aria-live="polite" role="status" className="mt-5 empty:mt-0">
        {status === "error" && statusMessage ? (
          <div className="flex gap-3 rounded-lg border border-ember/40 bg-ember-100/60 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-ember-600" aria-hidden />
            <p className="text-[0.85rem] leading-relaxed text-ink/80">
              {statusMessage}{" "}
              <a
                href={`mailto:${brand.contact.email}`}
                className="link-underline font-semibold text-ink"
              >
                {brand.contact.email}
              </a>{" "}
              always works.
            </p>
          </div>
        ) : status === "submitting" ? (
          <p className="text-[0.85rem] text-fg-muted">{statusMessage}</p>
        ) : null}
      </div>
    </form>
  );
}

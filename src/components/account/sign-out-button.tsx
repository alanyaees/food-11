"use client";

import { useFormStatus } from "react-dom";
import { Loader2, LogOut } from "lucide-react";
import { signOutAction } from "@/app/account/actions";
import { cn } from "@/lib/utils";

function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "press inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold tracking-tight text-fg-muted hover:border-ink hover:text-ink disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-3.5" aria-hidden />
      )}
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

/** Posts to the sign-out server action; falls back to the route on no-JS. */
export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <SubmitButton className={className} />
    </form>
  );
}

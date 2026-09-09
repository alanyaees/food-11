/**
 * Human wording for the `?error=` codes /auth/callback redirects with.
 * Codes are deliberately coarse so the URL never hints at whether an
 * account exists.
 */

const messages: Record<string, { title: string; body: string }> = {
  "link-expired": {
    title: "That link has expired",
    body: "Sign-in and reset links work once and last an hour. Request a fresh one and it'll be with you in a moment.",
  },
  "link-invalid": {
    title: "That link didn't work",
    body: "It may have been altered by an email client. Sign in below, or ask for a new link.",
  },
  "not-configured": {
    title: "Accounts aren't switched on here",
    body: "Supabase isn't configured on this deployment, so email links can't be verified.",
  },
};

export function authErrorFor(code: string | undefined | null) {
  if (!code) return null;
  return messages[code] ?? messages["link-invalid"];
}

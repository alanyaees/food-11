"use client";

import { updateProfileAction } from "@/app/account/actions";
import { AuthForm } from "./auth-form";
import { CheckboxField, TextField } from "./field";

export function ProfileForm({
  fullName,
  phone,
  marketingOptIn,
  email,
}: {
  fullName: string;
  phone: string;
  marketingOptIn: boolean;
  email: string;
}) {
  return (
    <AuthForm action={updateProfileAction} submitLabel="Save changes" pendingLabel="Saving…">
      <TextField
        name="fullName"
        label="Name"
        type="text"
        autoComplete="name"
        required
        defaultValue={fullName}
      />
      <TextField
        name="phone"
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        defaultValue={phone}
        placeholder="+31 6 1234 5678"
        hint="Only used for delivery updates."
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        defaultValue={email}
        disabled
        readOnly
        hint="Changing your email is coming — contact us in the meantime."
      />
      <CheckboxField
        name="marketingOptIn"
        label="Send me the occasional email"
        description="New flavours and restocks. One click to stop."
        defaultChecked={marketingOptIn}
      />
    </AuthForm>
  );
}

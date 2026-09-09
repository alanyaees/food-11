import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout powered by Stripe.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  // Only a boolean crosses the server/client boundary — never the key.
  const stripeConfigured = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );

  return (
    <div className="container-full py-12 sm:py-16">
      <header className="mb-10 max-w-xl">
        <p className="kicker text-fg-subtle">Checkout</p>
        <h1 className="mt-4 text-[length:var(--text-display-sm)] leading-[0.9] tracking-[-0.04em] uppercase">
          Almost dinner
        </h1>
      </header>
      <CheckoutView stripeConfigured={stripeConfigured} />
    </div>
  );
}

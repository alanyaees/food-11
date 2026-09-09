import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";
import { PrepSequence } from "@/components/features/prep-sequence";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your order is confirmed.",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const isDemo = params.demo === "1";

  return (
    <div className="container-full py-16 sm:py-24">
      <ClearCartOnMount />
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-on-ink">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <p className="kicker mt-6 text-fg-subtle">
          {isDemo ? "Demo order complete" : "Order confirmed"}
        </p>
        <h1 className="mt-4 text-[length:var(--text-display-sm)] leading-[0.9] tracking-[-0.04em] uppercase">
          Your pantry just got stronger.
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-fg-muted">
          {isDemo
            ? "This environment has no payment keys configured, so nothing was charged and no card details were collected. In production this screen follows a real Stripe payment and your order appears in your account."
            : `Thanks — we've emailed your confirmation. You can follow the order from your account, and reply to any email if something looks wrong.`}
        </p>
        {params.session_id ? (
          <p className="num mt-3 text-xs text-fg-subtle">
            Stripe session {params.session_id.slice(0, 18)}…
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/account/orders" size="lg">
            View your orders
          </Button>
          <Button href="/shop" size="lg" variant="outline">
            Keep shopping
          </Button>
        </div>
      </div>

      <section className="mt-20" aria-labelledby="success-prep">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker text-fg-subtle">While you wait</p>
          <h2
            id="success-prep"
            className="font-display mt-3 text-[length:var(--text-display-xs)] leading-none tracking-[-0.035em] uppercase"
          >
            Here is the entire cooking process
          </h2>
          <p className="mt-3 text-sm text-fg-muted">
            {brand.phrases[4]} Boil a kettle and you have already done the hard part.
          </p>
        </div>
        <div className="mt-12">
          <PrepSequence />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your meals, apply a promo code and head to checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-full py-12 sm:py-16">
      <header className="mb-10">
        <p className="kicker text-fg-subtle">Cart</p>
        <h1 className="mt-4 text-[length:var(--text-display-sm)] leading-[0.9] tracking-[-0.04em] uppercase">
          The bag
        </h1>
      </header>
      <CartView />
    </div>
  );
}

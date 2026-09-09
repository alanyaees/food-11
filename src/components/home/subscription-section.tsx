import { CalendarClock, PauseCircle, Repeat, Shuffle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { averageMealPriceCents, boxFixedPriceCents, boxSizes } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const perks = [
  { icon: Shuffle, label: "Change flavours", body: "Swap the whole box every cycle." },
  { icon: CalendarClock, label: "Skip a delivery", body: "One tap, no email, no chat bot." },
  { icon: PauseCircle, label: "Pause", body: "Going travelling? Freeze it." },
  { icon: XCircle, label: "Cancel", body: "From your account, instantly." },
];

export function SubscriptionSection() {
  const average = averageMealPriceCents();

  return (
    <section
      className="grain relative overflow-hidden bg-ink py-20 text-on-ink sm:py-28"
      aria-labelledby="subscription-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -left-1/4 size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(255,74,28,0.22),transparent_60%)] blur-2xl"
      />
      <div className="container-full relative z-2">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="kicker text-on-ink-muted">09 — Subscription</p>
            </Reveal>
            <h2
              id="subscription-heading"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              <RevealLines lines={["Your emergency meal.", "Every month."]} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-on-ink-muted">
                A standing box that quietly keeps your cupboard stocked, at 15% less than buying
                pouches one at a time. Built to be skipped when life happens.
              </p>
            </Reveal>

            <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {perks.map((perk) => (
                <div key={perk.label} className="flex gap-3">
                  <perk.icon className="mt-0.5 size-4.5 shrink-0 text-ember" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold tracking-tight">{perk.label}</dt>
                    <dd className="mt-0.5 text-sm text-on-ink-muted">{perk.body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {boxSizes.filter((box) => boxFixedPriceCents(box) == null).map((box, index) => {
              const fullPrice = average * box.size;
              const withSubscription = Math.round(fullPrice * (1 - box.discount) * 0.85);
              const perMeal = Math.round(withSubscription / box.size);
              const savings = fullPrice - withSubscription;
              const highlighted = box.size === 12;

              return (
                <Reveal
                  as="article"
                  key={box.size}
                  delay={index * 0.07}
                  className={highlighted ? "sm:-mt-4" : undefined}
                >
                  <div
                    className={`flex h-full flex-col rounded-2xl border p-6 ${
                      highlighted
                        ? "border-ember/60 bg-white/[0.07]"
                        : "border-white/12 bg-white/[0.03]"
                    }`}
                  >
                    {highlighted ? (
                      <span className="kicker mb-4 w-fit rounded-full bg-ember px-2.5 py-1.5 text-white">
                        Most popular
                      </span>
                    ) : (
                      <span className="kicker mb-4 text-on-ink-muted">{box.label}</span>
                    )}
                    <p className="num font-display text-5xl leading-none font-extrabold tracking-tight">
                      {box.size}
                    </p>
                    <p className="kicker mt-2 text-on-ink-muted">meals / delivery</p>
                    <p className="mt-4 text-sm text-on-ink-muted">{box.note}</p>

                    <dl className="mt-6 space-y-1.5 border-t border-white/12 pt-4 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-on-ink-muted">Per meal</dt>
                        <dd className="num font-bold">{formatPrice(perMeal)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-on-ink-muted">Per delivery</dt>
                        <dd className="num font-bold">{formatPrice(withSubscription)}</dd>
                      </div>
                      <div className="flex justify-between text-on-ink-muted">
                        <dt>Buying singles</dt>
                        <dd className="num line-through">{formatPrice(fullPrice)}</dd>
                      </div>
                      <div className="flex justify-between text-ember">
                        <dt>You save</dt>
                        <dd className="num font-bold">{formatPrice(savings)}</dd>
                      </div>
                    </dl>

                    <Button
                      href={`/build-a-box?size=${box.size}&plan=subscribe`}
                      variant={highlighted ? "accent" : "outlineInverse"}
                      size="md"
                      block
                      className="mt-6"
                    >
                      <Repeat className="size-3.5" aria-hidden />
                      Subscribe
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-[0.72rem] leading-relaxed text-on-ink-muted">
          Prices shown are indicative pre-launch pricing based on the current concept range and are
          calculated from the average meal price. Subscription billing runs through Stripe; you can
          skip, pause or cancel from your account at any time before the next charge.
        </p>
      </div>
    </section>
  );
}

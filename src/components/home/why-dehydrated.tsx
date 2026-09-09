import { Droplets, Flame, Package, Utensils } from "lucide-react";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { DisclaimerNote } from "@/components/ui/concept-badge";

const stages = [
  {
    icon: Utensils,
    label: "Freshly prepared",
    body: "The recipe is cooked properly first — sauce reduced, pasta cooked, beef slow-cooked.",
  },
  {
    icon: Droplets,
    label: "Water removed",
    body: "Water is taken out. It is the heaviest, most perishable, least nutritious thing in the bowl.",
  },
  {
    icon: Flame,
    label: "Add hot water",
    body: "You put the water back at the last possible moment, in your kitchen, from a kettle.",
  },
  {
    icon: Package,
    label: "A meal again",
    body: "Sauce, texture and macros come back together in the pouch you opened.",
  },
];

const benefits = [
  { title: "Lighter to carry", body: "Around 120 g dry instead of a chilled tray." },
  { title: "Easy to store", body: "Flat pouches. A drawer holds a fortnight of meals." },
  { title: "No fridge required", body: "Cupboard, desk drawer, locker, backpack, glovebox." },
  { title: "Faster than delivery", body: "Three minutes, most of it unattended." },
];

export function WhyDehydrated() {
  return (
    <section className="container-full py-20 sm:py-28" aria-labelledby="dehydrated-heading">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="kicker text-fg-subtle">05 — The technology</p>
          </Reveal>
          <h2
            id="dehydrated-heading"
            className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
          >
            <RevealLines lines={["We took out", "the water.", "Not the good stuff."]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-fg-muted">
              Dehydration is not a compromise, it is a logistics decision. Removing water is what
              lets a real meal sit in a cupboard, weigh almost nothing, and still arrive creamy when
              you want it.
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <Reveal as="div" key={benefit.title} delay={index * 0.05}>
                <dt className="text-sm font-semibold tracking-tight">{benefit.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-fg-muted">{benefit.body}</dd>
              </Reveal>
            ))}
          </dl>

          <DisclaimerNote className="mt-8">
            Storage, shelf-life and preservation performance are still being validated. We will
            publish tested figures — with the test method — before anything ships.
          </DisclaimerNote>
        </div>

        {/* Process flow */}
          <Reveal delay={0.1}>
          <ol className="relative grid min-w-0 gap-4 sm:grid-cols-2">
            {stages.map((stage, index) => (
              <li
                key={stage.label}
                className="group relative min-w-0 overflow-hidden rounded-xl border border-line bg-bone-100 p-5 transition-colors hover:border-line-strong sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-ink text-on-ink">
                    <stage.icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="num font-display text-3xl leading-none font-extrabold text-line-strong">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{stage.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{stage.body}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-cheddar transition-transform duration-500 group-hover:scale-x-100"
                />
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

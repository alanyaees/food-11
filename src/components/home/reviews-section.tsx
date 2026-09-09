import { MessageSquareDashed, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DisclaimerNote } from "@/components/ui/concept-badge";
import { Reveal } from "@/components/ui/reveal";
import { disclaimers } from "@/lib/brand";

/**
 * Deliberately not a wall of invented five-star reviews. Real
 * structure, real labelling, ready for verified customer reviews the
 * moment we have any.
 */
const testerNotes = [
  {
    quote:
      "I genuinely forgot it came out of a pouch until I looked at the pouch. Then I looked at the protein and said something rude.",
    context: "Tasting panel 03 · Classic Cheddar",
  },
  {
    quote:
      "The jalapeño one builds. First bite is cheese, third bite is heat. I finished it and immediately asked for another.",
    context: "Tasting panel 04 · Spicy Jalapeño",
  },
  {
    quote:
      "Texture was the thing I doubted. It's creamy — not gluey, not grainy. That was the deal-breaker for me and it passed.",
    context: "Tasting panel 02 · Creamy Tomato",
  },
];

export function ReviewsSection() {
  return (
    <section className="container-full py-20 sm:py-28" aria-labelledby="reviews-heading">
      <div className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Reveal>
            <p className="kicker text-fg-subtle">08 — Feedback</p>
          </Reveal>
          <h2
            id="reviews-heading"
            className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
          >
            No fake five stars.
          </h2>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-fg-muted">
            We have not sold a pouch yet, so there is nothing to quote. What we do have is a tasting
            panel and their unfiltered notes.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-4">
        {testerNotes.map((note, index) => (
          <Reveal as="article" key={note.context} delay={index * 0.06}>
            <div className="flex h-full flex-col rounded-xl border border-line bg-bone-100 p-6">
              <Badge tone="neutral" className="w-fit">
                {disclaimers.testerFeedback}
              </Badge>
              <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-ink">
                “{note.quote}”
              </blockquote>
              <footer className="mt-5 border-t border-line pt-4">
                <p className="kicker text-fg-subtle">{note.context}</p>
              </footer>
            </div>
          </Reveal>
        ))}

        <Reveal as="article" delay={0.2}>
          <div className="flex h-full flex-col items-start rounded-xl border border-dashed border-line-strong bg-transparent p-6">
            <span className="grid size-10 place-items-center rounded-full bg-bone-200 text-fg-muted">
              <MessageSquareDashed className="size-4.5" aria-hidden />
            </span>
            <h3 className="font-display mt-5 text-xl leading-tight tracking-tight">
              Verified customer reviews land here.
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              {disclaimers.reviewsPlaceholder} Reviews will be tied to confirmed orders, star
              ratings included, unedited.
            </p>
            <div aria-hidden className="mt-4 flex gap-1 text-line-strong">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4" />
              ))}
            </div>
            <Button href="/contact" variant="outline" size="sm" className="mt-5">
              Join the tasting list
            </Button>
          </div>
        </Reveal>
      </div>

      <DisclaimerNote className="mt-6">
        Tasting-panel comments are paraphrased notes from internal product sessions and are shared
        as development feedback, not as customer reviews or endorsements.
      </DisclaimerNote>
    </section>
  );
}

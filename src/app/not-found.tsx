import { Button } from "@/components/ui/button";
import { Pouch } from "@/components/brand/pouch";

export default function NotFound() {
  return (
    <div className="container-full flex min-h-[70vh] items-center py-16">
      <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-center">
        <div>
          <p className="kicker text-fg-subtle">Error 404</p>
          <h1 className="mt-5 text-[length:var(--text-display-md)] leading-[0.88] tracking-[-0.045em] uppercase">
            This page has
            <br />
            <span className="text-ember">zero protein.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
            Nutritionally void, structurally absent. Whatever you were looking for has moved, or
            never existed in the first place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/" size="lg">
              Back home
            </Button>
            <Button href="/shop" size="lg" variant="outline">
              Explore meals
            </Button>
          </div>
        </div>
        <div className="mx-auto w-3/5 max-w-[16rem] rotate-[-6deg] lg:w-full">
          <Pouch
            line="MAC + CHEESE"
            flavor="Not found"
            protein={0}
            prepMinutes={0}
            accent="truffle"
          />
        </div>
      </div>
    </div>
  );
}

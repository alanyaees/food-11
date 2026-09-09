"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Sheet } from "@/components/ui/sheet";
import { PouchMini } from "@/components/brand/pouch";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Highest protein", href: "/shop?sort=protein-desc" },
  { label: "Under 500 kcal", href: "/shop?maxCalories=500" },
  { label: "Vegetarian", href: "/shop?dietary=vegetarian" },
  { label: "Ready in 3 min", href: "/shop?maxPrep=3" },
];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const products = getProducts();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) =>
      [product.name, product.flavor, product.line, product.category, product.tagline, ...product.dietary]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, products]);

  const go = (href: string) => {
    onClose();
    setQuery("");
    router.push(href);
  };

  return (
    <Sheet open={open} onClose={onClose} side="bottom" title="Search" className="sm:mx-auto">
      <div className="flex max-h-[88vh] flex-col">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (results[0]) go(`/products/${results[0].slug}`);
          }}
          className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4 sm:px-7"
          role="search"
        >
          <Search className="size-5 shrink-0 text-fg-subtle" aria-hidden />
          <label htmlFor="site-search" className="sr-only">
            Search meals
          </label>
          <input
            id="site-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search meals, flavours, macros…"
            autoComplete="off"
            className="h-8 w-full bg-transparent text-base tracking-tight outline-none placeholder:text-fg-subtle sm:text-lg"
          />
          <kbd className="kicker hidden rounded-md border border-line-strong/70 px-1.5 py-1 text-[0.6rem] text-fg-subtle sm:block">
            Esc
          </kbd>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-display text-2xl tracking-tight">No meals found. Tragic.</p>
              <p className="mt-2 text-sm text-fg-muted">
                Try “cheddar”, “spicy”, “risotto” — or browse the whole range.
              </p>
              <Button className="mt-5" onClick={() => go("/shop")}>
                Shop all meals
              </Button>
            </div>
          ) : (
            <ul className="grid gap-1">
              {results.map((product) => (
                <li key={product.slug}>
                  <button
                    type="button"
                    onClick={() => go(`/products/${product.slug}`)}
                    className="press flex w-full items-center gap-4 rounded-lg p-2 text-left hover:bg-bone-200/70"
                  >
                    <span className="w-12 shrink-0">
                      <PouchMini
                        line={product.line}
                        flavor={product.flavor}
                        protein={product.nutrition.protein}
                        accent={product.accent}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold tracking-tight">
                        {product.line} — {product.flavor}
                      </span>
                      <span className="num block text-xs text-fg-muted">
                        {product.nutrition.protein} g protein · {product.nutrition.calories} kcal ·{" "}
                        {product.prepMinutes} min
                      </span>
                    </span>
                    <span className="num shrink-0 text-sm font-semibold">
                      {formatPrice(product.priceCents)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <p className="kicker text-fg-subtle">Jump to</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => go(link.href)}
                  className="press rounded-full border border-line-strong/70 px-3.5 py-2 text-xs font-medium hover:border-ink"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

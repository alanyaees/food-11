"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { FilterPanel } from "./filter-panel";
import {
  activeFilterCount,
  applyFilters,
  facetCounts,
  parseFilters,
  serialiseFilters,
  sortOptions,
  type ShopFilters,
} from "@/lib/shop";
import { categoryLabels, dietaryLabels, getProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ShopBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filters = useMemo(
    () => parseFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const facets = useMemo(() => facetCounts(), []);
  const products = useMemo(() => applyFilters(getProducts(), filters), [filters]);
  const activeCount = activeFilterCount(filters);

  const update = useCallback(
    (next: Partial<ShopFilters>) => {
      const merged = { ...filters, ...next };
      const query = serialiseFilters(merged);
      router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
    },
    [filters, router],
  );

  const reset = useCallback(() => {
    router.replace("/shop", { scroll: false });
  }, [router]);

  const chips = [
    ...filters.categories.map((id) => ({
      key: `category-${id}`,
      label: categoryLabels[id],
      clear: () => update({ categories: filters.categories.filter((entry) => entry !== id) }),
    })),
    ...filters.dietary.map((id) => ({
      key: `dietary-${id}`,
      label: dietaryLabels[id],
      clear: () => update({ dietary: filters.dietary.filter((entry) => entry !== id) }),
    })),
    ...(filters.minProtein
      ? [
          {
            key: "protein",
            label: `${filters.minProtein} g protein+`,
            clear: () => update({ minProtein: null }),
          },
        ]
      : []),
    ...(filters.maxCalories
      ? [
          {
            key: "calories",
            label: `≤ ${filters.maxCalories} kcal`,
            clear: () => update({ maxCalories: null }),
          },
        ]
      : []),
    ...(filters.maxPrep
      ? [
          {
            key: "prep",
            label: `≤ ${filters.maxPrep} min`,
            clear: () => update({ maxPrep: null }),
          },
        ]
      : []),
    ...(filters.query.trim()
      ? [
          {
            key: "query",
            label: `“${filters.query.trim()}”`,
            clear: () => update({ query: "" }),
          },
        ]
      : []),
  ];

  return (
    <div className="container-full pb-20 sm:pb-28">
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FilterPanel
              filters={filters}
              onChange={update}
              facets={facets}
              onReset={reset}
              activeCount={activeCount}
            />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Toolbar */}
          <div className="sticky top-(--header-height) z-20 bleed-x mb-6 flex min-w-0 items-center justify-between gap-2 border-b border-line bg-bone/90 py-3 backdrop-blur-md lg:static lg:mx-0 lg:mb-6 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <p className="num shrink-0 text-sm text-fg-muted">
              <span className="font-bold text-ink">{products.length}</span>{" "}
              {products.length === 1 ? "meal" : "meals"}
            </p>

            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="press inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line-strong px-3.5 text-xs font-bold tracking-tight uppercase hover:border-ink lg:hidden"
              >
                <SlidersHorizontal className="size-3.5" aria-hidden />
                Filter
                {activeCount ? (
                  <span className="num grid size-5 place-items-center rounded-full bg-ink text-[0.65rem] text-on-ink">
                    {activeCount}
                  </span>
                ) : null}
              </button>

              <div className="relative min-w-0">
                <label htmlFor="shop-sort" className="sr-only">
                  Sort meals
                </label>
                <select
                  id="shop-sort"
                  value={filters.sort}
                  onChange={(event) =>
                    update({ sort: event.target.value as ShopFilters["sort"] })
                  }
                  className="h-11 max-w-[11.5rem] appearance-none rounded-full border border-line-strong bg-bone-100 pr-8 pl-3.5 text-xs font-bold tracking-tight uppercase outline-none focus:border-ink sm:max-w-none sm:pr-9 sm:pl-4"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden
                  viewBox="0 0 12 8"
                  className="pointer-events-none absolute top-1/2 right-3 h-2 w-3 -translate-y-1/2 text-fg-muted sm:right-4"
                >
                  <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active chips */}
          <AnimatePresence initial={false}>
            {chips.length ? (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex flex-wrap gap-2 overflow-hidden"
              >
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <button
                      type="button"
                      onClick={chip.clear}
                      className="press inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-on-ink"
                    >
                      {chip.label}
                      <X className="size-3.5" aria-hidden />
                      <span className="sr-only">Remove filter</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={reset}
                    className="press min-h-10 rounded-full border border-line-strong px-3.5 py-2 text-xs font-semibold text-fg-muted hover:border-ink hover:text-ink"
                  >
                    Clear all
                  </button>
                </li>
              </motion.ul>
            ) : null}
          </AnimatePresence>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line-strong px-6 py-20 text-center">
              <p className="font-display text-[length:var(--text-display-xs)] tracking-tight uppercase">
                No meals found. Tragic.
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-fg-muted">
                Your filters are stricter than our formulations. Loosen one and we will find you
                something creamy.
              </p>
              <Button onClick={reset} className="mt-6">
                Reset filters
              </Button>
            </div>
          ) : (
            <motion.div
              layout
              className={cn("grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3")}
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard
                      product={product}
                      priority={index < 3}
                      sizes="(min-width: 1280px) 26vw, (min-width: 640px) 44vw, 90vw"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Sheet
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="bottom"
        title="Filters"
        className="max-h-[85vh]"
      >
        <div className="flex h-full max-h-[85vh] flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6 pb-4 sm:px-6">
            <FilterPanel
              filters={filters}
              onChange={update}
              facets={facets}
              onReset={reset}
              activeCount={activeCount}
            />
          </div>
          <div className="safe-pb shrink-0 border-t border-line bg-bone-100 px-5 pt-4 sm:px-6">
            <Button onClick={() => setDrawerOpen(false)} size="lg" block>
              Show {products.length} {products.length === 1 ? "meal" : "meals"}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

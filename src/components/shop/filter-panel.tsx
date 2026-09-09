"use client";

import { Check } from "lucide-react";
import {
  calorieSteps,
  prepSteps,
  proteinSteps,
  type ShopFilters,
} from "@/lib/shop";
import { cn } from "@/lib/utils";

interface FacetOption<T extends string> {
  id: T;
  label: string;
  count: number;
}

export interface FilterPanelProps {
  filters: ShopFilters;
  onChange: (next: Partial<ShopFilters>) => void;
  facets: {
    categories: FacetOption<ShopFilters["categories"][number]>[];
    dietary: FacetOption<ShopFilters["dietary"][number]>[];
  };
  onReset: () => void;
  activeCount: number;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <legend className="kicker mb-4 text-fg-subtle">{title}</legend>
      {children}
    </fieldset>
  );
}

function CheckRow({
  checked,
  label,
  count,
  onToggle,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-[0.3rem] border transition-colors",
            checked
              ? "border-ink bg-ink text-on-ink"
              : "border-line-strong bg-bone-100 group-hover:border-ink",
          )}
        >
          {checked ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="sr-only"
          aria-label={label}
        />
        <span className="text-sm font-medium tracking-tight">{label}</span>
      </span>
      {typeof count === "number" ? (
        <span className="num text-xs text-fg-subtle">{count}</span>
      ) : null}
    </label>
  );
}

function StepRow<T extends number>({
  steps,
  value,
  onSelect,
  format,
  ariaLabel,
}: {
  steps: readonly T[];
  value: number | null;
  onSelect: (next: number | null) => void;
  format: (step: T) => string;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {steps.map((step) => {
        const active = value === step;
        return (
          <button
            key={step}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(active ? null : step)}
            className={cn(
              "press num rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
              active
                ? "border-ink bg-ink text-on-ink"
                : "border-line-strong text-fg-muted hover:border-ink hover:text-ink",
            )}
          >
            {format(step)}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPanel({
  filters,
  onChange,
  facets,
  onReset,
  activeCount,
}: FilterPanelProps) {
  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="font-display text-lg tracking-tight uppercase">Filter</p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="press text-xs font-semibold text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            Reset ({activeCount})
          </button>
        ) : null}
      </div>

      <Group title="Meal type">
        <div className="space-y-0.5">
          {facets.categories.map((option) => (
            <CheckRow
              key={option.id}
              label={option.label}
              count={option.count}
              checked={filters.categories.includes(option.id)}
              onToggle={() => onChange({ categories: toggle(filters.categories, option.id) })}
            />
          ))}
        </div>
      </Group>

      <Group title="Protein (minimum)">
        <StepRow
          steps={proteinSteps}
          value={filters.minProtein}
          onSelect={(next) => onChange({ minProtein: next })}
          format={(step) => `${step} g+`}
          ariaLabel="Minimum protein"
        />
      </Group>

      <Group title="Calories (maximum)">
        <StepRow
          steps={calorieSteps}
          value={filters.maxCalories}
          onSelect={(next) => onChange({ maxCalories: next })}
          format={(step) => `≤ ${step}`}
          ariaLabel="Maximum calories"
        />
      </Group>

      <Group title="Prep time">
        <StepRow
          steps={prepSteps}
          value={filters.maxPrep}
          onSelect={(next) => onChange({ maxPrep: next })}
          format={(step) => `≤ ${step} min`}
          ariaLabel="Maximum preparation time"
        />
      </Group>

      <Group title="Dietary preference">
        <div className="space-y-0.5">
          {facets.dietary.map((option) => (
            <CheckRow
              key={option.id}
              label={option.label}
              count={option.count}
              checked={filters.dietary.includes(option.id)}
              onToggle={() => onChange({ dietary: toggle(filters.dietary, option.id) })}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.7rem] leading-relaxed text-fg-subtle">
          Allergen information is shown on every product page. Final declarations follow
          formulation sign-off.
        </p>
      </Group>
    </div>
  );
}

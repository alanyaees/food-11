import { disclaimers } from "@/lib/brand";
import { getProducts, referenceMeals } from "@/lib/products";
import { proteinDensity } from "@/lib/utils";
import { DisclaimerNote } from "@/components/ui/concept-badge";
import { Reveal } from "@/components/ui/reveal";

function range(values: number[], decimals = 0) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const format = (value: number) => value.toFixed(decimals);
  return min === max ? format(min) : `${format(min)}–${format(max)}`;
}

/**
 * The honest comparison.
 *
 * Both columns are computed from data rather than typed in: the left
 * from the representative convenience meals in the catalogue, the right
 * from our own meals. The calories row is included
 * precisely because we do not win it — a comparison you always win is
 * a comparison nobody should believe.
 */
export function TradeOffTable() {
  const products = getProducts();

  const rows = [
    {
      label: "Protein",
      unit: "g",
      trade: "The first thing to go, and the one you notice by mid-afternoon.",
      reference: range(referenceMeals.map((meal) => meal.protein)),
      ours: range(products.map((product) => product.nutrition.protein)),
    },
    {
      label: "Protein per 100 kcal",
      unit: "g",
      trade: "The number that says whether a meal is protein-dense or simply large.",
      reference: range(
        referenceMeals.map((meal) => proteinDensity(meal.protein, meal.calories)),
        1,
      ),
      ours: range(
        products.map((product) =>
          proteinDensity(product.nutrition.protein, product.nutrition.calories),
        ),
        1,
      ),
    },
    {
      label: "Fibre",
      unit: "g",
      trade: "Quietly why a 500 kcal bowl can leave you hungry forty minutes later.",
      reference: range(referenceMeals.map((meal) => meal.fibre)),
      ours: range(products.map((product) => product.nutrition.fibre)),
    },
    {
      label: "Energy",
      unit: "kcal",
      trade: "Not a win for us. Convenience food is rarely high in calories — it just spends them badly.",
      reference: range(referenceMeals.map((meal) => meal.calories)),
      ours: range(products.map((product) => product.nutrition.calories)),
    },
    {
      label: "Time to eat",
      unit: "min",
      trade: "Also not a win. A protein bar is faster than anything with a kettle in it.",
      reference: range(referenceMeals.map((meal) => meal.prepMinutes)),
      ours: range(products.map((product) => product.prepMinutes)),
    },
  ];

  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl border border-line bg-bone-100">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Representative convenience meals compared with FULL. meals, across
            protein, protein density, fibre, energy and time to eat.
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="kicker px-4 py-4 text-fg-subtle sm:px-6 sm:py-5">
                The trade
              </th>
              <th
                scope="col"
                className="kicker px-2.5 py-4 text-right text-fg-subtle sm:px-6 sm:py-5"
              >
                Usually
              </th>
              <th
                scope="col"
                className="kicker bg-ink/[0.03] px-2.5 py-4 text-right text-ink sm:px-6 sm:py-5"
              >
                FULL.
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-b-0">
                <th scope="row" className="px-4 py-5 align-top font-normal sm:px-6 sm:py-6">
                  <span className="block text-[0.9375rem] font-semibold tracking-tight text-ink">
                    {row.label}
                  </span>
                  <span className="mt-1.5 block max-w-md text-[0.78rem] leading-relaxed text-fg-subtle sm:text-[0.8125rem]">
                    {row.trade}
                  </span>
                </th>
                <td className="px-2.5 py-5 text-right align-top sm:px-6 sm:py-6">
                  <span className="num font-display text-base font-extrabold tracking-tight whitespace-nowrap text-fg-subtle tabular-nums sm:text-xl">
                    {row.reference}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-fg-subtle">{row.unit}</span>
                </td>
                <td className="bg-ink/[0.03] px-2.5 py-5 text-right align-top sm:px-6 sm:py-6">
                  <span className="num font-display text-base font-extrabold tracking-tight whitespace-nowrap text-ink tabular-nums sm:text-2xl">
                    {row.ours}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-fg-muted">{row.unit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3 border-t border-line px-4 py-5 sm:px-6">
          <DisclaimerNote>{disclaimers.comparisonNote}</DisclaimerNote>
        </div>
      </div>
    </Reveal>
  );
}

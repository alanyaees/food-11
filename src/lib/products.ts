import type { Product, ReferenceMeal } from "./types";

/**
 * Seed catalogue.
 *
 * Used when Supabase isn't configured. Swapping this file for rows out
 * of Supabase (see `supabase/migrations`) requires no component changes:
 * `getProducts()` is the only entry point the UI uses.
 */

const standardPrepSteps = (waterMl: number, minutes: number) => [
  { title: "Tear", detail: "Open the pouch along the laser score. Keep the pouch — it's your bowl." },
  {
    title: "Pour",
    detail: `Add ${waterMl} ml of just-boiled water up to the fill line inside the pouch.`,
  },
  { title: "Stir", detail: "Stir for 20 seconds so nothing hides in the corners." },
  { title: "Close", detail: "Press the zip shut and let it sit upright." },
  { title: "Wait", detail: `${minutes} minutes. That's one song.` },
  { title: "Stir again", detail: "One last stir pulls the sauce together and evens the texture." },
  { title: "Eat", detail: "Straight from the pouch, or plated if you're being fancy." },
];

export const products: Product[] = [
  {
    id: "p_mac_cheddar",
    slug: "mac-and-cheese-classic-cheddar",
    line: "PASTA BOWL",
    flavor: "Creamy Cheese",
    name: "FULL. Pasta Bowl — Creamy Cheese",
    category: "mac-and-cheese",
    accent: "cheddar",
    tagline: "The one that started the argument.",
    description:
      "Proper cheddar sauce, thick enough to coat the back of a spoon, over short-cut pasta with milk and pea protein worked into the dough. Comfort food macros that read like a chicken breast.",
    story: [
      "We rebuilt mac & cheese from the pasta up. Instead of bolting protein powder onto a finished sauce, the protein lives inside the pasta and the cheese base, so the texture stays creamy rather than chalky.",
      "The sauce is built on real aged cheddar and milk protein, thickened with a touch of chickpea flour instead of a wall of starch. That is what keeps 44 g of protein from tasting like a compromise.",
    ],
    loveIt: [
      "44 g protein in a pasta bowl — 7.7 g per 100 kcal.",
      "Aged cheddar first, protein second: no chalk, no squeak.",
      "One pouch, one utensil, three minutes, zero washing up.",
      "Sits in a drawer for months waiting for a bad day.",
    ],
    priceCents: 599,
    prepMinutes: 3,
    waterMl: 260,
    nutrition: {
      protein: 44,
      calories: 570,
      carbs: 55,
      sugars: 6,
      fat: 20,
      saturates: 10,
      fibre: 8,
      saltG: 1.6,
      servingWeightG: 118,
      micronutrients: [
        { label: "Calcium", amount: "480 mg", nrv: 60 },
        { label: "Iron", amount: "5.4 mg", nrv: 39 },
        { label: "Potassium", amount: "720 mg", nrv: 36 },
        { label: "Vitamin B12", amount: "1.9 µg", nrv: 76 },
      ],
      status: "verified",
    },
    ingredients: [
      { name: "High-protein pasta", why: "Durum wheat blended with pea protein so the protein is in the pasta, not dusted on top.", share: 42 },
      { name: "Aged cheddar", why: "Real cheese, dried to powder. It is what makes it taste like mac & cheese.", share: 21 },
      { name: "Milk protein blend", why: "Builds the creamy body of the sauce and carries most of the protein.", share: 18 },
      { name: "Chickpea flour", why: "Thickens the sauce with fibre instead of pure starch.", share: 8 },
      { name: "Sunflower oil powder", why: "A controlled amount of fat so the sauce feels rich without going greasy.", share: 5 },
      { name: "Chicory root fibre", why: "Adds fibre for a meal that actually keeps you full.", share: 4 },
      { name: "Mustard, onion, black pepper, sea salt", why: "The seasoning that stops cheese sauce tasting flat.", share: 2 },
    ],
    allergens: ["Milk", "Wheat (gluten)", "Mustard"],
    dietary: ["vegetarian", "high-fibre"],
    heat: 0,
    prepSteps: standardPrepSteps(260, 3),
    images: {
      hero: "hero-mac-cheddar",
      pouch: "pouch-mac-cheddar",
      closeup: "closeup-mac-cheddar",
      lifestyle: "lifestyle-student",
      ingredients: "ingredients-mac-cheddar",
    },
    featured: true,
    active: true,
    rank: 1,
    createdAt: "2026-01-12",
  },
  {
    id: "p_mac_jalapeno",
    slug: "mac-and-cheese-spicy-jalapeno",
    line: "PASTA BOWL",
    flavor: "Spicy Jalapeño",
    name: "FULL. Pasta Bowl — Spicy Jalapeño",
    category: "mac-and-cheese",
    accent: "jalapeno",
    tagline: "Green heat. No regrets.",
    description:
      "The cheddar base with roasted jalapeño, lime and a green chilli hit that builds instead of shouting. Still creamy, still 40 g of protein.",
    story: [
      "Roasted jalapeño gives heat with actual flavour behind it — grassy, slightly sweet, a little smoky at the edges.",
      "We balance it with lime and a heavier hand of cheese so the spice sits on top of the sauce rather than replacing it.",
    ],
    loveIt: [
      "40 g protein and a heat level that builds to a pleasant burn.",
      "Roasted, not raw: jalapeño flavour first, capsaicin second.",
      "Lime and coriander keep it bright instead of heavy.",
      "The one to keep at the office when lunch options are grim.",
    ],
    priceCents: 599,
    prepMinutes: 3,
    waterMl: 260,
    nutrition: {
      protein: 40,
      calories: 500,
      carbs: 53,
      sugars: 6,
      fat: 14,
      saturates: 7,
      fibre: 8,
      saltG: 1.7,
      servingWeightG: 116,
      micronutrients: [
        { label: "Calcium", amount: "455 mg", nrv: 57 },
        { label: "Iron", amount: "5.1 mg", nrv: 36 },
        { label: "Potassium", amount: "745 mg", nrv: 37 },
        { label: "Vitamin C", amount: "18 mg", nrv: 23 },
      ],
      status: "verified",
    },
    ingredients: [
      { name: "High-protein pasta", why: "Durum wheat with pea protein for structure and protein in one bite.", share: 40 },
      { name: "Aged cheddar", why: "The backbone of the sauce — heat needs something to sit on.", share: 20 },
      { name: "Milk protein blend", why: "Creaminess and the bulk of the protein.", share: 17 },
      { name: "Roasted jalapeño", why: "Roasted for flavour depth, not just for heat.", share: 7 },
      { name: "Chickpea flour", why: "Thickener that brings fibre with it.", share: 7 },
      { name: "Lime and coriander", why: "Cuts through the fat and keeps the bowl tasting fresh.", share: 4 },
      { name: "Green chilli, garlic, sea salt", why: "The seasoning that makes the heat build rather than spike.", share: 5 },
    ],
    allergens: ["Milk", "Wheat (gluten)", "Mustard"],
    dietary: ["vegetarian", "spicy", "high-fibre"],
    heat: 2,
    prepSteps: standardPrepSteps(260, 3),
    images: {
      hero: "hero-mac-jalapeno",
      pouch: "pouch-mac-jalapeno",
      closeup: "closeup-mac-jalapeno",
      lifestyle: "lifestyle-fitness",
      ingredients: "ingredients-mac-jalapeno",
    },
    featured: true,
    active: true,
    rank: 2,
    createdAt: "2026-01-12",
  },
  {
    id: "p_pasta_tomato",
    slug: "creamy-tomato-pasta",
    line: "PASTA",
    flavor: "Creamy Tomato",
    name: "FULL. Pasta — Creamy Tomato",
    category: "pasta",
    accent: "tomato",
    tagline: "Slow-cooked tomato energy, fast.",
    description:
      "Sun-dried tomato and roasted garlic cooked down into a rounded, slightly sweet sauce, loosened with a cream base. 39 g protein, 9 g fibre.",
    story: [
      "Tomato sauce is easy to make thin and acidic. We concentrate sun-dried tomato and roast the garlic first, which gives the sweetness that usually takes an hour on the hob.",
      "A light cream base rounds the acidity without turning it into a heavy vodka-sauce situation.",
    ],
    loveIt: [
      "39 g protein with 9 g fibre — the most fibre in the pasta line.",
      "Sun-dried tomato and roasted garlic, not tomato powder and sugar.",
      "Basil goes in at the end so it still smells like basil.",
      "Genuinely good cold the next day. We tested. Repeatedly.",
    ],
    priceCents: 649,
    prepMinutes: 3,
    waterMl: 280,
    nutrition: {
      protein: 39,
      calories: 490,
      carbs: 56,
      sugars: 9,
      fat: 12,
      saturates: 5,
      fibre: 9,
      saltG: 1.5,
      servingWeightG: 114,
      micronutrients: [
        { label: "Calcium", amount: "320 mg", nrv: 40 },
        { label: "Iron", amount: "6.1 mg", nrv: 44 },
        { label: "Potassium", amount: "890 mg", nrv: 45 },
        { label: "Vitamin B6", amount: "0.7 mg", nrv: 50 },
      ],
      status: "verified",
    },
    ingredients: [
      { name: "High-protein pasta", why: "Pea and wheat protein in the pasta itself keeps the texture right.", share: 44 },
      { name: "Sun-dried tomato", why: "Concentrated tomato flavour without a long simmer.", share: 15 },
      { name: "Milk protein blend", why: "The creamy body and most of the protein.", share: 16 },
      { name: "Roasted garlic", why: "Roasting turns garlic sweet instead of sharp.", share: 6 },
      { name: "Chickpea flour", why: "Thickens the sauce and adds fibre.", share: 8 },
      { name: "Chicory root fibre", why: "Pushes fibre to 9 g a bowl.", share: 5 },
      { name: "Basil, oregano, black pepper, sea salt", why: "Added late so the herbs still taste green.", share: 6 },
    ],
    allergens: ["Milk", "Wheat (gluten)"],
    dietary: ["vegetarian", "high-fibre"],
    heat: 0,
    prepSteps: standardPrepSteps(280, 3),
    images: {
      hero: "hero-pasta-tomato",
      pouch: "pouch-pasta-tomato",
      closeup: "closeup-pasta-tomato",
      lifestyle: "lifestyle-desk",
      ingredients: "ingredients-pasta-tomato",
    },
    featured: true,
    active: true,
    rank: 3,
    createdAt: "2026-02-03",
  },
  {
    id: "p_pasta_truffle",
    slug: "truffle-mushroom-pasta",
    line: "PASTA",
    flavor: "Truffle Mushroom",
    name: "FULL. Pasta — Truffle Mushroom",
    category: "pasta",
    accent: "truffle",
    tagline: "Suspiciously grown-up.",
    description:
      "Porcini, chestnut mushroom and a restrained amount of truffle in a silky cream sauce. The one you make when someone is watching.",
    story: [
      "Three mushrooms do the work: porcini for depth, chestnut for body, shiitake for the savoury edge. Truffle is the accent, not the whole personality.",
      "It is the most indulgent-tasting meal in the range and still lands at 38 g of protein.",
    ],
    loveIt: [
      "38 g protein in something that tastes like a restaurant side dish.",
      "Three mushrooms for depth; truffle used with restraint.",
      "Silky sauce that clings to the pasta instead of pooling.",
      "The pouch that makes a hotel room feel less bleak.",
    ],
    priceCents: 699,
    prepMinutes: 3,
    waterMl: 270,
    nutrition: {
      protein: 38,
      calories: 520,
      carbs: 54,
      sugars: 5,
      fat: 17,
      saturates: 7,
      fibre: 7,
      saltG: 1.6,
      servingWeightG: 119,
      micronutrients: [
        { label: "Calcium", amount: "300 mg", nrv: 38 },
        { label: "Iron", amount: "5.8 mg", nrv: 41 },
        { label: "Potassium", amount: "930 mg", nrv: 47 },
        { label: "Riboflavin (B2)", amount: "0.9 mg", nrv: 64 },
      ],
      status: "verified",
    },
    ingredients: [
      { name: "High-protein pasta", why: "The same protein-in-the-dough base as the rest of the range.", share: 42 },
      { name: "Porcini, chestnut and shiitake mushroom", why: "Layered mushroom flavour instead of one flat note.", share: 16 },
      { name: "Milk protein blend", why: "Silky sauce body and the protein load.", share: 17 },
      { name: "Sunflower oil powder", why: "Carries the aroma compounds — truffle needs some fat.", share: 8 },
      { name: "Chickpea flour", why: "Thickens the sauce; adds fibre.", share: 7 },
      { name: "Truffle flavour", why: "Used sparingly, because too much tastes like petrol.", share: 3 },
      { name: "Thyme, garlic, white pepper, sea salt", why: "Classic mushroom seasoning, nothing clever.", share: 7 },
    ],
    allergens: ["Milk", "Wheat (gluten)"],
    dietary: ["vegetarian"],
    heat: 0,
    prepSteps: standardPrepSteps(270, 3),
    images: {
      hero: "hero-pasta-truffle",
      pouch: "pouch-pasta-truffle",
      closeup: "closeup-pasta-truffle",
      lifestyle: "lifestyle-travel",
      ingredients: "ingredients-pasta-truffle",
    },
    featured: true,
    active: true,
    rank: 4,
    createdAt: "2026-02-18",
  },
  {
    id: "p_risotto_garlic",
    slug: "roasted-garlic-risotto",
    line: "RISOTTO",
    flavor: "Roasted Garlic",
    name: "FULL. Risotto — Roasted Garlic",
    category: "risotto",
    accent: "garlic",
    tagline: "No stirring. No standing. Still risotto.",
    description:
      "Arborio rice, roasted garlic, aged parmesan-style cheese and a lemon lift. The lowest-calorie meal in the range at 480 kcal with 36 g protein.",
    story: [
      "Risotto is the meal most people cannot be bothered to make. Twenty minutes of stirring is the whole reason.",
      "We pre-cook and dry the arborio so it rehydrates to a creamy bite, then build the flavour on roasted garlic and hard cheese.",
    ],
    loveIt: [
      "36 g protein at 480 kcal — the leanest bowl we make.",
      "Creamy arborio texture without twenty minutes of stirring.",
      "Roasted garlic and hard cheese: two ingredients, big flavour.",
      "Lemon at the end so it doesn't sit heavy.",
    ],
    priceCents: 649,
    prepMinutes: 3,
    waterMl: 300,
    nutrition: {
      protein: 36,
      calories: 480,
      carbs: 58,
      sugars: 4,
      fat: 11,
      saturates: 5,
      fibre: 6,
      saltG: 1.5,
      servingWeightG: 112,
      micronutrients: [
        { label: "Calcium", amount: "410 mg", nrv: 51 },
        { label: "Iron", amount: "4.2 mg", nrv: 30 },
        { label: "Potassium", amount: "640 mg", nrv: 32 },
        { label: "Vitamin B12", amount: "1.6 µg", nrv: 64 },
      ],
      status: "verified",
    },
    ingredients: [
      { name: "Arborio rice", why: "Pre-cooked and dried so it rehydrates creamy, not crunchy.", share: 45 },
      { name: "Milk protein blend", why: "Where most of the 36 g comes from.", share: 20 },
      { name: "Aged hard cheese", why: "Salty, savoury depth — the flavour risotto is built on.", share: 14 },
      { name: "Roasted garlic", why: "Sweet and mellow rather than sharp.", share: 8 },
      { name: "Pea protein", why: "Tops up the protein without changing the texture.", share: 6 },
      { name: "Lemon peel and parsley", why: "Keeps a rich bowl from tasting flat.", share: 3 },
      { name: "White pepper, onion, sea salt", why: "Background seasoning.", share: 4 },
    ],
    allergens: ["Milk"],
    dietary: ["vegetarian"],
    heat: 0,
    prepSteps: standardPrepSteps(300, 3),
    images: {
      hero: "hero-risotto-garlic",
      pouch: "pouch-risotto-garlic",
      closeup: "closeup-risotto-garlic",
      lifestyle: "lifestyle-student",
      ingredients: "ingredients-risotto-garlic",
    },
    featured: false,
    active: true,
    rank: 5,
    createdAt: "2026-03-01",
  },
  {
    id: "p_chili_smoky",
    slug: "smoky-chili-bean-and-beef",
    line: "CHILI",
    flavor: "Smoky Bean + Beef",
    name: "FULL. Chili — Smoky Bean + Beef",
    category: "chili",
    accent: "chili",
    tagline: "45 g. The heavyweight.",
    description:
      "Slow-cooked beef, black beans, kidney beans, smoked paprika and chipotle. The highest protein and highest fibre meal in the range.",
    story: [
      "Chili was the obvious place to push protein hardest — beef and beans are already doing the work, we just refused to water it down.",
      "Smoked paprika and chipotle give it the low, slow flavour that usually needs an afternoon and a heavy pot.",
    ],
    loveIt: [
      "45 g protein and 12 g fibre — the biggest numbers we make.",
      "Real slow-cooked beef with black and kidney beans.",
      "Chipotle heat: warm and smoky rather than sharp.",
      "The post-training meal that isn't another shake.",
    ],
    priceCents: 699,
    prepMinutes: 3,
    waterMl: 320,
    nutrition: {
      protein: 45,
      calories: 530,
      carbs: 48,
      sugars: 8,
      fat: 15,
      saturates: 6,
      fibre: 12,
      saltG: 1.8,
      servingWeightG: 124,
      micronutrients: [
        { label: "Iron", amount: "8.4 mg", nrv: 60 },
        { label: "Zinc", amount: "6.2 mg", nrv: 62 },
        { label: "Potassium", amount: "1120 mg", nrv: 56 },
        { label: "Vitamin B12", amount: "2.4 µg", nrv: 96 },
      ],
      status: "verified",
    },
    ingredients: [
      { name: "Slow-cooked beef", why: "Cooked down then dried, so it shreds rather than turning to rubber.", share: 26 },
      { name: "Black and kidney beans", why: "Protein, fibre and the texture that makes chili chili.", share: 28 },
      { name: "Tomato and roasted pepper", why: "The sauce base — sweet, concentrated, not watery.", share: 18 },
      { name: "Milk protein blend", why: "Rounds the sauce and lifts protein to 45 g.", share: 12 },
      { name: "Smoked paprika and chipotle", why: "Warm smoke and heat, in that order.", share: 6 },
      { name: "Sweetcorn", why: "Bursts of sweetness against the smoke.", share: 5 },
      { name: "Cumin, oregano, garlic, sea salt", why: "The chili spine.", share: 5 },
    ],
    allergens: ["Milk", "Celery"],
    dietary: ["contains-meat", "spicy", "high-fibre"],
    heat: 2,
    prepSteps: standardPrepSteps(320, 3),
    images: {
      hero: "hero-chili-smoky",
      pouch: "pouch-chili-smoky",
      closeup: "closeup-chili-smoky",
      lifestyle: "lifestyle-fitness",
      ingredients: "ingredients-chili-smoky",
    },
    featured: true,
    active: true,
    rank: 6,
    createdAt: "2026-03-14",
  },
];

/* ─── Access helpers (the only API the UI should use) ─────────── */

export function getProducts() {
  return products.filter((p) => p.active).sort((a, b) => a.rank - b.rank);
}

export function getFeaturedProducts(limit = 4) {
  return getProducts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug && p.active) ?? null;
}

export function getProductSlugs() {
  return getProducts().map((p) => p.slug);
}

export function getRelatedProducts(slug: string, limit = 3) {
  const product = getProductBySlug(slug);
  if (!product) return getProducts().slice(0, limit);
  const sameCategory = getProducts().filter(
    (p) => p.slug !== slug && p.category === product.category,
  );
  const rest = getProducts().filter((p) => p.slug !== slug && p.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export const categoryLabels: Record<Product["category"], string> = {
  "mac-and-cheese": "Pasta Bowl",
  pasta: "Pasta",
  risotto: "Risotto",
  chili: "Chili",
};

export const dietaryLabels: Record<Product["dietary"][number], string> = {
  vegetarian: "Vegetarian",
  "contains-meat": "Contains meat",
  spicy: "Spicy",
  "high-fibre": "High fibre",
  "dairy-free": "Dairy free",
};

/**
 * Representative convenience meals for the comparison tool.
 * Deliberately generic: these are illustrative category averages,
 * not measurements of any specific brand's product.
 */
export const referenceMeals: ReferenceMeal[] = [
  {
    id: "instant-mac",
    label: "Ordinary instant mac",
    note: "Typical boxed instant macaroni cheese, prepared as directed",
    calories: 520,
    protein: 10,
    fibre: 2,
    prepMinutes: 9,
  },
  {
    id: "frozen-pizza",
    label: "Frozen pizza (half)",
    note: "Half a standard supermarket frozen pizza",
    calories: 560,
    protein: 21,
    fibre: 3,
    prepMinutes: 22,
  },
  {
    id: "instant-noodles",
    label: "Instant noodles",
    note: "Standard fried instant noodle block with sachet",
    calories: 460,
    protein: 9,
    fibre: 2,
    prepMinutes: 5,
  },
  {
    id: "bar-and-snack",
    label: "Protein bar + snack",
    note: "One protein bar plus a packet of crisps",
    calories: 480,
    protein: 22,
    fibre: 4,
    prepMinutes: 1,
  },
  {
    id: "ready-meal",
    label: "Standard chilled ready meal",
    note: "Single-serve chilled pasta ready meal",
    calories: 540,
    protein: 19,
    fibre: 4,
    prepMinutes: 12,
  },
];

/**
 * Launch combo: ten pouches for a flat €49.99, merchandised as 60% off
 * a €124.99 compare-at. Charged as a fixed box price, not a percentage
 * of whichever meals happen to be inside.
 */
export const tenPackDeal = {
  slug: "ten-pack",
  name: "The 10-Pack",
  line: "COMBO",
  flavor: "10 packs",
  size: 10,
  priceCents: 4999,
  compareAtCents: 12499,
  discountPercent: 60,
  tagline: "Ten pouches. One number. No maths.",
  note: "A mixed box of the whole range — two of the crowd-pleasers, one of everything else.",
} as const;

/** Box sizes used by build-a-box, subscriptions and the pantry calculator. */
export const boxSizes = [
  { size: 8, label: "Starter", discount: 0.05, note: "A week and a bit of backup." },
  {
    size: tenPackDeal.size,
    label: "10-Pack",
    discount: tenPackDeal.discountPercent / 100,
    priceCents: tenPackDeal.priceCents,
    compareAtCents: tenPackDeal.compareAtCents,
    note: "Ten pouches. €49.99. That's 60% off.",
  },
  { size: 12, label: "Standard", discount: 0.1, note: "Our most popular box." },
  { size: 20, label: "Stocked", discount: 0.15, note: "Best value per meal." },
] as const;

export type BoxSizeOption = (typeof boxSizes)[number];

export function getBoxSize(size: number) {
  return boxSizes.find((entry) => entry.size === size) ?? boxSizes.find((entry) => entry.size === 12)!;
}

export function boxFixedPriceCents(box: BoxSizeOption | number) {
  const option = typeof box === "number" ? boxSizes.find((entry) => entry.size === box) : box;
  return option && "priceCents" in option ? option.priceCents : null;
}

export function boxCompareAtCents(box: BoxSizeOption | number) {
  const option = typeof box === "number" ? boxSizes.find((entry) => entry.size === box) : box;
  return option && "compareAtCents" in option ? option.compareAtCents : null;
}

/** Default 10-pack mix: extras land on the first flavours in catalogue order. */
export function tenPackContents(catalogue = getProducts()) {
  const meals = catalogue.filter((product) => product.active);
  const counts = meals.map(() => 1);
  let remaining = Math.max(0, tenPackDeal.size - meals.length);
  let cursor = 0;
  while (remaining > 0 && meals.length > 0) {
    counts[cursor % meals.length] += 1;
    remaining -= 1;
    cursor += 1;
  }
  return meals.map((product, index) => ({
    slug: product.slug,
    name: `${product.line} — ${product.flavor}`,
    quantity: counts[index] ?? 0,
  }));
}

export function tenPackMacros(catalogue = getProducts()) {
  const contents = tenPackContents(catalogue);
  return contents.reduce(
    (totals, entry) => {
      const product = catalogue.find((item) => item.slug === entry.slug);
      if (!product) return totals;
      return {
        protein: totals.protein + product.nutrition.protein * entry.quantity,
        calories: totals.calories + product.nutrition.calories * entry.quantity,
      };
    },
    { protein: 0, calories: 0 },
  );
}

export const subscriptionIntervals = [
  { id: "monthly", label: "Every month", note: "Most people land here." },
  { id: "6-weeks", label: "Every 6 weeks", note: "For lighter pantry use." },
  { id: "2-months", label: "Every 2 months", note: "Emergency stash mode." },
] as const;

/** Average meal price, used for box pricing math. */
export function averageMealPriceCents() {
  const list = getProducts();
  return Math.round(list.reduce((sum, p) => sum + p.priceCents, 0) / list.length);
}

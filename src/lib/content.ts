import { brand } from "./brand";

/**
 * Long-form editorial copy for the story and policy pages.
 *
 * Kept out of the components so a copywriter (or a translator) can work
 * in one file without touching layout, and so every page has a single
 * place where claims are reviewed. Rule for this file: nothing here may
 * assert a shelf-life, health or certification claim we cannot support.
 * Anything still in testing is labelled in the copy itself.
 */

/* ─── Shared shapes ───────────────────────────────────────────── */

export interface SectionCopy {
  /** DOM id — also the anchor-nav target. */
  id: string;
  /** Short label for the on-page navigation. */
  nav: string;
  kicker: string;
  title: string;
  lead: string;
  body?: readonly string[];
  /** Honest caveat rendered as a small note under the section. */
  note?: string;
}

export type ProseBlock =
  | { kind: "p"; text: string }
  | { kind: "sub"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; caption?: string; head: string[]; rows: string[][] };

export interface ProseSection {
  id: string;
  title: string;
  blocks: ProseBlock[];
}

/* ─── /how-it-works ───────────────────────────────────────────── */

export const howItWorks = {
  hero: {
    kicker: "How it works",
    titleLines: ["Pouch", "to plate."],
    lead: "A recipe worth eating, dried down to something that fits in a drawer, and brought back with a kettle. Here is every step of that, including the parts we are still working on.",
    stats: [
      { label: "Moves", value: "5" },
      { label: "Utensils", value: "1" },
      { label: "Pans", value: "0" },
    ],
  },
  sections: {
    food: {
      id: "the-food",
      nav: "The food",
      kicker: "01 — The food",
      title: "It has to be food first.",
      lead: "Every meal starts as a recipe someone would actually cook — a cheddar sauce thick enough to coat the back of a spoon, tomato cooked down until it turns sweet, chili with beans that still have bite. Only then do we work out how to make it survive a drawer.",
      body: [
        "The order matters more than it sounds. Most instant food starts from the shelf-life problem and hopes flavour survives the trip. We start from the bowl and treat the pouch as a constraint to design around, not as the brief.",
        "Protein goes in at the recipe stage — worked into the pasta dough, built into the sauce base — instead of being dusted over a finished product. That is the entire reason a bowl can carry 40 g of protein and still taste like mac & cheese rather than a supplement with pasta in it.",
      ],
    },
    preservation: {
      id: "preservation",
      nav: "Preservation",
      kicker: "02 — Preservation",
      title: "We take out the water. Not the good part.",
      lead: "A cooked bowl of pasta is mostly water. Water is also why food spoils, why a ready meal weighs half a kilo and why it needs a fridge. So we take it out, and hand it back to you at the tap.",
      body: [
        "Drying food so it keeps is not a new idea — it is already how the pasta, rice, pulses and milk powder in your kitchen work. Nothing exotic is happening inside the pouch.",
        "What we are not doing: leaning on preservatives to hold together a formulation that cannot hold itself, or pretending the process is free. Some aromatics do fade when you dry them, so we season for the rehydrated bowl rather than for the dry mix.",
      ],
      note: "Always check the pouch for best-before dates, storage guidance and the full ingredient declaration.",
    },
    packaging: {
      id: "packaging",
      nav: "The pouch",
      kicker: "03 — The packaging",
      title: "The pouch is the pan, the bowl and the box.",
      lead: "One piece of packaging doing four jobs at once: keeping light, air and moisture out, standing up on its own on a counter, taking just-boiled water without complaint, and being the thing you eat from.",
      body: [
        "It also sets the portion. There is no cup to measure, no sachet to fish out of the bottom and no washing up, because the container you opened is the container you finish.",
      ],
      note: "Disposal guidance is printed on the pouch. Follow local recycling rules for your region.",
    },
    preparation: {
      id: "preparation",
      nav: "Preparation",
      kicker: "04 — Preparation",
      title: "Tear. Pour. Wait. Stir. Eat.",
      lead: "Five moves, one utensil, no hob. The only thing you have to get right is the fill line, and it is printed inside the pouch where you cannot miss it.",
      body: [
        "The wait is where the work happens: pasta and rice pull the water back in, the sauce thickens, and the whole thing goes from powder to dinner without you standing over it.",
      ],
      note: "Times shown are development targets for the current formulations and may change as recipes are finalised.",
    },
    macros: {
      id: "macros",
      nav: "The macros",
      kicker: "05 — The macros",
      title: "The number we design around.",
      lead: "Protein per 100 kcal. It is the only honest way to compare one meal to another, because anyone can raise protein by simply serving more food.",
      body: [
        "Fibre gets the same treatment. It is the difference between a 500 kcal bowl that holds you until evening and a 500 kcal bowl that sends you back to the cupboard in forty minutes.",
      ],
    },
  } satisfies Record<string, SectionCopy>,
  prepSteps: [
    {
      id: "tear",
      label: "Tear",
      title: "Open along the score.",
      detail: "Tear at the notch and keep the pouch upright. The pouch is your bowl — nothing else needs to come out of a cupboard.",
      seconds: 5,
    },
    {
      id: "pour",
      label: "Pour",
      title: "Just-boiled water to the line.",
      detail: "Fill to the line printed inside the pouch. Too little and the sauce goes claggy; too much and you have soup with ambitions.",
      seconds: 15,
    },
    {
      id: "wait",
      label: "Wait",
      title: "Zip it shut and leave it.",
      detail: "Press the zip closed and let it stand. This is the part where the pasta drinks the water back and the sauce thickens.",
      seconds: 180,
    },
    {
      id: "stir",
      label: "Stir",
      title: "One proper stir.",
      detail: "Twenty seconds, corners included. This is what pulls the sauce together and evens out the texture.",
      seconds: 20,
    },
    {
      id: "eat",
      label: "Eat",
      title: "Straight from the pouch.",
      detail: "Or plate it, if someone is watching. Either way there is one thing to wash and it is the fork.",
      seconds: 0,
    },
  ],
} as const;

/* ─── /why-full ───────────────────────────────────────────────── */

export interface Pillar {
  n: string;
  key: string;
  title: string;
  legacyVerdict: string;
  legacy: string;
  ours: string;
}

export const whyFull = {
  hero: {
    kicker: "Why FULL.",
    titleLines: ["Because", "convenience", "food got lazy."],
    lead: "Instant food cracked one problem in about 1958 and then stopped trying. Speed became the entire pitch, and everything else on the plate quietly became your problem.",
    subLead:
      "Six things a meal can be good at. The category solved one of them. We are building for all six.",
  },
  pillars: [
    {
      n: "01",
      key: "Time",
      title: "The one thing it did solve.",
      legacyVerdict: "Solved",
      legacy:
        "Credit where it is due: instant food genuinely gave people dinner in the time it takes to boil a kettle, and that changed how millions of people eat.",
      ours: "We are not trying to beat it on speed. Minutes, one utensil, no pan — we just refuse to accept that speed has to be the only thing on the list.",
    },
    {
      n: "02",
      key: "Nutrition",
      title: "Never actually in the brief.",
      legacyVerdict: "Not in the brief",
      legacy:
        "Convenience food has been optimised for cost, shelf life and shelf appeal for forty years. Nutrition was not the target it was being judged against, so it was not the thing that improved.",
      ours: "Every meal is designed backwards from what a working adult needs out of one sitting: protein, fibre, a sane amount of salt, and energy that is doing something useful.",
    },
    {
      n: "03",
      key: "Protein",
      title: "Ten grams is not a meal.",
      legacyVerdict: "Ignored",
      legacy:
        "A typical instant bowl lands around 10 g of protein. It is enough to be food. It is not enough to be a meal you can build a training day, a deadline or a recovery week around.",
      ours: "36–45 g per pouch, and up to 8.2 g per 100 kcal — because protein density, not protein on the front of the box, is the number that actually changes how full you feel.",
    },
    {
      n: "04",
      key: "Storage",
      title: "Food that waits for you.",
      legacyVerdict: "Half solved",
      legacy:
        "The cupboard options keep, but they are the options you settle for. The food you actually want to eat lives in a fridge, expires on a Tuesday and guilts you from the bottom shelf.",
      ours: "Water out means a flat pouch that sits in a drawer, a locker or a bag until the evening you need it — no fridge space, no countdown, no waste because you got home late.",
    },
    {
      n: "05",
      key: "Portability",
      title: "A meal that fits in a bag.",
      legacyVerdict: "Ignored",
      legacy:
        "Away from a kitchen, the options collapse into bars, shakes and whatever the petrol station has left. All snacks, all pretending to be dinner.",
      ours: "Flat, light, ambient. If you can find hot water — office, hotel, hostel, trailhead, on-call room — you can have an actual bowl of food instead of another bar.",
    },
    {
      n: "06",
      key: "Taste",
      title: "The part nobody is allowed to skip.",
      legacyVerdict: "Traded away",
      legacy:
        "Healthy convenience food has spent a decade asking people to be impressed by intentions. Nobody eats a second one out of respect.",
      ours: "We build comfort food — mac & cheese, creamy pasta, risotto, chili — because a meal you have to talk yourself into is a meal you eventually stop buying.",
    },
  ] satisfies readonly Pillar[],
  tradeOff: {
    kicker: "The honest version",
    title: "What convenience usually costs you.",
    lead: "Not a takedown of any particular product. Just the shape of the trade every one of us has made at 21:40 on a weeknight.",
  },
  close: {
    titleLines: ["Convenience", "without the", "compromise."],
    lead: "Start with one meal or build a box around your week. Either way, the numbers are on the label and the caveats are in writing.",
  },
} as const;

/* ─── /about ──────────────────────────────────────────────────── */

export const about = {
  hero: {
    kicker: "About",
    question: "Why is convenient food usually the food you have to compromise on?",
    /** Pre-broken so the question typesets as an editorial stack. */
    questionLines: [
      "Why is convenient",
      "food usually the",
      "food you have to",
      "compromise on?",
    ],
    lead: "We started with that question and could not find a good answer. Not a technical one, anyway — just forty years of habit, and a category that was never asked to do better.",
  },
  building: {
    id: "building",
    nav: "What we're building",
    kicker: "What we're building",
    title: "Comfort food that survives a drawer.",
    lead: "Shelf-stable, high-protein versions of the meals people genuinely want when they are tired: mac & cheese, creamy pasta, risotto, chili. Add hot water, wait, eat.",
    body: [
      "The technical part is not the hard part. Drying food is old. The hard part is refusing to let the format degrade the recipe — keeping a cheddar sauce creamy, keeping pasta with a bite, keeping 40 g of protein from tasting like a shortcut.",
      "So we work in one direction only: cook it properly first, then figure out how it keeps. When those two things fight, the recipe wins and the launch date moves.",
    ],
  },
  refuse: {
    id: "refuse",
    nav: "What we refuse",
    kicker: "What we refuse to do",
    title: "The list we hold ourselves to.",
    lead: "Some of this is a values statement. Most of it is just the set of shortcuts that would make this company faster to build and not worth building.",
    items: [
      {
        title: "No health claims we cannot support",
        body: "Food is food. We will not imply a meal prevents, treats or fixes anything, and we will not dress up nutrition as medicine.",
      },
      {
        title: "No invented credibility",
        body: "No invented press logos, no fabricated customer counts, no certifications we have not earned. If it is not real, it is not on the site.",
      },
      {
        title: "No protein at the expense of the meal",
        body: "If a formulation hits the macro target and tastes like a compromise, it does not ship. That has already cost us months and will cost us more.",
      },
      {
        title: "No dark patterns in the checkout",
        body: "Subscriptions you can skip, pause or cancel yourself, in the account you signed up with. No retention maze, no phone call, no guilt screen.",
      },
    ],
  },
  cooking: {
    id: "cooking",
    nav: "Not a replacement",
    kicker: "The point",
    title: "This is not here to replace cooking.",
    lead: "Cooking is better. It is better food, better for you, and better company. We are not competing with a Sunday roast or with someone's grandmother.",
    body: [
      "We are competing with the moments cooking does not fit — the 21:40 arrival home, the shift that ran three hours long, the hotel room with a kettle and no options, the week where the fridge is a science experiment.",
      "The realistic alternative in those moments is not a home-cooked meal. It is a bar, a delivery order you regret, or nothing. That is the bar we have to beat, and it is a very reachable bar.",
    ],
    quote: "We are not trying to replace dinner. We are trying to replace the times you skipped it.",
  },
  status: {
    id: "status",
    nav: "Where we are",
    kicker: "Where we are right now",
    title: "Where things stand.",
    lead: "FULL. is live. Here is a clear read on product, nutrition, packaging and availability.",
    items: [
      {
        label: "Product",
        state: "Available",
        body: "Mac & cheese, pasta, risotto and chili — high-protein comfort meals you can keep in a drawer and eat in minutes.",
      },
      {
        label: "Nutrition data",
        state: "Published",
        body: "Every value on this site is published for the current recipes. The pouch label is authoritative if anything differs.",
      },
      {
        label: "Packaging",
        state: "In market",
        body: "The pouch is the bowl. Tear, add water, eat — no pan, no microwave, no measuring jug.",
      },
      {
        label: "Food safety and labelling",
        state: "On pack",
        body: "Allergen declarations, storage guidance and best-before dates are printed on every pouch. Always check the pack.",
      },
      {
        label: "Availability",
        state: "Shipping",
        body: `We ship across the EU, starting close to home in ${brand.contact.city.replace(", NL", "")}.`,
      },
      {
        label: "Team",
        state: "Small",
        body: "A small founding team working on formulation, packaging and brand. We will introduce people properly when there is something to introduce them alongside.",
      },
    ],
  },
  principles: {
    id: "principles",
    nav: "Principles",
    kicker: "Stated intent",
    title: "How we intend to operate.",
    lead: "Principles, not achievements. These describe what we are holding ourselves to as we build — hold us to them too.",
    items: [
      {
        title: "Publish the numbers",
        body: "Full nutrition, full ingredient reasoning, and clear sourcing for every figure we show.",
      },
      {
        title: "Say the caveat when it matters",
        body: "If something is unproven or pending approval, it should be visible before the sales pitch, not buried in a footnote.",
      },
      {
        title: "Explain the ingredients",
        body: "Every ingredient on our list should come with a plain sentence about why it is in there. If we cannot explain it, it should not be in the recipe.",
      },
      {
        title: "Make it easy to leave",
        body: "Cancelling should take fewer clicks than subscribing. That is a design requirement, not a favour.",
      },
    ],
  },
} as const;

/* ─── /contact ────────────────────────────────────────────────── */

export const contact = {
  hero: {
    kicker: "Contact",
    titleLines: ["Talk to", "an actual", "person."],
    lead: "Your email lands in front of the people building the thing — not a ticket queue.",
  },
  expectation: {
    title: "What to expect",
    body: [
      "Email is read every weekday. We aim to reply within two working days, and if something needs a real answer rather than a fast one — a nutrition question, an allergen question — we will tell you it is taking longer instead of going quiet.",
      "For order tracking, returns or delivery windows, include your order details and we will point you to the right place.",
    ],
  },
  topics: [
    { value: "order", label: "Order" },
    { value: "product", label: "Product & nutrition" },
    { value: "wholesale", label: "Wholesale" },
    { value: "press", label: "Press" },
    { value: "other", label: "Something else" },
  ],
} as const;

export type ContactTopic = (typeof contact.topics)[number]["value"];

/* ─── Legal ───────────────────────────────────────────────────── */

export const legalMeta = {
  lastUpdated: "8 September 2026",
  reviewNotice:
    "This document describes how we operate the site and take orders. Nothing here is legal advice.",
} as const;

export const privacySections: ProseSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    blocks: [
      {
        kind: "p",
        text: `${brand.legalName} ("${brand.nameBare}", "we", "us") is a food company based in ${brand.contact.city}. When you use ${brand.domain}, sign up for our emails or place an order, we act as the controller of your personal data under the EU General Data Protection Regulation (GDPR).`,
      },
      {
        kind: "p",
        text: `For anything in this policy, including requests about your data, write to ${brand.contact.email}.`,
      },
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect and why",
    blocks: [
      {
        kind: "p",
        text: "We try to collect the minimum that makes the service work. Each category below is tied to a specific purpose and a specific legal basis — we do not keep data on the basis that it might be useful one day.",
      },
      {
        kind: "table",
        caption: "Categories of personal data",
        head: ["Data", "Why we have it", "Legal basis"],
        rows: [
          [
            "Account details (name, email, password hash)",
            "To give you an account, order history and a way to manage a subscription yourself",
            "Performance of a contract",
          ],
          [
            "Order and delivery details (address, phone, items, order notes)",
            "To take payment, ship the order, and handle returns or problems",
            "Performance of a contract",
          ],
          [
            "Payment data (card details, billing address)",
            "To charge you. Card numbers are entered on Stripe's systems and never reach our servers — we store only a payment reference, the last four digits and the card brand",
            "Performance of a contract",
          ],
          [
            "Marketing email address and preferences",
            "To send you product news and launch updates, if you asked for them",
            "Consent (withdrawable at any time)",
          ],
          [
            "Support messages sent through our contact form",
            "To answer you, and to keep a record of what we told you",
            "Legitimate interests (running a support function)",
          ],
          [
            "Analytics and device data (pages viewed, referrer, approximate region, device type)",
            "To understand which parts of the site are useful and where it breaks",
            "Consent, where required for non-essential cookies or similar technologies",
          ],
          [
            "Records of orders, invoices and tax data",
            "Because Dutch and EU tax law requires us to keep them",
            "Legal obligation",
          ],
        ],
      },
      {
        kind: "p",
        text: "We do not knowingly collect data from children, we do not build advertising profiles of you, and we do not sell personal data. We also do not ask for health data — if you volunteer medical or dietary information in a support message, we use it only to answer your question.",
      },
    ],
  },
  {
    id: "processors",
    title: "Who processes data for us",
    blocks: [
      {
        kind: "p",
        text: "We use a small number of established providers to run the site. They process personal data on our instructions under a data processing agreement, and the list below reflects our current intended stack for launch. We will keep it accurate as things change.",
      },
      {
        kind: "table",
        head: ["Processor", "Role", "Data involved"],
        rows: [
          ["Stripe", "Payments and fraud prevention", "Payment and billing data, order amounts"],
          ["Supabase", "Database, authentication and file storage", "Account, order and support data"],
          ["Vercel", "Website hosting and delivery", "Server and request logs, IP address"],
          ["Email delivery provider", "Transactional and marketing email", "Name, email address, email engagement"],
          ["Shipping carriers", "Delivering physical orders", "Name, delivery address, phone number"],
          ["Analytics provider", "Aggregate site usage measurement", "Pseudonymous usage and device data"],
        ],
      },
      {
        kind: "p",
        text: "Some of these providers are established in, or transfer data to, countries outside the European Economic Area. Where that happens we rely on the European Commission's Standard Contractual Clauses or an adequacy decision, and we will name the specific providers and safeguards in this policy before launch.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    blocks: [
      {
        kind: "p",
        text: "We use a small set of strictly necessary cookies and local storage to keep the site working — keeping you signed in, remembering what is in your cart, and holding your cookie choice. These do not require consent because the site cannot function without them.",
      },
      {
        kind: "p",
        text: "Anything beyond that — analytics and any future measurement of advertising — is only set after you agree, and you can change your mind at any time. Declining non-essential cookies does not restrict your access to the site or affect pricing.",
      },
    ],
  },
  {
    id: "retention",
    title: "How long we keep things",
    blocks: [
      {
        kind: "list",
        items: [
          "Account data: for as long as your account is open, then deleted or anonymised within 90 days of closure.",
          "Order, invoice and tax records: seven years from the end of the financial year, as required by Dutch tax law. This obligation overrides a deletion request for those specific records.",
          "Marketing consent and email engagement: until you unsubscribe, plus a short suppression record so we do not accidentally email you again.",
          "Support conversations: two years from the last message, so we can see what we previously told you.",
          "Analytics data: retained in aggregate; individual-level records kept no longer than 14 months.",
          "Server and security logs: up to 30 days, except where a log is needed to investigate an incident.",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your rights, and how to use them",
    blocks: [
      {
        kind: "p",
        text: "Under the GDPR you can ask us to do all of the following, free of charge, without needing to explain yourself.",
      },
      {
        kind: "list",
        items: [
          "Access — get a copy of the personal data we hold about you.",
          "Rectification — correct anything inaccurate or incomplete.",
          "Erasure — have your data deleted, except records we are legally required to keep.",
          "Restriction — have us pause processing while a dispute or correction is resolved.",
          "Portability — receive the data you gave us in a machine-readable format, or have it sent onward.",
          "Objection — object to processing we base on legitimate interests.",
          "Withdraw consent — unsubscribe from marketing or withdraw a cookie consent at any time, without affecting anything we did lawfully beforehand.",
        ],
      },
      {
        kind: "p",
        text: `To exercise any of these, email ${brand.contact.email} with the request and the email address on your account. We will respond within one month, and will tell you if we need to extend that (we may ask for something to verify who you are, so we do not hand your data to somebody else).`,
      },
      {
        kind: "p",
        text: "If you think we have handled your data badly, please tell us first — we would rather fix it. You also have the right to complain to the Dutch data protection authority, the Autoriteit Persoonsgegevens, or to the supervisory authority in your own EU country.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    blocks: [
      {
        kind: "p",
        text: "The site runs over HTTPS, passwords are stored as salted hashes by our authentication provider rather than by us, card data is handled by Stripe, and access to production data is limited to the people who need it. No system is perfect; if we ever suffer a breach that presents a risk to you, we will notify the supervisory authority within 72 hours and tell you directly where the law requires it.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    blocks: [
      {
        kind: "p",
        text: "We may update this policy as our stack and processes change. The date at the top always reflects the current version. For material changes we will email registered account holders rather than quietly editing the page.",
      },
    ],
  },
];

export const termsSections: ProseSection[] = [
  {
    id: "status",
    title: "About these products",
    blocks: [
      {
        kind: "p",
        text: `${brand.name} sells shelf-stable, high-protein meals through ${brand.domain}. Product descriptions, nutrition values, ingredient lists and prices on the site describe the meals we offer. Always check the pouch for the authoritative label.`,
      },
      {
        kind: "p",
        text: "Where these terms describe ordering, shipping or subscriptions, they describe how we operate when you buy from us.",
      },
    ],
  },
  {
    id: "these-terms",
    title: "About these terms",
    blocks: [
      {
        kind: "p",
        text: `These terms are between you and ${brand.legalName}, ${brand.contact.city}. They apply when you use the site and when you buy from us. If you are buying as a consumer in the EU, you keep every mandatory right your national law gives you — nothing in these terms takes those away, and where a clause conflicts with them, your statutory rights win.`,
      },
      {
        kind: "p",
        text: "Our company registration number, VAT number and full trading address appear on invoices and can be requested at the contact email above.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    blocks: [
      {
        kind: "p",
        text: "You can browse without an account. To place an order or manage a subscription you will need one, and you are responsible for keeping your login details to yourself and for what happens on your account. Tell us straight away if you think somebody else has access to it.",
      },
      {
        kind: "p",
        text: "You must be at least 18, or the age of majority where you live, to place an order or hold a subscription.",
      },
    ],
  },
  {
    id: "orders",
    title: "Ordering",
    blocks: [
      {
        kind: "p",
        text: "Placing an order is an offer to buy. The contract is formed when we send you an order confirmation email, not when the checkout page finishes loading. Until then we may decline an order — for example if an item is unavailable, if we cannot ship to your address, if a price was obviously wrong, or if we suspect fraud.",
      },
      {
        kind: "p",
        text: "If we cancel an order you have already paid for, we refund it in full to the original payment method.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing, VAT and payment",
    blocks: [
      {
        kind: "p",
        text: `Prices are shown in ${brand.currency.code} and include applicable VAT at the rate for your delivery country. Shipping is calculated and shown before you confirm the order, never added afterwards.`,
      },
      {
        kind: "p",
        text: "Payment is taken by Stripe. We do not see or store your full card details. If a payment fails on a subscription renewal we will retry it and email you; if it keeps failing we will pause the subscription rather than keep trying indefinitely.",
      },
      {
        kind: "p",
        text: "We may change prices, and we will not change the price of an order you have already placed. For subscriptions, we will give you notice before a price change takes effect on your next delivery, with time to cancel.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping and delivery",
    blocks: [
      {
        kind: "p",
        text: `At launch we intend to ship to ${brand.shipping.regions} Delivery estimates are estimates, not guarantees; carriers occasionally have bad weeks. Risk in the goods passes to you when you, or somebody you nominate, takes physical possession of them.`,
      },
      {
        kind: "p",
        text: "If a parcel arrives damaged, incomplete or clearly mishandled, contact us with a photograph within a reasonable period and we will replace or refund it. Do not eat anything from a pouch that is torn, punctured, swollen or open.",
      },
    ],
  },
  {
    id: "withdrawal",
    title: "Cancellation and withdrawal",
    blocks: [
      {
        kind: "p",
        text: "As an EU consumer buying online, you generally have 14 days from receiving the goods to withdraw from the purchase without giving a reason. We will honour that in full for unopened, undamaged pouches in a resaleable condition, and we will tell you exactly where to send them.",
      },
      {
        kind: "p",
        text: "EU consumer law provides exceptions to that right, and two of them can apply to food: goods that have been unsealed where returning them is not appropriate for reasons of hygiene or health protection, and goods that can deteriorate or expire quickly. We therefore cannot accept returns of opened, unsealed or prepared pouches.",
      },
      {
        kind: "sub",
        text: "In plain terms",
      },
      {
        kind: "list",
        items: [
          "Unopened pouches: send them back within 14 days for a refund.",
          "Opened pouches: no return, on hygiene grounds — but if a meal is faulty, contaminated or not what was described, that is a completely different situation and your statutory rights apply regardless.",
          "Something wrong with your order: tell us and we will fix it. We do not use the food exception as a way to avoid faults.",
        ],
      },
      {
        kind: "p",
        text: "Refunds go back to the original payment method. Where you exercise a withdrawal right, we refund standard outbound shipping as required by law; the cost of sending goods back to us is yours unless the item was faulty or wrongly supplied. The returns address is confirmed with your order confirmation and on the contact page.",
      },
    ],
  },
  {
    id: "food-safety",
    title: "Food safety, allergens and your responsibility",
    blocks: [
      {
        kind: "p",
        text: "Our meals are food. They are not medicine, not a treatment for any condition, and not designed to diagnose, prevent or cure anything. They are also not formulated as total diet replacement products, and no claim of that kind is made anywhere on this site.",
      },
      {
        kind: "p",
        text: "Always read the pouch. Allergen information, ingredients, storage instructions and preparation instructions on the physical packaging are the authoritative version — the website is a summary and can lag behind a recipe change.",
      },
      {
        kind: "list",
        items: [
          "If you have a food allergy, intolerance or medical dietary requirement, check the pack every time. Recipes and suppliers change.",
          "Our meals are prepared with just-boiled water. Handle it carefully, keep it away from children, and follow the fill line and the standing time on the pouch.",
          "If you are pregnant, managing a medical condition, or under clinical dietary supervision, talk to a doctor or dietitian about whether these meals fit your plan. We cannot give that advice.",
          "Allergen declarations and cross-contamination statements appear on the pouch. Always check the pack.",
        ],
      },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    blocks: [
      {
        kind: "p",
        text: "A subscription is a recurring order at the interval you chose. We email you before each delivery is prepared and charged, so a renewal is never a surprise, and you can act on that email.",
      },
      {
        kind: "list",
        items: [
          "Skip — skip a single upcoming delivery and stay on the same schedule.",
          "Pause — stop deliveries without losing your box configuration.",
          "Change — swap meals, change quantity or change the interval at any time before the next order is prepared.",
          "Cancel — cancel yourself from your account, at any time, with no notice period, no cancellation fee and no phone call. Cancelling stops future deliveries; it does not retroactively refund a delivery already dispatched.",
        ],
      },
      {
        kind: "p",
        text: "Any subscription discount applies to deliveries made while the subscription is active. If you cancel, the discount stops applying to future one-off orders.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "Using the site",
    blocks: [
      {
        kind: "p",
        text: "The site, the brand, the copy, the photography and the design are ours or our licensors', and are protected by copyright and trade mark law. You are welcome to read, share links and quote us with attribution. You may not scrape the site at scale, resell our content, use our brand to imply a partnership that does not exist, or use our product imagery to sell something else.",
      },
      {
        kind: "list",
        items: [
          "Do not attempt to break, overload, probe or gain unauthorised access to the site or our systems.",
          "Do not buy for commercial resale without a wholesale agreement with us in writing.",
          "Do not submit content, reviews or support messages that are unlawful, abusive or deliberately misleading.",
        ],
      },
      {
        kind: "p",
        text: "We may suspend an account that is used in any of those ways.",
      },
    ],
  },
  {
    id: "liability",
    title: "Liability",
    blocks: [
      {
        kind: "p",
        text: "We are responsible for loss or damage we cause by failing to meet our obligations under these terms or by negligence. We do not exclude or limit our liability for death or personal injury caused by our negligence, for fraud, for defective products under EU product liability rules, or for anything else that cannot lawfully be limited — including your statutory rights as a consumer.",
      },
      {
        kind: "p",
        text: "Beyond that, we are not liable for loss that was not foreseeable at the time of the contract, or for business losses such as lost profit, lost revenue or lost opportunity, since we supply to consumers for personal use. Site content — including nutrition figures, comparisons and preparation guidance — is provided for information and is not personalised nutritional, medical or professional advice.",
      },
    ],
  },
  {
    id: "law",
    title: "Governing law and disputes",
    blocks: [
      {
        kind: "p",
        text: "These terms are governed by Dutch law, and disputes may be brought before the competent courts of the Netherlands. If you are a consumer resident elsewhere in the EU, you keep the protection of the mandatory consumer law of your own country and may also bring proceedings in the courts there.",
      },
      {
        kind: "p",
        text: `Talk to us first — ${brand.contact.support} — because almost everything is easier to fix directly. EU consumers can also use the European Commission's online dispute resolution platform, and we will list any consumer dispute body we are affiliated with here once we launch.`,
      },
    ],
  },
];

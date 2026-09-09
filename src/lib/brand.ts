/**
 * Single source of truth for brand identity.
 *
 * Renaming the company is a one-file operation: change `name`,
 * `nameBare` and `domain` here and the entire site follows —
 * navigation, metadata, packaging artwork, emails, legal pages.
 */

export const brand = {
  /** Full lockup as it should be typeset, including the full stop. */
  name: "FULL.",
  /** Name without punctuation, for prose and metadata. */
  nameBare: "FULL",
  legalName: "FULL Foods B.V.",
  domain: "fullmeals.co",
  tagline: "Comfort food. Re-engineered.",
  /** Screen-printed line on the pouch. Mixed case on purpose. */
  packLine: "no B*llsh!t",
  shortPitch:
    "High-protein meals built for people who want convenience without sacrificing their macros.",
  description:
    "FULL. makes shelf-stable, high-protein comfort food. Tear the pouch, add hot water, eat in minutes — mac & cheese, pasta, risotto and chili engineered around protein and fibre instead of shelf life alone.",
  /** Rotating supporting lines used across sections and marquees. */
  phrases: [
    "Big taste. Better macros.",
    "Real meals. Serious protein.",
    "Your pantry just got stronger.",
    "Ready when you are.",
    "Add water. Add nothing else.",
    "Meals that work as hard as you do.",
    "Convenience shouldn't cost you your nutrition.",
    "Mac & cheese with macros that make sense.",
  ],
  footerStatement: "Food that fits your life.",
  newsletter: {
    heading: "Good food. Good numbers. Occasionally good emails.",
    placeholder: "you@email.com",
    cta: "Join",
  },
  contact: {
    email: "hello@fullmeals.co",
    support: "support@fullmeals.co",
    press: "press@fullmeals.co",
    city: "Amsterdam, NL",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
  currency: { code: "EUR", symbol: "€", locale: "en-IE" },
  shipping: {
    freeThresholdCents: 4500,
    flatRateCents: 490,
    regions: "The Netherlands, Belgium, Germany, France and Ireland.",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { label: "Meals", href: "/shop", description: "Every meal, filterable by macros" },
  { label: "How It Works", href: "/how-it-works", description: "Pouch to plate in three moves" },
  { label: "Nutrition", href: "/nutrition", description: "How we build a meal around protein" },
  { label: "Why FULL.", href: "/why-full", description: "Convenience food got lazy" },
  { label: "About", href: "/about", description: "The stupidly simple question" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "All meals", href: "/shop" },
      { label: "Compare meals", href: "/nutrition#compare" },
      { label: "Student survey", href: "/survey" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Our story", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Nutrition", href: "/nutrition" },
      { label: "Why FULL.", href: "/why-full" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Student survey", href: "/survey" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Nutrition data policy", href: "/nutrition#data" },
    ],
  },
];

/** Re-usable disclaimer copy shown in footers and nutrition panels. */
export const disclaimers = {
  conceptShort: "Nutrition data",
  conceptLong:
    "Nutrition values are as stated for each meal. Always check the pouch for the most up-to-date label information.",
  comparisonNote:
    "Comparison figures are representative examples of widely available convenience foods, used to illustrate our design approach. They are not measurements of any specific branded product.",
  noMedicalClaims:
    "FULL. meals are food, not medicine, and are not intended to diagnose, treat, cure or prevent any disease.",
  reviewsPlaceholder: "Reviews from confirmed orders will appear here.",
  testerFeedback: "Customer feedback",
  shelfLife:
    "Always check the pouch for best-before dates, allergen declarations and storage instructions.",
} as const;

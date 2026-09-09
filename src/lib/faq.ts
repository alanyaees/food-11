import type { ReactNode } from "react";
import { brand, disclaimers } from "./brand";
import { getProducts } from "./products";
import { proteinDensity } from "./utils";

/**
 * The FAQ, as data.
 *
 * `answer` is renderable (today always a string, so it can also be a
 * React node later) and `answerText` is the flattened version used for
 * FAQPage structured data — search engines get exactly the same words a
 * reader does, which is the only version of this that stays honest.
 */

export const faqCategories = [
  { id: "product", label: "Product", blurb: "What this actually is." },
  { id: "nutrition", label: "Nutrition", blurb: "Protein, allergens, diets." },
  { id: "preparation", label: "Preparation", blurb: "Water, time, technique." },
  { id: "subscription", label: "Coming soon", blurb: "What launches look like." },
  { id: "shipping", label: "Launch & storage", blurb: "Where, when, and shelf life." },
] as const;

export type FaqCategoryId = (typeof faqCategories)[number]["id"];

export interface FaqItem {
  /** Also the DOM id, so questions are directly linkable. */
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: ReactNode;
  /** Additional paragraphs, rendered after `answer`. */
  more?: string[];
  /** Plain-text version for JSON-LD. */
  answerText: string;
  links?: { label: string; href: string }[];
  /** Small caveat shown under the answer, for anything unverified. */
  note?: string;
}

/* Figures are read from the catalogue so the FAQ can never drift from
   the product pages. */
const catalogue = getProducts();
const proteinValues = catalogue.map((p) => p.nutrition.protein);
const minProtein = Math.min(...proteinValues);
const maxProtein = Math.max(...proteinValues);
const bestDensity = Math.max(
  ...catalogue.map((p) => proteinDensity(p.nutrition.protein, p.nutrition.calories)),
);
const prepValues = catalogue.map((p) => p.prepMinutes);
const minPrep = Math.min(...prepValues);
const maxPrep = Math.max(...prepValues);
const vegetarianCount = catalogue.filter((p) => p.dietary.includes("vegetarian")).length;
const allergenList = [...new Set(catalogue.flatMap((p) => p.allergens))].sort();

export const faqItems: FaqItem[] = [
  /* ── Product ─────────────────────────────────────────────── */
  {
    id: "what-is-full",
    category: "product",
    question: `What is ${brand.name}?`,
    answer:
      "Shelf-stable comfort food built around protein instead of around price. Mac & cheese, creamy pasta, risotto and chili that live in a drawer, not a fridge, and come back to life with just-boiled water.",
    more: [
      "The format is the ordinary part — dried food in a pouch has existed for decades. The unusual part is the brief: we design the recipe first, then make it keep, and we hold the protein and fibre targets while we do it.",
    ],
    answerText:
      "FULL. makes shelf-stable comfort food built around protein instead of around price: mac & cheese, creamy pasta, risotto and chili that store at room temperature and are prepared by adding just-boiled water. The format is ordinary; the brief is not. We design the recipe first, then make it keep, holding protein and fibre targets throughout.",
    links: [{ label: "How it works", href: "/how-it-works" }],
  },
  {
    id: "why-dehydrate",
    category: "product",
    question: "Why dehydrate the meals?",
    answer:
      "Because water is the heaviest, most fragile and least interesting thing in a cooked meal. Take it out and you get a flat pouch that stores at room temperature; put it back at the tap and you get the bowl again.",
    more: [
      "Drying food to make it storable is not new — it is already how the pasta, rice, pulses and milk powder in your kitchen work. It also means we do not need preservatives to compensate for a formulation that cannot hold itself together.",
      "It is not free, either. Some aromatics fade when you dry them, so we season for the rehydrated bowl rather than for the dry mix.",
    ],
    answerText:
      "Because water is the heaviest and most fragile part of a cooked meal. Removing it gives a flat pouch that stores at room temperature, and adding just-boiled water brings the meal back. Drying is already how pasta, rice, pulses and milk powder work, and it means we do not rely on preservatives to hold a formulation together. It does have a cost: some aromatics fade when dried, so we season for the rehydrated bowl rather than the dry mix.",
    links: [{ label: "The preservation concept", href: "/how-it-works#preservation" }],
  },
  {
    id: "refrigeration",
    category: "product",
    question: "Does it need refrigeration?",
    answer:
      "No. An unopened pouch is designed to live in a cupboard, a desk drawer, a locker or a bag at normal room temperature — out of direct sunlight and somewhere dry.",
    more: [
      "Once you have added water it is a cooked meal and should be treated like one: eat it while it is hot, and do not leave a prepared pouch sitting out.",
    ],
    answerText:
      "No. An unopened pouch is designed to be stored at normal room temperature, out of direct sunlight and somewhere dry — a cupboard, drawer, locker or bag. Once prepared it is a cooked meal and should be eaten while hot rather than left standing.",
    note: disclaimers.shelfLife,
  },
  {
    id: "how-long-does-it-keep",
    category: "product",
    question: "How long does it keep?",
    answer:
      "Longer than anything in your fridge, and we will give you the exact number when we can prove it. Storage life is being established through validation testing rather than estimated from similar products.",
    more: [
      "We know that is a less satisfying answer than a big number on a banner. A best-before date is a food safety statement, and it belongs to laboratory data and regulatory review — not to marketing.",
      "Once testing is complete, the validated date will appear on the pouch and on every product page.",
    ],
    answerText:
      "Storage life is currently being established through validation testing rather than estimated, so we are not publishing a figure yet. A best-before date is a food safety statement that has to come from laboratory data and regulatory review. Once testing is complete the validated date will appear on the pouch and on every product page.",
    note: disclaimers.shelfLife,
  },
  {
    id: "when-can-i-buy",
    category: "product",
    question: `Can I buy ${brand.name} yet?`,
    answer:
      "Not yet. We are pre-launch: formulations are in development, nutrition figures are concept targets, and packaging and labelling are still being finalised. This site exists so you can see what is being built and decide whether you want it.",
    answerText:
      "Not yet. FULL. is pre-launch: formulations are in development, nutrition figures are concept targets, and packaging and labelling are still being finalised. The site exists so you can see what is being built before it goes on sale.",
    links: [
      { label: "Where we are right now", href: "/about#status" },
      { label: "Ask us anything", href: "/contact" },
    ],
  },
  {
    id: "packaging-recycling",
    category: "product",
    question: "Is the pouch recyclable?",
    answer:
      "We are not going to claim that until it is true and verified. The pouch has to keep light, air and moisture out and take boiling water, which makes the materials science genuinely difficult, and we are working through the options with packaging partners.",
    more: [
      "When the final laminate is specified we will publish exactly what it is made of and exactly how to dispose of it, including the honest answer if the best available option is not kerbside recycling.",
    ],
    answerText:
      "We are not claiming recyclability until it is verified. The pouch has to block light, air and moisture and withstand boiling water, which makes the material choice difficult, and options are being worked through with packaging partners. When the final laminate is specified we will publish what it is made of and how to dispose of it, including if the best available route is not kerbside recycling.",
  },

  /* ── Nutrition ───────────────────────────────────────────── */
  {
    id: "meal-replacement",
    category: "nutrition",
    question: "Is this a meal replacement?",
    answer:
      "No — and the distinction matters legally as well as practically. These are meals: normal food, in normal portions, eaten instead of another meal you would have eaten anyway.",
    more: [
      "They are not formulated or sold as total diet replacement products, meal replacement products for weight control, or food for special medical purposes, and they are not designed to be the only thing you eat.",
      "Think of a pouch as what dinner looks like on the evenings cooking does not happen.",
    ],
    answerText:
      "No. These are meals — normal food in normal portions, eaten instead of another meal. They are not formulated or sold as total diet replacement products, meal replacement products for weight control, or food for special medical purposes, and they are not intended to be the only thing you eat.",
    note: disclaimers.noMedicalClaims,
  },
  {
    id: "how-much-protein",
    category: "nutrition",
    question: "How much protein is in a meal?",
    answer: `Between ${minProtein} g and ${maxProtein} g per pouch across the current range, reaching up to ${bestDensity} g of protein per 100 kcal.`,
    more: [
      "Protein density is the number we actually design around, because total protein can be raised by simply serving more food. Grams per 100 kcal tells you whether a meal is genuinely protein-dense or just large.",
      "Protein comes from the recipe rather than from a scoop stirred in at the end — it is built into the pasta dough and the sauce base, which is what keeps the texture creamy instead of chalky.",
    ],
    answerText: `Current concept formulations carry between ${minProtein} g and ${maxProtein} g of protein per pouch, reaching up to ${bestDensity} g of protein per 100 kcal. Protein density is the figure we design around, because total protein can be raised simply by serving more food. The protein is built into the pasta dough and sauce base rather than stirred in at the end.`,
    links: [{ label: "How we build a meal", href: "/nutrition" }],
    note: disclaimers.conceptLong,
  },
  {
    id: "allergens",
    category: "nutrition",
    question: "What allergens are present?",
    answer: `Across the current concept range, the allergens declared are ${allergenList.join(", ").toLowerCase()}. Every meal contains milk, and the pasta and mac & cheese meals contain wheat (gluten).`,
    more: [
      "Full allergen declarations, including any cross-contamination statements from the production site, are pending validation and regulatory review. Until that is complete, treat the figures on this site as indicative.",
      "The physical pouch is always the authoritative version. If you have an allergy or intolerance, read the pack every time — recipes and suppliers change.",
    ],
    answerText: `Across the current concept range the declared allergens are ${allergenList.join(", ").toLowerCase()}. Every meal contains milk, and the pasta and mac & cheese meals contain wheat (gluten). Full allergen declarations and any cross-contamination statements are pending validation and regulatory review, so website figures are indicative and the physical pack is always authoritative.`,
    links: [{ label: "Per-meal allergen detail", href: "/shop" }],
    note: disclaimers.shelfLife,
  },
  {
    id: "vegetarian",
    category: "nutrition",
    question: "Are there vegetarian options?",
    answer: `Yes — ${vegetarianCount} of the ${catalogue.length} meals in the current range are vegetarian. The mac & cheese, pasta and risotto meals are vegetarian; the chili contains beef.`,
    more: [
      "There is no vegan option yet, and we are not going to pretend otherwise: the creaminess in these recipes currently comes from dairy protein, and a plant-based version that hits the same texture and the same protein density is a separate development project rather than a swap.",
      "It is on the list. It will arrive when it is good, not when it is convenient.",
    ],
    answerText: `Yes. ${vegetarianCount} of the ${catalogue.length} meals in the current concept range are vegetarian — the mac & cheese, pasta and risotto meals — while the chili contains beef. There is no vegan option yet: the creaminess currently comes from dairy protein, and a plant-based version matching the same texture and protein density is a separate development project.`,
    links: [{ label: "Filter the range", href: "/shop" }],
  },
  {
    id: "salt-and-fibre",
    category: "nutrition",
    question: "What about salt, sugar and fibre?",
    answer:
      "Fibre is a design target rather than an accident — the range runs from 6 g to 12 g a bowl, which is the difference between a meal that holds you until evening and one that sends you back to the cupboard.",
    more: [
      "Salt is where dried food usually cheats, because salt is a cheap way to make a rehydrated sauce taste like something. We publish the figure per meal and we are working to bring it down without hollowing out the flavour.",
      "Added sugar is kept low; what sugar is declared comes mostly from dairy and from concentrated tomato and vegetables.",
    ],
    answerText:
      "Fibre is a design target: the current range runs from 6 g to 12 g per bowl. Salt is published per meal and is being reduced where possible without losing flavour — dried foods often lean on salt to make a rehydrated sauce taste right. Added sugar is kept low, and most declared sugars come from dairy and from concentrated tomato and vegetables.",
    links: [{ label: "Compare every meal", href: "/nutrition#compare" }],
    note: disclaimers.conceptLong,
  },

  /* ── Preparation ─────────────────────────────────────────── */
  {
    id: "how-to-prepare",
    category: "preparation",
    question: "How do I prepare it?",
    answer:
      "Tear the pouch at the notch, pour just-boiled water up to the fill line printed inside, stir, zip it shut, wait, stir again, eat.",
    more: [
      "No pan, no microwave, no measuring jug. The pouch is the bowl and it stands up on its own, so the only thing you need to get right is the fill line.",
      "The second stir is not optional theatre — it is what pulls the sauce together and evens out the texture after the pasta or rice has taken up the water.",
    ],
    answerText:
      "Tear the pouch at the notch, pour just-boiled water up to the fill line printed inside, stir, zip it shut, wait, stir again and eat. No pan, microwave or measuring jug is needed — the pouch is the bowl. The second stir matters: it pulls the sauce together and evens out the texture.",
    links: [{ label: "Watch the sequence", href: "/how-it-works#preparation" }],
  },
  {
    id: "prep-time",
    category: "preparation",
    question: "How long does preparation take?",
    answer:
      minPrep === maxPrep
        ? `${minPrep} minutes, almost all of which is standing time rather than your time.`
        : `${minPrep} to ${maxPrep} minutes depending on the meal, almost all of which is standing time rather than your time. Mac & cheese is the quickest; the chili takes the longest because beans and beef need longer to come back.`,
    more: [
      "Hands-on effort is roughly thirty seconds at the start and twenty seconds at the end. The rest of it happens while you are doing something else.",
    ],
    answerText:
      minPrep === maxPrep
        ? `${minPrep} minutes, almost all of it standing time rather than active effort — roughly thirty seconds of work at the start and twenty seconds at the end.`
        : `Between ${minPrep} and ${maxPrep} minutes depending on the meal, almost all of it standing time rather than active effort — roughly thirty seconds of work at the start and twenty seconds at the end. Mac & cheese is quickest; the chili takes longest because beans and beef need more time to rehydrate.`,
    note: "Preparation times are development targets for the current formulations and may change as recipes are finalised.",
  },
  {
    id: "travelling",
    category: "preparation",
    question: "Can I take it while travelling?",
    answer:
      "That is one of the reasons the format exists. A pouch is flat, light and ambient, so it goes in a bag without a cool pack, a container or a plan.",
    more: [
      "If you can get hot water — hotel kettle, office tap, hostel kitchen, train, on-call room, camp stove — you can have a bowl of food instead of another cereal bar.",
      "Two practical notes: airline and border rules on carrying food vary by country and by route, so check before you fly, and pack a fork.",
    ],
    answerText:
      "Yes — it is one of the reasons for the format. A pouch is flat, light and shelf-stable, so it travels without a cool pack or container, and anywhere with hot water becomes a place you can eat a proper bowl of food. Check airline and border rules on carrying food for your route, and pack a fork.",
    links: [{ label: "Portability, in detail", href: "/why-full" }],
  },
  {
    id: "cold-water",
    category: "preparation",
    question: "Can I use cold water, or a microwave?",
    answer:
      "Cold water will not work properly. Heat is what makes the pasta or rice take the water back and what melts the sauce base into a sauce — with cold water you get a cold, grainy bowl and a bad first impression.",
    more: [
      "Just-boiled water poured straight into the pouch is the intended method. If you would rather use a bowl and a microwave, you can — transfer the contents, add the same volume of water, and stir more often.",
    ],
    answerText:
      "Cold water will not work: heat is what makes the pasta or rice rehydrate and what turns the sauce base into a sauce. Just-boiled water poured into the pouch is the intended method. A bowl and a microwave also work — transfer the contents, add the same volume of water and stir more often.",
  },
  {
    id: "add-things",
    category: "preparation",
    question: "Can I add things to it?",
    answer:
      "Please do. A pouch is a base, not a rule — chicken, tuna, an egg, leftover roast vegetables, chilli oil, a spoon of yoghurt, more cheese if the day has been long.",
    more: [
      "Anything you add changes the nutrition figures on the label, which is worth remembering if you are tracking macros closely.",
    ],
    answerText:
      "Yes. A pouch works as a base — chicken, tuna, an egg, leftover vegetables, chilli oil or extra cheese all work. Anything you add changes the nutrition figures on the label, which matters if you are tracking macros closely.",
  },

  /* ── Subscription & orders ───────────────────────────────── */
  {
    id: "subscription",
    category: "subscription",
    question: "How does subscription work?",
    answer:
      "You choose the meals, the box size and how often it arrives — monthly, every six weeks or every two months. It repeats at that interval at a lower price per meal than buying one-off.",
    more: [
      "We email you before each box is prepared and charged, so a renewal is never a surprise. That email is also the moment to swap meals, change the size or skip the delivery entirely.",
      "Nothing about it is locked: no minimum number of deliveries, no contract length, no cancellation fee.",
    ],
    answerText:
      "You choose the meals, the box size and the interval — monthly, every six weeks or every two months — and it repeats at a lower price per meal than one-off orders. We email before each box is prepared and charged, and that email is the moment to swap meals, change the size or skip a delivery. There is no minimum number of deliveries, no contract length and no cancellation fee.",
    links: [{ label: "Explore meals", href: "/shop" }],
  },
  {
    id: "cancel",
    category: "subscription",
    question: "Can I cancel?",
    answer:
      "Yes, whenever you like, from your account, in a couple of clicks. No notice period, no cancellation fee, no phone call and no retention maze designed to wear you down.",
    more: [
      "You can also skip a single delivery or pause indefinitely if you just want a break rather than an exit — your box configuration is kept either way.",
      "Cancelling stops future deliveries. It does not refund a delivery that has already been dispatched.",
    ],
    answerText:
      "Yes — at any time, from your account, in a couple of clicks, with no notice period, no cancellation fee and no phone call. You can also skip a single delivery or pause indefinitely and keep your box configuration. Cancelling stops future deliveries but does not refund one already dispatched.",
    links: [{ label: "Contact us", href: "/contact" }],
  },
  {
    id: "when-charged",
    category: "subscription",
    question: "When am I charged, and how?",
    answer:
      "Payment is taken when each box is prepared for dispatch, not weeks ahead, and it is always preceded by an email. Card details are handled by Stripe — we never see or store your full card number.",
    more: [
      "If a payment fails we retry it and let you know. If it keeps failing we pause the subscription rather than quietly retrying forever.",
    ],
    answerText:
      "Payment is taken when each box is prepared for dispatch, preceded by an email notification. Card details are handled by Stripe and we never see or store your full card number. If a payment fails we retry and notify you; if it continues to fail we pause the subscription rather than retrying indefinitely.",
    links: [{ label: "Terms of sale", href: "/terms#pricing" }],
  },
  {
    id: "change-box",
    category: "subscription",
    question: "Can I change what's in my box?",
    answer:
      "Any time before the next box is prepared. Swap flavours, change quantities, change the interval, or replace the whole selection — it is your box, not a fixed bundle.",
    answerText:
      "Yes, at any time before the next box is prepared. You can swap flavours, change quantities, change the delivery interval or replace the entire selection.",
    links: [{ label: "Explore meals", href: "/shop" }],
  },

  /* ── Shipping & returns ──────────────────────────────────── */
  {
    id: "where-do-you-ship",
    category: "shipping",
    question: "Where do you ship?",
    answer: `At launch we plan to ship to ${brand.shipping.regions.replace(/\.$/, "")}, with more of the EU to follow as we grow the operation.`,
    more: [
      `Shipping is a flat rate and free over ${brand.currency.symbol}${(brand.shipping.freeThresholdCents / 100).toFixed(0)}. The exact rate for your country is shown at checkout before you confirm — never added afterwards.`,
      "Nothing is shipping yet. Carrier partners, delivery windows and per-country rates are still being confirmed, and this answer will be updated with the real detail before we start selling.",
    ],
    answerText: `At launch we plan to ship to ${brand.shipping.regions.replace(/\.$/, "")}, with more of the EU to follow. Shipping is a flat rate and free over ${brand.currency.symbol}${(brand.shipping.freeThresholdCents / 100).toFixed(0)}, with the exact rate for your country shown at checkout before you confirm. Nothing is shipping yet — carriers, delivery windows and per-country rates are still being confirmed.`,
  },
  {
    id: "delivery-time",
    category: "shipping",
    question: "How long will delivery take?",
    answer:
      "We do not have a truthful number for you yet. Delivery estimates depend on carrier contracts that are not signed, so publishing a figure now would be a guess dressed up as a promise.",
    more: [
      "Because the meals are shelf-stable there is no cold chain to fail, which removes the usual reason a food delivery has to be fast. A parcel that sits in a depot overnight is not a problem for this product.",
    ],
    answerText:
      "We are not publishing delivery estimates yet, because they depend on carrier contracts that are not finalised. Because the meals are shelf-stable there is no cold chain, so a parcel delayed in transit does not compromise the product.",
  },
  {
    id: "returns",
    category: "shipping",
    question: "What is your returns policy?",
    answer:
      "Unopened pouches: send them back within 14 days of delivery for a refund, as EU consumer law provides, no reason required.",
    more: [
      "Opened pouches: we cannot accept those back, on hygiene grounds — EU consumer rules allow that exception for sealed food that has been unsealed. We are not using it as a loophole.",
      "Anything faulty, damaged, contaminated or not as described is a different matter entirely, and your statutory rights apply in full. Send us a photograph and we will replace or refund it. Never eat from a pouch that arrives torn, punctured, swollen or open.",
      "The returns address and the precise scope of these rules will be confirmed after legal review, before we begin selling.",
    ],
    answerText:
      "Unopened pouches can be returned within 14 days of delivery for a refund under EU consumer withdrawal rules, with no reason required. Opened pouches cannot be returned on hygiene grounds, which EU rules permit for sealed food that has been unsealed. Faulty, damaged, contaminated or misdescribed items are a separate case and statutory rights apply in full — send a photograph and we will replace or refund. Never eat from a pouch that arrives torn, punctured, swollen or open. The returns address and precise scope will be confirmed after legal review before we begin selling.",
    links: [{ label: "Cancellation and withdrawal", href: "/terms#withdrawal" }],
  },
  {
    id: "damaged-order",
    category: "shipping",
    question: "My order arrived damaged or incomplete. What now?",
    answer:
      "Email us with a photograph of the parcel and the pouches and we will sort it — replacement or refund, your choice. We will not ask you to post a damaged parcel back before we help you.",
    answerText:
      "Email us with a photograph of the parcel and the pouches and we will arrange a replacement or a refund, whichever you prefer. We will not require you to return a damaged parcel before helping.",
    links: [{ label: "Contact us", href: "/contact" }],
  },
];

export function faqByCategory(category: FaqCategoryId) {
  return faqItems.filter((item) => item.category === category);
}

/** Flattened question/answer pairs for FAQPage structured data. */
export function faqStructuredData() {
  return faqItems.map((item) => ({
    question: item.question,
    answerText: item.note ? `${item.answerText} ${item.note}` : item.answerText,
  }));
}

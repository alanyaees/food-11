import { brand } from "./brand";
import { getAsset } from "./assets";
import type { Product } from "./types";
import { absoluteUrl } from "./utils";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.nameBare,
    legalName: brand.legalName,
    url: absoluteUrl("/"),
    description: brand.description,
    email: brand.contact.email,
    sameAs: brand.social.map((s) => s.href),
    slogan: brand.tagline,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/shop")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: Product) {
  const asset = getAsset(product.images.closeup) ?? getAsset(product.images.hero);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    description: product.description,
    image: asset ? [absoluteUrl(asset.path)] : undefined,
    brand: { "@type": "Brand", name: brand.nameBare },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: brand.currency.code,
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    },
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${product.nutrition.calories} kcal`,
      proteinContent: `${product.nutrition.protein} g`,
      carbohydrateContent: `${product.nutrition.carbs} g`,
      fatContent: `${product.nutrition.fat} g`,
      fiberContent: `${product.nutrition.fibre} g`,
      servingSize: `${product.nutrition.servingWeightG} g (dry)`,
    },
  };
}

export function faqSchema(items: { question: string; answerText: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answerText },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}
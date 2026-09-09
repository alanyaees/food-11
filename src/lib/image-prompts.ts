/**
 * Prompt architecture for brand imagery.
 *
 * Shared by the CLI generator (`scripts/generate-assets.mjs`) and the
 * protected admin studio (`/admin/image-studio`) so a developer picks a
 * product + image type + framing and a long, deliberate prompt is
 * assembled for them.
 *
 * Deliberate constraint: we never ask the model to render brand
 * typography. Packaging lettering is drawn in HTML/CSS/SVG by
 * `<Pouch />`, so generated pouches are described as unlabelled matte
 * packaging. That avoids the garbled-text problem entirely.
 */

export type ImageType =
  | "hero"
  | "package"
  | "closeup"
  | "lifestyle"
  | "ingredient"
  | "process"
  | "social"
  | "banner";

export type AspectRatio = "1:1" | "3:2" | "2:3" | "16:9";

export const imageTypeLabels: Record<ImageType, string> = {
  hero: "Hero",
  package: "Package shot",
  closeup: "Food close-up",
  lifestyle: "Lifestyle",
  ingredient: "Ingredient flat-lay",
  process: "Preparation / process",
  social: "Social advertisement",
  banner: "Website banner",
};

export const aspectToSize: Record<AspectRatio, string> = {
  "1:1": "1024x1024",
  "3:2": "1536x1024",
  "16:9": "1536x1024",
  "2:3": "1024x1536",
};

const CRAFT = [
  "Shot on a medium-format digital camera with a 100mm macro lens, f/4, natural falloff, extremely shallow but controlled depth of field.",
  "Photorealistic commercial food photography for a premium consumer packaged-goods campaign.",
  "Real food texture: visible steam, glossy sauce, individual pasta edges, micro-crumb detail, condensation, believable imperfection.",
  "Colour grading is warm-neutral and editorial, deep clean shadows, no HDR, no oversaturation, no plastic CGI look.",
  "Composition leaves calm negative space for typography.",
].join(" ");

const NO_TEXT =
  "Absolutely no text, no lettering, no logos, no labels, no numbers and no writing anywhere in the image; packaging surfaces are blank matte material. No watermarks, no borders, no collage, no split screens.";

const PALETTE =
  "Palette: warm bone/off-white surfaces, deep charcoal near-black props, brushed stainless steel, one accent colour from the food itself.";

const POUCH =
  "A minimal upright stand-up food pouch made of soft matte charcoal-black material with a clean unprinted front panel and a subtle matte-to-satin finish, industrial-design quality, sharp seams, resealable zip, standing perfectly upright.";

export interface PromptSpec {
  type: ImageType;
  /** Human description of the food, e.g. "creamy cheddar macaroni". */
  food?: string;
  /** Extra scene direction from the developer. */
  scene?: string;
  /** Style adjustments from the developer. */
  style?: string;
  aspect?: AspectRatio;
}

function subjectFor(spec: PromptSpec) {
  const food = spec.food?.trim() || "creamy high-protein macaroni and cheese";
  switch (spec.type) {
    case "hero":
      return `Hero advertising photograph: a generous bowl of ${food} as the unmistakable hero of the frame, thick sauce still moving, real steam rising, ${POUCH} standing slightly behind and to the side, softly out of focus. Studio set with a seamless warm bone-coloured backdrop and one large soft key light plus a hard rim light.`;
    case "package":
      return `Product photograph of ${POUCH} front-facing and dead-centre on a warm bone seamless surface, with a small styled portion of ${food} beside it. Crisp product lighting, soft realistic contact shadow, gentle gradient background.`;
    case "closeup":
      return `Extreme close-up, 45-degree angle, of ${food} in a matte ceramic bowl. Cheese pull or sauce ribbon caught mid-motion, steam curling through a hard side light, every surface detail readable. Background falls away into soft warm darkness.`;
    case "lifestyle":
      return `Candid editorial lifestyle photograph. ${spec.scene?.trim() || "A person in their twenties in a modern apartment kitchen pouring just-boiled water from a kettle into a matte black stand-up food pouch on the counter"}. The food and the pouch stay the hero; the person is naturally styled, relaxed, mid-action, never posing at the camera. Real interior, real daylight, film-like grain, documentary framing.`;
    case "ingredient":
      return `Overhead flat-lay, perfectly perpendicular camera, of the raw components of ${food} arranged in disciplined rows and small ceramic dishes on a warm bone stone surface: dry pasta shapes, cheese wedges, pulses and grains, fresh aromatics, coarse salt, cracked pepper, small spoons of powdered ingredients. Editorial food-styling geometry, soft directional daylight, crisp shadows.`;
    case "process":
      return `Sequential process photograph: ${spec.scene?.trim() || "just-boiled water being poured from a stainless kettle into a matte black stand-up pouch, thick steam catching the light"}. Dramatic single-source side lighting on a dark charcoal counter, water and steam frozen mid-motion, high shutter speed, hyper-real.`;
    case "social":
      return `Bold single-subject advertising image of ${food} on a solid colour-blocked background with strong graphic negative space on one side, high-contrast studio lighting, punchy but appetising, designed to stop a scroll.`;
    case "banner":
      return `Wide cinematic banner composition of ${food} positioned to one third of the frame, ${POUCH} nearby, generous empty space across the remaining two thirds for headline typography, soft gradient studio background.`;
  }
}

export function buildPrompt(spec: PromptSpec): string {
  return [
    subjectFor(spec),
    CRAFT,
    PALETTE,
    spec.style?.trim(),
    spec.type === "lifestyle" || spec.type === "process" ? spec.scene?.trim() : undefined,
    NO_TEXT,
  ]
    .filter(Boolean)
    .join(" ");
}

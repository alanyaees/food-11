#!/usr/bin/env node
/**
 * FULL. brand asset generator (development tool, server-side only).
 *
 * Generates the site's photography once with the OpenAI Images API,
 * optimises it to WebP in /public/images/brand and records it in
 * src/assets/manifest.json. The running site never calls OpenAI.
 *
 *   node scripts/generate-assets.mjs                 # missing assets only
 *   node scripts/generate-assets.mjs --only hero-mac-cheddar,lifestyle-student
 *   node scripts/generate-assets.mjs --force         # regenerate everything
 *   node scripts/generate-assets.mjs --list
 *   node scripts/generate-assets.mjs --concurrency 3 --quality high
 *
 * Requires OPENAI_API_KEY in .env.local or .env (never committed).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildPrompt, aspectToSize } from "../src/lib/image-prompts.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/brand");
const manifestPath = path.join(root, "src/assets/manifest.json");

for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const has = (name) => args.includes(`--${name}`);

const MODEL = flag("model", process.env.OPENAI_IMAGE_MODEL || "gpt-image-2");
const QUALITY = flag("quality", "high");
const CONCURRENCY = Number(flag("concurrency", "3"));
const ONLY = flag("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/* ── The asset set the site is designed around ─────────────────── */

const MAC = "creamy high-protein macaroni and cheese with a glossy aged-cheddar sauce clinging to short ridged pasta";

const ASSETS = [
  {
    key: "hero-mac-cheddar",
    type: "hero",
    aspect: "3:2",
    food: MAC,
    alt: "A bowl of creamy macaroni and cheese with steam rising, photographed in a studio beside a matte black meal pouch",
  },
  {
    key: "macro-hero-bowl",
    type: "closeup",
    aspect: "3:2",
    food: `${MAC}, a fork lifting a long strand of melted cheese`,
    style:
      "Dramatic chiaroscuro lighting, near-black background, the bowl lit like a jewellery product shot.",
    alt: "Extreme close-up of a fork lifting cheesy macaroni, with a cheese pull caught mid-air",
  },
  {
    key: "closeup-mac-cheddar",
    type: "closeup",
    aspect: "1:1",
    food: MAC,
    alt: "Close-up of creamy cheddar macaroni and cheese in a matte ceramic bowl",
  },
  {
    key: "closeup-mac-jalapeno",
    type: "closeup",
    aspect: "1:1",
    food:
      "creamy high-protein macaroni and cheese topped with charred roasted jalapeño slices, fresh coriander and a wedge of lime",
    alt: "Close-up of macaroni and cheese topped with roasted jalapeño slices and coriander",
  },
  {
    key: "closeup-pasta-tomato",
    type: "closeup",
    aspect: "1:1",
    food:
      "short pasta in a rich creamy sun-dried tomato sauce, deep terracotta red, finished with torn basil leaves",
    alt: "Close-up of pasta in a creamy sun-dried tomato sauce with fresh basil",
  },
  {
    key: "closeup-pasta-truffle",
    type: "closeup",
    aspect: "1:1",
    food:
      "pasta in a silky pale mushroom cream sauce with seared porcini and chestnut mushroom slices and a few shavings of black truffle",
    alt: "Close-up of pasta in a creamy mushroom sauce with seared mushrooms and truffle shavings",
  },
  {
    key: "closeup-risotto-garlic",
    type: "closeup",
    aspect: "1:1",
    food:
      "creamy arborio risotto with roasted garlic cloves, shaved hard cheese, cracked black pepper and a curl of lemon peel",
    alt: "Close-up of creamy risotto with roasted garlic and shaved hard cheese",
  },
  {
    key: "closeup-chili-smoky",
    type: "closeup",
    aspect: "1:1",
    food:
      "thick smoky chili with shredded slow-cooked beef, black beans, kidney beans, sweetcorn and smoked paprika oil pooling on the surface",
    alt: "Close-up of a thick smoky chili with shredded beef, beans and sweetcorn",
  },
  {
    key: "lifestyle-student",
    type: "lifestyle",
    aspect: "3:2",
    scene:
      "A stylish university student in a small modern flat, hoodie and headphones around the neck, standing at a cluttered-but-clean kitchen counter pouring boiling water from an electric kettle into a matte black stand-up food pouch; open laptop and lecture notes just visible behind, late-afternoon window light",
    alt: "A student in a modern flat pouring hot water into a matte black meal pouch on the kitchen counter",
  },
  {
    key: "lifestyle-fitness",
    type: "lifestyle",
    aspect: "3:2",
    scene:
      "An athletic young adult home from training, gym bag dropped by the door, sitting on a kitchen stool eating creamy macaroni and cheese from a matte black pouch with a spoon; warm evening light, no gym equipment on display, calm modern apartment",
    alt: "A young adult in gym clothes eating macaroni and cheese from a pouch at home after training",
  },
  {
    key: "lifestyle-desk",
    type: "lifestyle",
    aspect: "3:2",
    scene:
      "A late-night home office desk lit by a single warm lamp and a laptop screen, a matte black meal pouch with a spoon in it beside the keyboard, steam rising, notebook and glass of water nearby, no people in frame",
    alt: "A meal pouch with steam rising beside a laptop on a late-night desk",
  },
  {
    key: "lifestyle-travel",
    type: "lifestyle",
    aspect: "3:2",
    scene:
      "An open stylish canvas and leather backpack on a train seat, two flat matte black food pouches slid neatly inside next to a paperback and a stainless flask, window light and blurred landscape passing outside",
    alt: "Two flat matte black meal pouches packed inside a backpack on a train seat",
  },
  {
    key: "ingredients-mac-cheddar",
    type: "ingredient",
    aspect: "1:1",
    food: "high-protein cheddar macaroni: dry ridged pasta, aged cheddar wedges, milk powder, chickpea flour, mustard seed, cracked pepper, sea salt flakes",
    alt: "Overhead flat-lay of dry pasta, cheddar wedges, powders and seasonings arranged in neat rows",
  },
  {
    key: "ingredients-mac-jalapeno",
    type: "ingredient",
    aspect: "1:1",
    food: "spicy jalapeño cheddar macaroni: dry ridged pasta, aged cheddar wedges, roasted jalapeño slices, lime wedges, coriander, chickpea flour, cracked pepper",
    alt: "Overhead flat-lay of pasta, cheddar, roasted jalapeños, lime and coriander",
  },
  {
    key: "ingredients-pasta-tomato",
    type: "ingredient",
    aspect: "1:1",
    food: "creamy tomato pasta: dry pasta, sun-dried tomatoes, roasted garlic bulbs, fresh basil, chickpea flour, oregano, sea salt",
    alt: "Overhead flat-lay of dry pasta, sun-dried tomatoes, roasted garlic and basil",
  },
  {
    key: "ingredients-pasta-truffle",
    type: "ingredient",
    aspect: "1:1",
    food: "truffle mushroom pasta: dry pasta, dried porcini, fresh chestnut mushrooms, shiitake, thyme sprigs, a small black truffle, white pepper",
    alt: "Overhead flat-lay of dried porcini, fresh mushrooms, thyme and a black truffle",
  },
  {
    key: "ingredients-risotto-garlic",
    type: "ingredient",
    aspect: "1:1",
    food: "roasted garlic risotto: arborio rice, whole roasted garlic bulbs, a wedge of aged hard cheese, lemon peel, flat-leaf parsley, white pepper",
    alt: "Overhead flat-lay of arborio rice, roasted garlic, hard cheese and lemon peel",
  },
  {
    key: "ingredients-chili-smoky",
    type: "ingredient",
    aspect: "1:1",
    food: "smoky chili: black beans, kidney beans, shredded slow-cooked beef, dried chipotle chillies, smoked paprika, sweetcorn, cumin seeds, oregano",
    alt: "Overhead flat-lay of beans, shredded beef, dried chipotle chillies and smoked paprika",
  },
  {
    key: "process-pour",
    type: "process",
    aspect: "3:2",
    scene:
      "Just-boiled water pouring in a thin glass-clear stream from a matte black gooseneck kettle into an open matte black stand-up pouch on a charcoal stone counter, thick backlit steam, water surface breaking",
    alt: "Boiling water being poured from a kettle into an open matte black meal pouch",
  },
  {
    key: "process-steam",
    type: "process",
    aspect: "1:1",
    scene:
      "A sealed matte black stand-up pouch resting upright on a charcoal counter with steam escaping from the top seam, single hard rim light from behind, dark moody background",
    alt: "A sealed matte black meal pouch with steam escaping from the top",
  },
  {
    key: "banner-pantry",
    type: "banner",
    aspect: "3:2",
    food: MAC,
    style:
      "An open minimal kitchen cupboard shelf of neatly stacked flat matte black pouches occupies the left third, bowl of food front right, architectural daylight.",
    alt: "A kitchen shelf stacked with flat matte black meal pouches next to a bowl of macaroni and cheese",
  },
];

if (has("list")) {
  console.log(ASSETS.map((a) => `${a.key.padEnd(28)} ${a.type} ${a.aspect}`).join("\n"));
  process.exit(0);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error(
    "OPENAI_API_KEY is not set. Add it to .env.local — the site still runs without it,\n" +
      "falling back to CSS/SVG packaging artwork for every image slot.",
  );
  process.exit(1);
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    return { version: 1, assets: {} };
  }
}

let manifest = readManifest();
const saveManifest = () => {
  manifest.assets = Object.fromEntries(
    Object.entries(manifest.assets).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
};

fs.mkdirSync(outDir, { recursive: true });

const queue = ASSETS.filter((a) => {
  if (ONLY.length) return ONLY.includes(a.key);
  if (has("force")) return true;
  const existing = manifest.assets[a.key];
  return !existing || !fs.existsSync(path.join(root, "public", existing.path));
});

if (!queue.length) {
  console.log("Nothing to do — every asset is already generated.");
  process.exit(0);
}

console.log(
  `Generating ${queue.length} asset(s) with ${MODEL} (quality: ${QUALITY}, concurrency: ${CONCURRENCY})`,
);

async function generate(asset) {
  const prompt = buildPrompt({
    type: asset.type,
    food: asset.food,
    scene: asset.scene,
    style: asset.style,
    aspect: asset.aspect,
  });
  const size = aspectToSize[asset.aspect];
  const started = Date.now();

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, size, quality: QUALITY, n: 1 }),
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload?.error?.message || `HTTP ${res.status}`);
  }
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data in response");

  const raw = Buffer.from(b64, "base64");
  const maxWidth = asset.aspect === "1:1" ? 1280 : 1800;
  const webp = await sharp(raw)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
  const meta = await sharp(webp).metadata();
  const file = `${asset.key}.webp`;
  fs.writeFileSync(path.join(outDir, file), webp);

  manifest = readManifest();
  manifest.assets[asset.key] = {
    path: `/images/brand/${file}`,
    width: meta.width,
    height: meta.height,
    alt: asset.alt,
    model: MODEL,
    purpose: asset.type,
    createdAt: new Date().toISOString(),
  };
  saveManifest();

  console.log(
    `✓ ${asset.key} → ${file} (${Math.round(webp.length / 1024)} kB, ${Math.round(
      (Date.now() - started) / 1000,
    )}s)`,
  );
}

let cursor = 0;
let failures = 0;
async function worker() {
  while (cursor < queue.length) {
    const asset = queue[cursor++];
    try {
      await generate(asset);
    } catch (error) {
      failures++;
      console.error(`✗ ${asset.key}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

console.log(`Done. ${queue.length - failures}/${queue.length} generated.`);
if (failures) process.exitCode = 1;

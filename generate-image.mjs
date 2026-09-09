#!/usr/bin/env node
/**
 * Generate an image with the OpenAI Images API (gpt-image-1 by default).
 *
 * Usage:
 *   node generate-image.mjs "a bowl of ramen, studio photo" [options]
 *
 * Options:
 *   --size <1024x1024|1536x1024|1024x1536|auto>   (default: 1024x1024)
 *   --quality <low|medium|high|auto>              (default: high)
 *   --model <model-id>                            (default: gpt-image-1)
 *   --out <path>                                  (default: generated-images/<timestamp>.png)
 *
 * Reads OPENAI_API_KEY from .env in the project root.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

// --- load .env (no external deps) ---
// NOTE: .env takes precedence over the shell environment on purpose,
// so a stale OPENAI_API_KEY exported in your shell profile can't win.
const envPath = path.join(root, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY not found. Put it in .env or the environment.");
  process.exit(1);
}

// --- parse args ---
const args = process.argv.slice(2);
function opt(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const prompt = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--size"
  && args[args.indexOf(a) - 1] !== "--quality" && args[args.indexOf(a) - 1] !== "--model"
  && args[args.indexOf(a) - 1] !== "--out");

if (!prompt) {
  console.error('Usage: node generate-image.mjs "your prompt" [--size 1024x1024] [--quality high] [--model gpt-image-1] [--out file.png]');
  process.exit(1);
}

const size = opt("size", "1024x1024");
const quality = opt("quality", "high");
const model = opt("model", "gpt-image-1");

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.join(root, "generated-images");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.resolve(root, opt("out", path.join(outDir, `${stamp}.png`)));

// --- call the API ---
console.error(`Generating with ${model} (${size}, ${quality})...`);
const res = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ model, prompt, size, quality, n: 1 }),
});

const data = await res.json();
if (!res.ok) {
  console.error(`OpenAI API error (${res.status}): ${data?.error?.message ?? JSON.stringify(data)}`);
  process.exit(1);
}

const b64 = data?.data?.[0]?.b64_json;
if (b64) {
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
} else {
  // dall-e-2/3 style response with a URL
  const url = data?.data?.[0]?.url;
  if (!url) {
    console.error("Unexpected API response: no image data returned.");
    process.exit(1);
  }
  const img = await fetch(url);
  fs.writeFileSync(outPath, Buffer.from(await img.arrayBuffer()));
}

console.log(outPath);

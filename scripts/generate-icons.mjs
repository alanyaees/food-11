#!/usr/bin/env node
/**
 * Rasterises the brand mark and the social share card from hand-authored SVG.
 * Deterministic and offline: no AI images, no webfont dependency.
 *
 *   node scripts/generate-icons.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const appDir = path.join(root, "src/app");

const INK = "#0e0e0c";
const BONE = "#f4f1ea";
const EMBER = "#ff4a1c";

/** The same geometric F used by src/app/icon.svg, scaled into a 512 box. */
const markSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${INK}" />
  <g fill="${BONE}">
    <rect x="16" y="15" width="7.5" height="34" rx="1.5" />
    <rect x="16" y="15" width="26" height="7.5" rx="1.5" />
    <rect x="16" y="28.5" width="20" height="7.5" rx="1.5" />
  </g>
  <circle cx="45" cy="45" r="4.6" fill="${EMBER}" />
</svg>`;

/**
 * Pill row for the social card. Widths are measured from the string length
 * because the renderer has no text-metrics API — approximate but stable for
 * the uppercase Helvetica bold used here.
 */
function pills(items, { x, y, fontSize = 22, gap = 12 }) {
  let cursor = x;
  return items
    .map((label) => {
      const width = Math.round(label.length * fontSize * 0.66 + 40);
      const pill = `
      <rect x="${cursor}" y="${y}" width="${width}" height="44" rx="22" fill="none" stroke="${BONE}" stroke-opacity="0.28" />
      <text x="${cursor + 20}" y="${y + 29}" fill="${BONE}" font-size="${fontSize}" font-weight="700" letter-spacing="1">${label}</text>`;
      cursor += width + gap;
      return pill;
    })
    .join("");
}

/**
 * Social card. Typography is set with generic families only (Helvetica/Arial
 * stack) so the render is identical on any machine that runs this script.
 */
const socialSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#151512" />
      <stop offset="55%" stop-color="#0e0e0c" />
      <stop offset="100%" stop-color="#241a12" />
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.24" r="0.6">
      <stop offset="0%" stop-color="${EMBER}" stop-opacity="0.42" />
      <stop offset="100%" stop-color="${EMBER}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#warm)" />
  <rect width="1200" height="630" fill="url(#glow)" />

  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <text x="80" y="128" fill="${BONE}" font-size="52" font-weight="700" letter-spacing="-1">FULL<tspan fill="${EMBER}">.</tspan></text>

    <text x="80" y="288" fill="${BONE}" font-size="82" font-weight="700" letter-spacing="-3">COMFORT FOOD.</text>
    <text x="80" y="368" fill="${BONE}" font-size="82" font-weight="700" letter-spacing="-3" opacity="0.5">BETTER NUMBERS.</text>

    <text x="82" y="446" fill="${BONE}" font-size="25" opacity="0.66">High-protein meals for people who want</text>
    <text x="82" y="482" fill="${BONE}" font-size="25" opacity="0.66">convenience without sacrificing their macros.</text>

    ${pills(["42G PROTEIN", "6 MIN PREP", "ADD HOT WATER"], { x: 80, y: 528 })}
  </g>

  <!-- Abstract pouch silhouette, mirroring the CSS pouch component -->
  <g transform="translate(872 152)">
    <rect x="0" y="0" width="248" height="340" rx="26" fill="#1c1a16" stroke="${BONE}" stroke-opacity="0.14" />
    <rect x="26" y="26" width="218" height="16" rx="8" fill="${BONE}" fill-opacity="0.14" />
    <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700">
      <text x="26" y="112" fill="${BONE}" font-size="40" letter-spacing="-1">FULL<tspan fill="${EMBER}">.</tspan></text>
      <text x="26" y="176" fill="#f6c445" font-size="34" letter-spacing="-1">MAC</text>
      <text x="26" y="214" fill="#f6c445" font-size="34" letter-spacing="-1">+ CHEESE</text>
      <text x="26" y="300" fill="${BONE}" font-size="58" letter-spacing="-2">42G</text>
      <text x="26" y="330" fill="${BONE}" font-size="20" opacity="0.6" letter-spacing="2">PROTEIN</text>
    </g>
  </g>
</svg>`;

async function main() {
  const icon = Buffer.from(markSvg(512));

  await sharp(icon).png().toFile(path.join(appDir, "apple-icon.png"));
  await sharp(Buffer.from(socialSvg))
    .png({ quality: 92 })
    .toFile(path.join(appDir, "opengraph-image.png"));
  await fs.copyFile(
    path.join(appDir, "opengraph-image.png"),
    path.join(appDir, "twitter-image.png"),
  );

  console.log("wrote apple-icon.png, opengraph-image.png, twitter-image.png");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

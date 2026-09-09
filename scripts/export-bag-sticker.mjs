#!/usr/bin/env node
/**
 * Size FULL. stickers for the frosted zip bag (~13 × 20.5 cm face).
 *
 *   node scripts/export-bag-sticker.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = path.join(root, "public/brand");
const outDir = path.join(brandDir, "sticker");
const wordmarkPath = path.join(brandDir, "full-wordmark-dark.png");

const DPI = 300;
const cmToPx = (cm) => Math.round((cm / 2.54) * DPI);

/** Bag usable face from tape measure */
const BAG = { widthCm: 13, heightCm: 20.5 };

/**
 * Primary sticker: 9cm wide overall — ~69% of bag width, covers ZIPIT,
 * ~2cm margin each side on the 13cm face. White panel so frost + ZIPIT
 * don't show through.
 */
const STICKER_WIDTH_CM = 9;
const BLEED_CM = 0.3; // 3mm standard print bleed
/** Inset from sticker edge to wordmark (fraction of sticker width). */
const PAD_RATIO = 0.12;

fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(wordmarkPath)) {
  console.error("Missing wordmark. Run: node scripts/export-logo-png.mjs");
  process.exit(1);
}

const wordmarkMeta = await sharp(wordmarkPath).metadata();
const aspect = wordmarkMeta.width / wordmarkMeta.height;

async function exportSticker({
  file,
  widthCm,
  background,
  withBleed = false,
  label,
}) {
  // widthCm is the final trim width of the sticker panel
  const panelW = cmToPx(widthCm);
  const padX = Math.round(panelW * PAD_RATIO);
  const contentW = panelW - padX * 2;
  const contentH = Math.round(contentW / aspect);
  const padY = Math.round(panelW * PAD_RATIO * 0.95);
  const panelH = contentH + padY * 2;

  const bleedPx = withBleed ? cmToPx(BLEED_CM) : 0;
  const canvasW = panelW + bleedPx * 2;
  const canvasH = panelH + bleedPx * 2;

  const logo = await sharp(wordmarkPath)
    .resize(contentW, contentH, { fit: "fill" })
    .png()
    .toBuffer();

  const isTransparent = background === "transparent";
  const base = sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: isTransparent
        ? { r: 0, g: 0, b: 0, alpha: 0 }
        : { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  const composed = await base
    .composite([
      {
        input: logo,
        left: bleedPx + padX,
        top: bleedPx + padY,
      },
    ])
    .withMetadata({ density: DPI })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const outPath = path.join(outDir, file);
  fs.writeFileSync(outPath, composed);

  const trimW = panelW / DPI * 2.54;
  const trimH = panelH / DPI * 2.54;
  console.log(
    `✓ ${file}\n` +
      `  ${label}\n` +
      `  trim: ${trimW.toFixed(2)} × ${trimH.toFixed(2)} cm` +
      (withBleed
        ? `  |  with bleed: ${((canvasW / DPI) * 2.54).toFixed(2)} × ${((canvasH / DPI) * 2.54).toFixed(2)} cm`
        : "") +
      `\n  ${canvasW} × ${canvasH} px @ ${DPI} DPI\n`,
  );

  return { outPath, panelW, panelH, canvasW, canvasH, trimW, trimH };
}

// ── Print files ──────────────────────────────────────────────
const primary = await exportSticker({
  file: "full-sticker-9cm-white.png",
  widthCm: STICKER_WIDTH_CM,
  background: "white",
  withBleed: false,
  label: "SEND THIS — white sticker, covers ZIPIT on frosted bag",
});

await exportSticker({
  file: "full-sticker-9cm-white-bleed.png",
  widthCm: STICKER_WIDTH_CM,
  background: "white",
  withBleed: true,
  label: "Same + 3mm bleed (for print shops that ask for it)",
});

await exportSticker({
  file: "full-sticker-9cm-diecut.png",
  widthCm: STICKER_WIDTH_CM,
  background: "transparent",
  withBleed: false,
  label: "Kiss-cut / clear vinyl (ZIPIT may show through — white preferred)",
});

await exportSticker({
  file: "full-sticker-7cm-white.png",
  widthCm: 7,
  background: "white",
  withBleed: false,
  label: "Smaller option if 9cm feels big",
});

// ── Spec note the print company can read ─────────────────────
const spec = `FULL. bag sticker — print spec
================================

Bag (measured): ~${BAG.widthCm} cm wide × ${BAG.heightCm} cm tall frosted zip pouch
Orange zip seal ~matches brand ember #ff4a1c

Primary sticker to print:
  File:     full-sticker-9cm-white.png
  Trim:     ${primary.trimW.toFixed(2)} × ${primary.trimH.toFixed(2)} cm
  Resolution: ${DPI} DPI
  Colors:   Ink #0e0e0c + ember #ff4a1c on white
  Finish:   Matte vinyl preferred (matches frosted bag)
  Cut:      Rounded rectangle, ~3–4 mm corner radius
  Qty note: Place centered on bag face to cover existing ZIPIT print

Optional:
  full-sticker-9cm-white-bleed.png — same art + 3 mm bleed all sides
  full-sticker-9cm-diecut.png     — transparent / kiss-cut to wordmark
  full-sticker-7cm-white.png      — smaller alternate

Do not scale below 300 DPI.
`;

fs.writeFileSync(path.join(outDir, "PRINT-SPEC.txt"), spec);
console.log("✓ PRINT-SPEC.txt");

// ── Mockup on the measured bag photo ─────────────────────────
const bagPhoto =
  "/Users/alan/.cursor/projects/Users-alan-Desktop-food-11/assets/IMG_4354-711d0bb5-6e33-4ecd-8eb6-87011f8e994e.jpg";

if (fs.existsSync(bagPhoto)) {
  const bag = sharp(bagPhoto);
  const bagMeta = await bag.metadata();
  const bw = bagMeta.width;
  const bh = bagMeta.height;

  // Photo is landscape: orange zip along the top of the frame.
  // Bag face spans most of the frame; place sticker centered on ZIPIT area.
  const stickerOnBag = await sharp(primary.outPath)
    .resize({
      // Sticker is 9cm on a 13cm-wide face → ~69% of bag width in photo
      width: Math.round(bw * 0.52),
    })
    .png()
    .toBuffer();

  const stickerMeta = await sharp(stickerOnBag).metadata();
  const left = Math.round((bw - stickerMeta.width) / 2);
  // Slightly above geometric center — ZIPIT sits mid-face below the zip
  const top = Math.round(bh * 0.38 - stickerMeta.height / 2);

  // Soft shadow under sticker for realism
  const shadow = await sharp({
    create: {
      width: stickerMeta.width,
      height: stickerMeta.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.18 },
    },
  })
    .blur(8)
    .png()
    .toBuffer();

  const mockupPath = path.join(outDir, "mockup-on-bag.jpg");
  await sharp(bagPhoto)
    .composite([
      { input: shadow, left: left + 4, top: top + 6 },
      { input: stickerOnBag, left, top },
    ])
    .jpeg({ quality: 90 })
    .toFile(mockupPath);

  console.log(`\n✓ mockup-on-bag.jpg  (${bw}×${bh})`);
}

console.log(`\nAll files → ${outDir}`);

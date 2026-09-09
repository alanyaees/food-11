#!/usr/bin/env node
/**
 * Export the FULL. wordmark as print-ready PNGs.
 * Uses the site's display font (Bricolage Grotesque) and brand colors.
 *
 *   node scripts/export-logo-png.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/brand");
const fontPath = path.join(root, "scripts/.fonts/BricolageGrotesque.ttf");
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(fontPath)) {
  console.error("Missing font at scripts/.fonts/BricolageGrotesque.ttf");
  process.exit(1);
}

const fontDataUri = `data:font/ttf;base64,${fs.readFileSync(fontPath).toString("base64")}`;

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VARIANTS = [
  {
    file: "full-wordmark-dark.png",
    label: "Ink + ember on transparent (for light bags)",
    fg: "#0e0e0c",
    bg: "transparent",
  },
  {
    file: "full-wordmark-light.png",
    label: "Bone + ember on transparent (for dark bags)",
    fg: "#f4f1ea",
    bg: "transparent",
  },
  {
    file: "full-wordmark-on-white.png",
    label: "Ink + ember on white",
    fg: "#0e0e0c",
    bg: "#ffffff",
  },
  {
    file: "full-wordmark-on-ink.png",
    label: "Bone + ember on ink",
    fg: "#f4f1ea",
    bg: "#0e0e0c",
  },
];

const EMBER = "#ff4a1c";
// Large enough for print shops to downscale (~4"+ at 300 DPI)
const FONT_PX = 720;
const PAD_X = 120;
const PAD_Y = 100;

function html(variant) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @font-face {
      font-family: "Bricolage Grotesque";
      src: url("${fontDataUri}") format("truetype");
      font-weight: 100 900;
      font-style: normal;
      font-display: block;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background: ${variant.bg};
      width: max-content;
      height: max-content;
    }
    #mark {
      display: inline-block;
      font-family: "Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif;
      font-weight: 800;
      font-optical-sizing: auto;
      font-size: ${FONT_PX}px;
      line-height: 0.85;
      letter-spacing: -0.06em;
      text-transform: uppercase;
      color: ${variant.fg};
      padding: ${PAD_Y}px ${PAD_X}px;
      white-space: nowrap;
      -webkit-font-smoothing: antialiased;
    }
    #mark .dot { color: ${EMBER}; }
  </style>
</head>
<body>
  <div id="mark">FULL<span class="dot">.</span></div>
</body>
</html>`;
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await document.fonts.load('800 720px "Bricolage Grotesque"');
    await document.fonts.ready;
  });
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=none"],
});

try {
  for (const variant of VARIANTS) {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(10_000);
    await page.setViewport({ width: 4000, height: 2000, deviceScaleFactor: 1 });
    await page.setContent(html(variant), { waitUntil: "domcontentloaded" });
    await waitForFonts(page);

    const el = await page.$("#mark");
    const box = await el.boundingBox();
    const outPath = path.join(outDir, variant.file);
    await el.screenshot({
      path: outPath,
      omitBackground: variant.bg === "transparent",
      type: "png",
    });
    await page.close();

    const stat = fs.statSync(outPath);
    console.log(
      `✓ ${variant.file}  ${Math.round(box.width)}×${Math.round(box.height)}px  ${Math.round(stat.size / 1024)} KB  — ${variant.label}`,
    );
  }

  // Geometric F mark from icon.svg at print size
  const iconSvg = fs.readFileSync(path.join(root, "src/app/icon.svg"), "utf8");
  const iconPage = await browser.newPage();
  await iconPage.setViewport({ width: 2048, height: 2048, deviceScaleFactor: 1 });
  await iconPage.setContent(
    `<!DOCTYPE html><html><body style="margin:0;background:transparent">
      <div id="icon" style="width:2048px;height:2048px">${iconSvg.replace(
        'viewBox="0 0 64 64"',
        'viewBox="0 0 64 64" width="2048" height="2048"',
      )}</div>
    </body></html>`,
    { waitUntil: "domcontentloaded" },
  );
  const iconEl = await iconPage.$("#icon");
  const iconPath = path.join(outDir, "full-mark-icon.png");
  await iconEl.screenshot({ path: iconPath, omitBackground: true, type: "png" });
  await iconPage.close();
  const iconStat = fs.statSync(iconPath);
  console.log(
    `✓ full-mark-icon.png  2048×2048px  ${Math.round(iconStat.size / 1024)} KB  — geometric F mark`,
  );
} finally {
  await browser.close();
}

console.log(`\nSaved to ${outDir}`);

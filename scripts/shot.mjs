#!/usr/bin/env node
/**
 * Development QA helper: screenshot routes and report console errors,
 * failed requests and horizontal overflow at a given viewport.
 *
 *   node scripts/shot.mjs / /shop /cart --w 1440
 *   node scripts/shot.mjs /products/mac-and-cheese-classic-cheddar --w 390 --full
 */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
// Routes are bare "/..." args; values that follow a --flag belong to that flag.
const routes = args.filter(
  (arg, index) => arg.startsWith("/") && !(index > 0 && args[index - 1].startsWith("--")),
);
const width = Number(flag("w", "1440"));
const height = Number(flag("h", "900"));
const full = args.includes("--full");
const base = flag("base", "http://localhost:3000");
const outDir = flag("out", "/tmp/shots");
const wait = Number(flag("wait", "1400"));

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
});

for (const route of routes.length ? routes : ["/"]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const problems = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text().slice(0, 300)}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${String(err).slice(0, 300)}`));
  page.on("requestfailed", (req) =>
    problems.push(`requestfailed: ${req.url().slice(0, 160)} — ${req.failure()?.errorText}`),
  );

  const response = await page.goto(`${base}${route}`, {
    waitUntil: "networkidle2",
    timeout: 45000,
  });

  // Trigger lazy sections and scroll-reveals, then return to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, wait));

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [];
    if (doc.scrollWidth > doc.clientWidth + 1) {
      // An element that sticks out inside an overflow-hidden ancestor is
      // clipped and harmless, so ignore it: only unclipped boxes cause the
      // page itself to scroll sideways.
      const isClipped = (el) => {
        for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
          if (getComputedStyle(node).overflowX !== "visible") return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && (rect.right > doc.clientWidth + 2 || rect.left < -2)) {
          const style = getComputedStyle(el);
          if (style.position === "fixed" || style.visibility === "hidden") continue;
          if (isClipped(el)) continue;
          offenders.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)} rect=${Math.round(rect.left)}..${Math.round(rect.right)}`,
          );
          if (offenders.length > 6) break;
        }
      }
    }
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      scrollHeight: doc.scrollHeight,
      offenders,
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim().slice(0, 90) ?? null,
    };
  });

  const name = `${route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "")}-${width}`;
  const file = path.join(outDir, `${name}.png`);

  // Optional viewport-sized captures at explicit scroll offsets, which
  // keeps section detail readable instead of one giant scaled image.
  const at = flag("at", "");
  if (at) {
    for (const offset of at.split(",").map(Number)) {
      await page.evaluate((y) => window.scrollTo(0, y), offset);
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({ path: path.join(outDir, `${name}-at${offset}.png`) });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));
  }

  // Walk the page one viewport at a time. Unlike a fullPage capture this keeps
  // every section legible and lets scroll-reveal animations settle first.
  if (args.includes("--tiles")) {
    const tiles = Math.min(Math.ceil(metrics.scrollHeight / height), 14);
    for (let index = 0; index < tiles; index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), index * height);
      await new Promise((r) => setTimeout(r, 650));
      await page.screenshot({ path: path.join(outDir, `${name}-t${index}.png`) });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));
  }

  await page.screenshot({ path: file, fullPage: full });

  console.log(
    JSON.stringify(
      {
        route,
        status: response?.status(),
        title: metrics.title,
        h1: metrics.h1,
        overflow: metrics.scrollWidth > metrics.clientWidth + 1,
        scroll: `${metrics.scrollWidth}/${metrics.clientWidth}`,
        pageHeight: metrics.scrollHeight,
        offenders: metrics.offenders,
        problems: [...new Set(problems)].slice(0, 8),
        file,
      },
      null,
      1,
    ),
  );
  await page.close();
}

await browser.close();

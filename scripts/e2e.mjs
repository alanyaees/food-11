#!/usr/bin/env node
/**
 * Development QA: drives the real purchase flows in a real browser.
 * Not a replacement for a test runner — a fast confidence check that
 * every important button actually does something.
 *
 *   node scripts/e2e.mjs            # desktop
 *   node scripts/e2e.mjs --w 390    # mobile
 */

import fs from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : d;
};
const width = Number(flag("w", "1440"));
const height = Number(flag("h", width < 600 ? "844" : "900"));
const base = flag("base", "http://localhost:3000");
const outDir = flag("out", "/tmp/shots");
fs.mkdirSync(outDir, { recursive: true });

const results = [];
const problems = [];
const check = (name, pass, detail = "") => {
  const line = `${pass ? "PASS" : "FAIL"} · ${name}${detail ? ` — ${detail}` : ""}`;
  results.push(line);
  console.log(line);
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width, height });
page.on("pageerror", (e) => problems.push(`pageerror: ${String(e).slice(0, 200)}`));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("404")) {
    problems.push(`console: ${m.text().slice(0, 200)}`);
  }
});

const shot = (name) => page.screenshot({ path: `${outDir}/e2e-${name}-${width}.png` });
const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const go = async (path) => {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle2", timeout: 45000 });
  await wait(500);
  // Cookie banner sits over bottom CTAs until a choice is made.
  await clickText("button", "Necessary only");
  await wait(400);
};
const text = (sel) => page.$eval(sel, (el) => el.textContent?.trim() ?? "").catch(() => null);
const clickText = async (selector, needle) => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const handles = await page.$$(selector);
      for (const handle of handles) {
        const label = await handle.evaluate((el) => el.textContent?.trim() ?? "");
        const visible = await handle.evaluate((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0
          );
        });
        if (!visible) continue;
        if (label.toLowerCase().includes(needle.toLowerCase())) {
          await handle.click();
          return true;
        }
      }
      return false;
    } catch {
      await wait(800);
    }
  }
  return false;
};
/** Runs a block of checks; a thrown error becomes a single FAIL instead of killing the run. */
const step = async (name, fn) => {
  try {
    await fn();
  } catch (error) {
    check(name, false, String(error).split("\n")[0].slice(0, 160));
  }
};
const cartCount = () =>
  page.$eval('button[aria-label*="Open cart"]', (el) => {
    const match = el.getAttribute("aria-label")?.match(/(\d+)\s+item/);
    return match ? Number(match[1]) : 0;
  });

await step("home CTA → shop", async () => {
  await go("/");
  check("home renders", (await text("h1"))?.toLowerCase().includes("comfort food"));
  await clickText("a", "Shop meals");
  await wait(1200);
  check("hero CTA reaches shop", page.url().includes("/shop"), page.url());
});

await step("quick add from a card", async () => {
  await go("/shop");
  const beforeAdd = await cartCount();
  const added = await clickText("button", "Quick add");
  await wait(900);
  const afterAdd = await cartCount();
  check("quick add increments cart", added && afterAdd === beforeAdd + 1, `${beforeAdd} → ${afterAdd}`);
  await shot("shop-after-add");
});

await step("cart drawer opens and shows a line", async () => {
  await page.click('button[aria-label*="Open cart"]');
  await wait(800);
  const drawerVisible = await page.$('div[role="dialog"]');
  const drawerHasTotal = (await page.$$eval('div[role="dialog"] *', (nodes) =>
    nodes.some((n) => n.textContent?.trim() === "Total"),
  ).catch(() => false));
  check("cart drawer opens with totals", Boolean(drawerVisible) && drawerHasTotal);
  await shot("cart-drawer");
  await page.keyboard.press("Escape");
  await wait(500);
});

await step("filters actually filter", async () => {
  await go("/shop");
  const totalMeals = Number((await text(".num.text-sm"))?.match(/\d+/)?.[0] ?? 0);
  if (width < 1024) {
    await clickText("button", "Filter");
    await wait(600);
  }
  await clickText("label", "Mac + Cheese");
  await wait(1000);
  const filteredMeals = Number((await text(".num.text-sm"))?.match(/\d+/)?.[0] ?? 0);
  check(
    "meal-type filter narrows results",
    filteredMeals > 0 && filteredMeals < totalMeals,
    `${totalMeals} → ${filteredMeals}`,
  );
  check("filter is reflected in the URL", page.url().includes("category=mac-and-cheese"), page.url());
  if (width < 1024) {
    await page.keyboard.press("Escape");
    await wait(400);
  }
});

await step("sort works", async () => {
  await page.select("#shop-sort", "price-desc");
  await wait(900);
  const firstPrice = await page.$$eval(".num.shrink-0.text-sm", (nodes) =>
    nodes.length ? nodes[0].textContent : null,
  );
  check("sort by price high→low applies", page.url().includes("sort=price-desc"), String(firstPrice));
});

await step("product page: subscribe & add", async () => {
  await go("/products/mac-and-cheese-classic-cheddar");
  check("product page renders", (await text("h1"))?.toLowerCase().includes("cheddar"));
  await clickText("label", "Subscribe & save");
  await wait(400);
  const beforeProduct = await cartCount();
  await clickText("button", "Add to cart");
  await wait(1100);
  const afterProduct = await cartCount();
  check(
    "product add-to-cart works",
    afterProduct > beforeProduct,
    `${beforeProduct} → ${afterProduct}`,
  );
  await shot("product-add");
  await page.keyboard.press("Escape");
  await wait(400);
});

await step("nutrition label tabs", async () => {
  await go("/products/mac-and-cheese-classic-cheddar");
  const tabbed = await clickText('button[role="tab"]', "Ingredients");
  await wait(600);
  const ingredientsVisible = await page.$$eval("body", (nodes) =>
    nodes[0].textContent?.includes("Aged cheddar") ?? false,
  );
  check("nutrition label tabs switch", tabbed && ingredientsVisible);
});

await step("build a box", async () => {
  await go("/build-a-box");
  await clickText("button", "Fill with one of each");
  await wait(800);
  const boxStatus = await page.$$eval("p", (nodes) => {
    const node = nodes.find((n) => /\d+\s*\/\s*\d+\s*meals/.test(n.textContent ?? ""));
    return node?.textContent?.trim() ?? null;
  });
  const beforeBox = await cartCount();
  const boxAdded = await clickText("button", "Add box to cart");
  await wait(1200);
  const afterBox = await cartCount();
  check("box builder fills to capacity", boxStatus === "12 / 12 meals", String(boxStatus));
  check("box adds to cart", boxAdded && afterBox > beforeBox, `${beforeBox} → ${afterBox}`);
  await shot("box-added");
  await page.keyboard.press("Escape");
  await wait(400);
});

await step("promo code on the cart page", async () => {
  await go("/cart");
  await clickText("button", "Add a promo code");
  await wait(400);
  await page.type("#promo-code", "FIRSTFULL");
  await clickText("button", "Apply");
  await wait(900);
  const discountShown = await page.$$eval("dt", (nodes) =>
    nodes.some((n) => n.textContent?.trim().startsWith("Discount")),
  );
  check("promo code applies a discount", discountShown);
  await shot("cart-promo");
});

await step("checkout to demo success", async () => {
  await go("/checkout");
  await page.type("#checkout-email", "tester@example.com");
  await clickText("button", "demo order");
  await wait(2500);
  check("checkout completes (demo mode)", page.url().includes("/checkout/success"), page.url());
  await shot("checkout-success");
});

await step("404", async () => {
  await go("/definitely-not-a-page");
  check("404 page renders brand copy", (await text("h1"))?.toLowerCase().includes("zero protein"));
});

await step("search dialog", async () => {
  await go("/");
  await page.click('button[aria-label="Search meals"]');
  await wait(700);
  await page.type("#site-search", "jalape");
  await wait(600);
  const searchHit = await page.$$eval('div[role="dialog"] button', (nodes) =>
    nodes.some((n) => n.textContent?.includes("Spicy Jalapeño")),
  );
  check("search finds meals", searchHit);
  await shot("search");
});

await step("macro nerd mode persists", async () => {
  await go("/nutrition");
  await clickText('button[role="radio"]', "Macro nerd");
  await wait(700);
  const nerdVisible = await page.$$eval("body", (n) =>
    n[0].textContent?.includes("Protein per 100 kcal") ?? false,
  );
  await go("/products/creamy-tomato-pasta");
  const nerdPersisted = await page.$$eval("body", (n) =>
    n[0].textContent?.includes("Energy from protein") ?? false,
  );
  check("macro nerd mode reveals detail", nerdVisible);
  check("macro nerd mode persists across pages", nerdPersisted);
});

if (problems.length) {
  console.log("\nCONSOLE / PAGE PROBLEMS:");
  console.log([...new Set(problems)].slice(0, 12).join("\n"));
}
const failures = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - failures.length}/${results.length} checks passed`);

await browser.close();
if (failures.length) process.exitCode = 1;

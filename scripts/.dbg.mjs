import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
for (const route of ["/terms", "/"]) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2500));
  const data = await page.evaluate(() => {
    window.scrollTo(300, 0);
    const scrolled = window.scrollX;
    window.scrollTo(0, 0);
    return {
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      client: document.documentElement.clientWidth,
      bodyOverflowX: getComputedStyle(document.body).overflowX,
      canScrollX: scrolled,
    };
  });
  console.log(route, data);
}
await browser.close();

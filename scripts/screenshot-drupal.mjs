// One-off: capture the Drupal site thumbnails. Run from project root:
//   node scripts/screenshot-drupal.mjs
//
// Re-run any time the live sites change. Output is 1280x720 JPEG.

import { chromium } from "playwright";

const sites = [
  { url: "https://www.cbtwaco.bank/", out: "public/projects/drupal/cbtwaco.jpg" },
  { url: "https://www.foundersfcu.com/", out: "public/projects/drupal/founders.jpg" },
  { url: "https://www.foundersfcuinsurance.com/", out: "public/projects/drupal/founders-insurance.jpg" },
  { url: "https://www.wealthmanagementatfounders.com/", out: "public/projects/drupal/founders-wealth.jpg" },
  { url: "https://www.veritycu.com/", out: "public/projects/drupal/verity.jpg" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
});

for (const { url, out } of sites) {
  const page = await context.newPage();
  console.log(`→ ${url}`);
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    // Give async content (hero images, fonts) a moment after load.
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: out,
      type: "jpeg",
      quality: 82,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    });
    console.log(`  saved ${out}`);
  } catch (err) {
    console.error(`  FAILED ${url}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("done");

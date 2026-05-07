import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Contact page", () => {
  test("renders three contact links", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1, name: /Get in touch/i })).toBeVisible();
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/thomasshackelford"
    );
    await expect(main.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/thomas-shackelford"
    );
    await expect(main.getByRole("link", { name: /Email/i })).toHaveAttribute(
      "href",
      "mailto:thomas.shackelford1@gmail.com"
    );
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/contact");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

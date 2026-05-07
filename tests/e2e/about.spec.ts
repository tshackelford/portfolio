import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("About page", () => {
  test("renders header, professional bit, career, and personal sections", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Where I've been/i })).toBeAttached();
    await expect(page.getByRole("heading", { level: 2, name: /Outside the work/i })).toBeAttached();
    await expect(page.getByText(/Trabian/)).toBeAttached();
    await expect(page.getByText(/Q2 Software/)).toBeAttached();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/about");
    // Scroll to bottom to trigger FadeReveal (whileInView) animations before axe runs.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

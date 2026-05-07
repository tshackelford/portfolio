import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Projects page", () => {
  test("renders all three project entries", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 2, name: /Drupal Sites/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Q2 SDK Work/i })).toBeAttached();
    await expect(page.getByRole("heading", { level: 2, name: /Road Trip Planner/i })).toBeAttached();
  });

  test("Drupal strip shows live-link sites and inert sites correctly", async ({ page }) => {
    await page.goto("/projects");
    const cbt = page.getByRole("link", { name: /CBT Waco/i });
    await expect(cbt).toHaveAttribute("href", "https://www.cbtwaco.bank/");
    await expect(cbt).toHaveAttribute("target", "_blank");
  });

  test("Drupal strip is keyboard navigable with arrow keys", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("link", { name: "CBT Waco" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("link", { name: "Founders FCU" })).toBeFocused();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/projects");
    // Scroll to bottom to trigger FadeReveal (whileInView) animations before axe runs.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

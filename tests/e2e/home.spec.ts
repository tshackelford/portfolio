import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home page", () => {
  test("renders hero with name, role, and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Thomas Shackelford/i })
    ).toBeVisible();
    await expect(page.getByText(/Senior Software Engineer.*Lakewood, CA/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /See projects/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /About me/i })).toBeVisible();
  });

  test("renders intro and three callouts linking to other routes", async ({ page }) => {
    await page.goto("/");
    // Scope to the "Browse the site" region (aria-labelledby="callouts-heading")
    // to avoid colliding with the header nav links.
    // The callout links include the teaser text in their accessible name, so we
    // match with partial regex rather than exact anchors.
    const callouts = page.getByRole("region", { name: /Browse the site/i });
    await expect(callouts.getByRole("link", { name: /About/i }).first()).toBeAttached();
    await expect(callouts.getByRole("link", { name: /Projects/i }).first()).toBeAttached();
    await expect(callouts.getByRole("link", { name: /Contact/i }).first()).toBeAttached();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

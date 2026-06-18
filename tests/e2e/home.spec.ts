import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home (one-pager)", () => {
  test("renders the About hero with name, role, and intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Thomas Shackelford/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Senior Software Engineer.*Lakewood, CA/i)
    ).toBeVisible();
  });

  test("renders Projects, Career, and Contact section headings", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: /A decade of work/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 2, name: /Where I.{1,2}ve been/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 2, name: /Get in touch/i })
    ).toBeAttached();
  });

  test("renders all three project entries", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 3, name: /Drupal Sites/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 3, name: /Q2 SDK Work/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 3, name: /Road Trip Planner/i })
    ).toBeAttached();
  });

  test("renders the four contact cards with correct hrefs", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/thomasshackelford"
    );
    await expect(contact.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/thomas-shackelford"
    );
    await expect(contact.getByRole("link", { name: /Email/i })).toHaveAttribute(
      "href",
      "mailto:thomas.shackelford1@gmail.com"
    );
    await expect(contact.getByRole("link", { name: /Resume/i })).toHaveAttribute(
      "href",
      "/resume.pdf"
    );
  });

  test("header anchor links navigate to the right sections", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Primary/i });
    for (const [label, sectionId] of [
      ["Projects", "projects"],
      ["Career", "career"],
      ["Contact", "contact"],
      ["About", "about"],
    ] as const) {
      await nav.getByRole("link", { name: new RegExp(`^${label}$`) }).click();
      await expect(page).toHaveURL(new RegExp(`#${sectionId}$`));
    }
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

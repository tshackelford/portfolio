import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import type { DrupalSite } from "@/content/projects";

const sites: DrupalSite[] = [
  { name: "Site One", thumbnail: "/projects/drupal/one.webp", liveUrl: "https://one.example.com" },
  { name: "Site Two", thumbnail: "/projects/drupal/two.webp" },
  { name: "Site Three", thumbnail: "/projects/drupal/three.webp", liveUrl: "https://three.example.com" },
];

const focusables = () => sites.map((s) => screen.getByLabelText(s.name));

describe("DrupalStrip", () => {
  it("renders one list item per site", () => {
    render(<DrupalStrip sites={sites} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders sites with liveUrl as links opening in a new tab", () => {
    render(<DrupalStrip sites={sites} />);
    const link = screen.getByRole("link", { name: /Site One/ });
    expect(link).toHaveAttribute("href", "https://one.example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel") ?? "").toContain("noopener");
  });

  it("renders sites without liveUrl as inert (no link role)", () => {
    render(<DrupalStrip sites={sites} />);
    expect(screen.queryByRole("link", { name: /Site Two/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Site Two")).toBeInTheDocument();
  });

  it("uses roving tabindex: only the first focusable is tabbable initially", () => {
    render(<DrupalStrip sites={sites} />);
    const [first, second, third] = focusables();
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");
    expect(third).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus with ArrowRight and ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<DrupalStrip sites={sites} />);
    const [first, second, third] = focusables() as [HTMLElement, HTMLElement, HTMLElement];
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(second).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(second).toHaveFocus();
  });

  it("wraps focus at the ends", async () => {
    const user = userEvent.setup();
    render(<DrupalStrip sites={sites} />);
    const [first, , third] = focusables() as [HTMLElement, HTMLElement, HTMLElement];
    first.focus();
    await user.keyboard("{ArrowLeft}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(first).toHaveFocus();
  });

  it("Home jumps to first, End to last", async () => {
    const user = userEvent.setup();
    render(<DrupalStrip sites={sites} />);
    const [first, , third] = focusables() as [HTMLElement, HTMLElement, HTMLElement];
    first.focus();
    await user.keyboard("{End}");
    expect(third).toHaveFocus();
    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
  });
});

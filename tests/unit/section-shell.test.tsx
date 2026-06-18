import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionShell } from "@/components/shell/SectionShell";

describe("SectionShell", () => {
  it("renders its id on the section element", () => {
    const { container } = render(
      <SectionShell id="my-section">
        <p>content</p>
      </SectionShell>
    );
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section?.id).toBe("my-section");
  });

  it("renders children inside a constrained-width container", () => {
    render(
      <SectionShell id="x">
        <p>hello</p>
      </SectionShell>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders the background slot when provided", () => {
    render(
      <SectionShell id="x" background={<div data-testid="bg">layer</div>}>
        <p>content</p>
      </SectionShell>
    );
    expect(screen.getByTestId("bg")).toBeInTheDocument();
  });

  it("does not render the background wrapper when no background is provided", () => {
    const { container } = render(
      <SectionShell id="x">
        <p>content</p>
      </SectionShell>
    );
    expect(container.querySelector("[data-section-background]")).toBeNull();
  });
});

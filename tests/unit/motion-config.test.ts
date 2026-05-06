import { describe, it, expect, vi, afterEach } from "vitest";
import { prefersReducedMotion, motionDuration } from "@/lib/motion-config";

afterEach(() => {
  vi.restoreAllMocks();
});

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? matches : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

describe("prefersReducedMotion", () => {
  it("returns false when user has not requested reduced motion", () => {
    mockMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("returns true when user has requested reduced motion", () => {
    mockMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false when matchMedia is undefined (SSR)", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("motionDuration", () => {
  it("returns the requested duration when motion is allowed", () => {
    mockMatchMedia(false);
    expect(motionDuration(0.25)).toBe(0.25);
  });

  it("returns 0 when reduced motion is requested", () => {
    mockMatchMedia(true);
    expect(motionDuration(0.25)).toBe(0);
  });
});

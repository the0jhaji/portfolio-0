// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Experience from "./Experience.jsx";

// jsdom doesn't implement matchMedia, which the timeline rail effect queries.
function stubMatchMedia() {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

beforeEach(() => {
  stubMatchMedia();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Experience — internship end date (Oct 11, 2026)", () => {
  it("still shows Ongoing while the end date is ahead", () => {
    vi.setSystemTime(new Date(2026, 9, 10, 12, 0, 0)); // Oct 10, 2026

    render(<Experience />);

    expect(screen.getByText("Ongoing")).toBeTruthy();
    expect(screen.getByText(/Sep 2026 – Present/)).toBeTruthy();
    expect(screen.getByText(/1 active role right now/)).toBeTruthy();
  });

  it("remains Ongoing through the very end of the last day", () => {
    vi.setSystemTime(new Date(2026, 9, 11, 23, 30, 0)); // Oct 11, 2026, 23:30

    render(<Experience />);

    expect(screen.getByText("Ongoing")).toBeTruthy();
    expect(screen.getByText(/Sep 2026 – Present/)).toBeTruthy();
  });

  it("flips to the final period once the end date has passed", () => {
    vi.setSystemTime(new Date(2026, 9, 12, 12, 0, 0)); // Oct 12, 2026

    render(<Experience />);

    expect(screen.queryByText("Ongoing")).toBeNull();
    expect(screen.getByText(/Sep 2026 – Oct 2026/)).toBeTruthy();
    expect(screen.queryByText(/active role/)).toBeNull(); // badge disappears
    expect(screen.getByText(/2 wks/)).toBeTruthy(); // final duration
  });
});

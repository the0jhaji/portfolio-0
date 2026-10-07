// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import QuickStats from "./QuickStats.jsx";

vi.mock("../services/leetcode.js", () => ({
  fetchLeetCodeSolved: vi.fn(),
}));

import { fetchLeetCodeSolved } from "../services/leetcode.js";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  fetchLeetCodeSolved.mockReset();
  // The hook warns on failure to make it visible during development.
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("QuickStats", () => {
  it("renders a loading placeholder (—) while the API is pending", () => {
    const pending = deferred();
    fetchLeetCodeSolved.mockReturnValue(pending.promise);

    render(<QuickStats />);

    const cell = screen.getByTitle("Loading LeetCode stats…");
    expect(cell.textContent).toBe("—");
    expect(screen.queryByText("247")).toBeNull();

    // The rest of the card is already visible — it never blocks on LeetCode.
    expect(screen.getByText("Projects Built")).toBeTruthy();
    expect(screen.getByText("CGPA")).toBeTruthy();
    expect(screen.getByText("Certifications")).toBeTruthy();
  });

  it("displays the fetched solved count and a LeetCode profile link", async () => {
    fetchLeetCodeSolved.mockResolvedValue({
      solved: 247,
      username: "the_ojhaji9",
      profileUrl: "https://leetcode.com/the_ojhaji9",
      difficulty: { total: 247, easy: 120, medium: 110, hard: 17 },
      stale: false,
      cached: false,
    });

    render(<QuickStats />);

    expect(await screen.findByText("247")).toBeTruthy();

    const link = screen.getByRole("link", { name: /LeetCode/i });
    expect(link).toHaveProperty("href", "https://leetcode.com/the_ojhaji9");

    // The other stats are untouched and the old hardcoded value is gone.
    expect(screen.queryByText("100+")).toBeNull();
    expect(screen.getByText("15+")).toBeTruthy();
    expect(screen.getByText("7.2")).toBeTruthy();
    expect(screen.getByText("4+")).toBeTruthy();
  });

  it("keeps the page usable on failure: shows — and warns in dev", async () => {
    fetchLeetCodeSolved.mockRejectedValue(new Error("network down"));

    render(<QuickStats />);

    const cell = await screen.findByTitle("LeetCode data unavailable");
    expect(cell.textContent).toBe("—");

    // No fake number, no undefined/NaN/null/0, no profile link.
    expect(screen.queryByText("undefined")).toBeNull();
    expect(screen.queryByText("NaN")).toBeNull();
    expect(screen.queryByText("0")).toBeNull();
    expect(screen.queryByRole("link", { name: /LeetCode/i })).toBeNull();

    // Other stats still render — the section does not crash.
    expect(screen.getByText("15+")).toBeTruthy();
    expect(screen.getByText("7.2")).toBeTruthy();
    expect(screen.getByText("4+")).toBeTruthy();

    // Failure is visible during development.
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("[QuickStats]"),
      expect.any(Error),
    );
  });

  it("shows a stale last-known value with an explanatory tooltip", async () => {
    fetchLeetCodeSolved.mockResolvedValue({
      solved: 130,
      username: "the_ojhaji9",
      profileUrl: "https://leetcode.com/the_ojhaji9",
      difficulty: { total: 130, easy: 72, medium: 54, hard: 4 },
      stale: true,
      cached: true,
    });

    render(<QuickStats />);

    const cell = await screen.findByText("130");
    expect(cell.getAttribute("title")).toMatch(/Last known value/);
    expect(screen.getByRole("link", { name: /LeetCode/i })).toBeTruthy();
  });
});

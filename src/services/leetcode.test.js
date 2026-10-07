// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

// A fresh module per test resets the module-level memory cache.
function loadService() {
  vi.resetModules();
  return import("../services/leetcode.js");
}

function okResponse(payload, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => payload };
}

const VALID_PAYLOAD = {
  solved: 247,
  username: "the_ojhaji9",
  profileUrl: "https://leetcode.com/the_ojhaji9",
  difficulty: { total: 247, easy: 120, medium: 110, hard: 17 },
  stale: false,
};

beforeEach(() => {
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe("fetchLeetCodeSolved", () => {
  it("returns the solved count from the API", async () => {
    const { fetchLeetCodeSolved, LEETCODE_ENDPOINT } = await loadService();
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(VALID_PAYLOAD));

    const data = await fetchLeetCodeSolved({ fetchImpl });

    expect(data).toMatchObject({ solved: 247, stale: false });
    expect(fetchImpl).toHaveBeenCalledWith(
      LEETCODE_ENDPOINT,
      expect.objectContaining({ headers: expect.any(Object) }),
    );
  });

  it("does not re-request while the value is fresh (cache)", async () => {
    const { fetchLeetCodeSolved } = await loadService();
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(VALID_PAYLOAD));

    await fetchLeetCodeSolved({ fetchImpl, now: 0 });
    await fetchLeetCodeSolved({ fetchImpl, now: 60_000 });
    const third = await fetchLeetCodeSolved({ fetchImpl, now: 120_000 });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(third).toMatchObject({ solved: 247, cached: true });
  });

  it("reuses a recent value from sessionStorage without any network call", async () => {
    const first = await loadService();
    await first.fetchLeetCodeSolved({
      fetchImpl: vi.fn().mockResolvedValue(okResponse(VALID_PAYLOAD)),
      now: 0,
    });

    // Simulate a page reload: new module instance, same sessionStorage.
    const reloaded = await loadService();
    const fetchImpl = vi.fn();

    const data = await reloaded.fetchLeetCodeSolved({ fetchImpl, now: 60_000 });

    expect(data).toMatchObject({ solved: 247, cached: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("throws when the API responds with an error status", async () => {
    const { fetchLeetCodeSolved } = await loadService();
    const fetchImpl = vi.fn().mockResolvedValue(okResponse({ error: "unavailable" }, { ok: false, status: 502 }));

    await expect(fetchLeetCodeSolved({ fetchImpl })).rejects.toThrow(
      /responded with 502/,
    );
  });

  it("throws on a malformed payload instead of showing NaN/undefined", async () => {
    const { fetchLeetCodeSolved } = await loadService();
    const fetchImpl = vi.fn().mockResolvedValue(okResponse({ totally: "unexpected" }));

    await expect(fetchLeetCodeSolved({ fetchImpl })).rejects.toThrow(
      /Malformed \/api\/leetcode response/,
    );
  });

  it("throws on a network failure when no previous value exists", async () => {
    const { fetchLeetCodeSolved } = await loadService();
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

    await expect(fetchLeetCodeSolved({ fetchImpl })).rejects.toThrow("fetch failed");
  });

  it("falls back to the last known value marked stale when the API fails", async () => {
    const first = await loadService();
    await first.fetchLeetCodeSolved({
      fetchImpl: vi.fn().mockResolvedValue(okResponse(VALID_PAYLOAD)),
      now: 0,
    });

    // New page load, API down.
    const reloaded = await loadService();
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

    const data = await reloaded.fetchLeetCodeSolved({ fetchImpl, now: 60 * 60 * 1000 });

    expect(data).toMatchObject({ solved: 247, stale: true });
  });
});

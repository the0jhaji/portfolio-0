import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  LeetCodeError,
  clearStatsCache,
  fetchLeetCodeStats,
  getCachedStats,
  normalizeStats,
  resolveCacheTtlMs,
  resolveUsername,
} from "./leetcode.js";

const VALID_PAYLOAD = {
  data: {
    matchedUser: {
      username: "the_ojhaji9",
      submitStatsGlobal: {
        acSubmissionNum: [
          { difficulty: "All", count: 247 },
          { difficulty: "Easy", count: 120 },
          { difficulty: "Medium", count: 110 },
          { difficulty: "Hard", count: 17 },
        ],
      },
    },
  },
};

const NOT_FOUND_PAYLOAD = {
  errors: [{ message: "That user does not exist." }],
  data: { matchedUser: null },
};

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body };
}

beforeEach(() => {
  clearStatsCache();
});

describe("fetchLeetCodeStats", () => {
  it("returns the solved count and difficulty breakdown on success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(VALID_PAYLOAD));

    const stats = await fetchLeetCodeStats({ username: "the_ojhaji9", fetchImpl });

    expect(stats).toEqual({
      username: "the_ojhaji9",
      solved: 247,
      difficulty: { total: 247, easy: 120, medium: 110, hard: 17 },
      profileUrl: "https://leetcode.com/the_ojhaji9",
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://leetcode.com/graphql");
    expect(JSON.parse(options.body).variables.username).toBe("the_ojhaji9");
  });

  it("maps a non-existent user to a not_found / 404 error", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(NOT_FOUND_PAYLOAD));

    await expect(
      fetchLeetCodeStats({ username: "no_such_user_123", fetchImpl }),
    ).rejects.toMatchObject({ name: "LeetCodeError", code: "not_found", status: 404 });
  });

  it("rejects a malformed response (missing submit stats)", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ data: { matchedUser: {} } }));

    await expect(fetchLeetCodeStats({ username: "x", fetchImpl })).rejects.toMatchObject({
      code: "malformed_response",
      status: 502,
    });
  });

  it("rejects a non-JSON response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError("Unexpected token < in JSON");
      },
    });

    await expect(fetchLeetCodeStats({ username: "x", fetchImpl })).rejects.toMatchObject({
      code: "malformed_response",
    });
  });

  it("rejects invalid counts (negative or non-integer)", () => {
    const payload = {
      data: {
        matchedUser: {
          username: "x",
          submitStatsGlobal: {
            acSubmissionNum: [
              { difficulty: "All", count: -5 },
              { difficulty: "Easy", count: 1 },
            ],
          },
        },
      },
    };

    expect(() => normalizeStats(payload, "x")).toThrow(LeetCodeError);
  });

  it("maps HTTP 5xx to an unavailable error", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}, { ok: false, status: 503 }));

    await expect(fetchLeetCodeStats({ username: "x", fetchImpl })).rejects.toMatchObject({
      code: "unavailable",
      status: 502,
    });
  });

  it("maps HTTP 429 to a rate_limited error", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}, { ok: false, status: 429 }));

    await expect(fetchLeetCodeStats({ username: "x", fetchImpl })).rejects.toMatchObject({
      code: "rate_limited",
      status: 429,
    });
  });

  it("maps network failures to an unavailable error", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

    await expect(fetchLeetCodeStats({ username: "x", fetchImpl })).rejects.toMatchObject({
      code: "unavailable",
      status: 502,
    });
  });

  it("maps an aborted/timed-out request to a timeout error", async () => {
    const timeoutError = new Error("The operation was aborted due to timeout");
    timeoutError.name = "TimeoutError";
    const fetchImpl = vi.fn().mockRejectedValue(timeoutError);

    await expect(fetchLeetCodeStats({ username: "x", fetchImpl })).rejects.toMatchObject({
      code: "timeout",
      status: 504,
    });
  });
});

describe("getCachedStats", () => {
  const username = "cache_user";
  const ttlMs = 1000;

  it("does not call LeetCode again inside the cache window", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(VALID_PAYLOAD));

    const first = await getCachedStats({ username, fetchImpl, now: 0, ttlMs });
    const second = await getCachedStats({ username, fetchImpl, now: ttlMs - 1, ttlMs });
    const third = await getCachedStats({ username, fetchImpl, now: ttlMs - 2, ttlMs });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(first.solved).toBe(247);
    expect(second).toMatchObject({ solved: 247, stale: false });
    expect(third).toMatchObject({ solved: 247, stale: false });
  });

  it("refetches once the cache window has expired", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(VALID_PAYLOAD));

    await getCachedStats({ username, fetchImpl, now: 0, ttlMs });
    await getCachedStats({ username, fetchImpl, now: ttlMs + 1, ttlMs });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("serves the last known value marked stale when LeetCode is unreachable", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(VALID_PAYLOAD))
      .mockRejectedValueOnce(new TypeError("fetch failed"));

    const fresh = await getCachedStats({ username, fetchImpl, now: 0, ttlMs });
    const stale = await getCachedStats({
      username,
      fetchImpl,
      now: ttlMs + 1,
      ttlMs,
    });

    expect(fresh.stale).toBe(false);
    expect(stale).toMatchObject({ solved: 247, stale: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("does not mask a definitive not_found with a stale value", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(VALID_PAYLOAD))
      .mockResolvedValueOnce(jsonResponse(NOT_FOUND_PAYLOAD));

    await getCachedStats({ username, fetchImpl, now: 0, ttlMs });

    await expect(
      getCachedStats({ username, fetchImpl, now: ttlMs + 1, ttlMs }),
    ).rejects.toMatchObject({ code: "not_found" });
  });

  it("rejects when there is no cached value and the upstream fails", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

    await expect(getCachedStats({ username, fetchImpl, now: 0, ttlMs })).rejects.toMatchObject({
      code: "unavailable",
    });
  });
});

describe("configuration", () => {
  it("uses the default username when none is configured", () => {
    expect(resolveUsername({})).toBe("the_ojhaji9");
  });

  it("prefers LEETCODE_USERNAME from the environment", () => {
    expect(resolveUsername({ LEETCODE_USERNAME: "other_user" })).toBe("other_user");
  });

  it("rejects an invalid configured username", () => {
    expect(() => resolveUsername({ LEETCODE_USERNAME: "not a user!" })).toThrow(
      /not a valid LeetCode username/,
    );
  });

  it("defaults the cache TTL to 30 minutes and honours overrides", () => {
    expect(resolveCacheTtlMs({})).toBe(30 * 60 * 1000);
    expect(resolveCacheTtlMs({ LEETCODE_CACHE_TTL_MS: "900000" })).toBe(900000);
    expect(resolveCacheTtlMs({ LEETCODE_CACHE_TTL_MS: "soon" })).toBe(30 * 60 * 1000);
  });
});

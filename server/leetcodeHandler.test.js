import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import leetcodeHandler from "./leetcodeHandler.js";
import { clearStatsCache } from "./leetcode.js";

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

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[String(name).toLowerCase()] = String(value);
    },
    end(chunk) {
      this.body = chunk ? JSON.parse(chunk) : null;
    },
  };
}

beforeEach(() => {
  clearStatsCache();
  // Keep expected failure logging out of the test output.
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GET /api/leetcode", () => {
  it("answers 200 with the solved count and CDN cache headers", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(VALID_PAYLOAD)));
    const res = createRes();

    await leetcodeHandler({ method: "GET" }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      solved: 247,
      username: "the_ojhaji9",
      profileUrl: "https://leetcode.com/the_ojhaji9",
      difficulty: { total: 247, easy: 120, medium: 110, hard: 17 },
      stale: false,
    });
    expect(res.headers["cache-control"]).toContain("s-maxage=1800");
    expect(res.headers["content-type"]).toContain("application/json");
  });

  it("answers 404 with a stable code for an unknown user", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(NOT_FOUND_PAYLOAD)));
    const res = createRes();

    await leetcodeHandler({ method: "GET" }, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "not_found" });
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("answers 502 (not a crash) when LeetCode is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const res = createRes();

    await expect(leetcodeHandler({ method: "GET" }, res)).resolves.not.toThrow();

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "unavailable" });
    expect(res.headers["cache-control"]).toBe("no-store");
    expect(console.error).toHaveBeenCalled();
  });

  it("answers 405 for non-GET methods without touching LeetCode", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = createRes();

    await leetcodeHandler({ method: "POST" }, res);

    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: "method_not_allowed" });
    expect(res.headers.allow).toBe("GET, HEAD");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

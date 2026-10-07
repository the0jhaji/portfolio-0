// Server-side LeetCode integration — the ONLY place in the project that knows
// LeetCode's GraphQL schema or URL. Both the Vercel function (api/leetcode.js)
// and the Vite dev middleware (vite.config.js) call this module, so the
// browser never talks to LeetCode directly, never sees upstream error details,
// and never receives anything but a validated payload.
//
// Refresh behaviour: results are cached for LEETCODE_CACHE_TTL_MS (default 30
// minutes, inside the recommended 15–60 minute window). Solving a problem on
// LeetCode therefore appears on the portfolio only after the cache expires —
// a delayed update is expected and intentional.
//
// Only public profile statistics are read; there are no credentials, no login,
// and a single request per cache window.

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

// Used when LEETCODE_USERNAME is not configured (the username is public info,
// not a secret — it only selects which profile to read).
export const DEFAULT_LEETCODE_USERNAME = "the_ojhaji9";

const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_TIMEOUT_MS = 5000;

const USERNAME_PATTERN = /^[A-Za-z0-9._-]{1,40}$/;

const USER_PROBLEMS_QUERY = `query userProblemsSolved($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}`;

/** Error with a stable machine-readable code and the HTTP status to reply with. */
export class LeetCodeError extends Error {
  constructor(message, { code, status }) {
    super(message);
    this.name = "LeetCodeError";
    this.code = code;
    this.status = status;
  }
}

function malformed(message) {
  return new LeetCodeError(message, { code: "malformed_response", status: 502 });
}

/** Username from the environment, validated so a typo fails loudly server-side. */
export function resolveUsername(env = process.env) {
  const username = String(env.LEETCODE_USERNAME ?? DEFAULT_LEETCODE_USERNAME).trim();
  if (!USERNAME_PATTERN.test(username)) {
    throw new LeetCodeError(
      `LEETCODE_USERNAME "${username}" is not a valid LeetCode username`,
      { code: "invalid_config", status: 500 },
    );
  }
  return username;
}

/** Cache TTL from the environment; falls back to the default on bad values. */
export function resolveCacheTtlMs(env = process.env) {
  const raw = env.LEETCODE_CACHE_TTL_MS;
  if (raw === undefined || raw === "") return DEFAULT_CACHE_TTL_MS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    console.warn(`[leetcode] Ignoring invalid LEETCODE_CACHE_TTL_MS "${raw}"`);
    return DEFAULT_CACHE_TTL_MS;
  }
  return parsed;
}

function timeoutSignal(ms) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  // Fallback for environments without AbortSignal.timeout (unref so a pending
  // timer never keeps the process alive).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  if (typeof timer === "object" && typeof timer?.unref === "function") timer.unref();
  return controller.signal;
}

/**
 * Validates a LeetCode GraphQL payload and extracts the solved counts.
 * Throws a LeetCodeError (`not_found` / `malformed_response`) on anything that
 * isn't exactly the shape we expect — including schema changes upstream.
 */
export function normalizeStats(payload, requestedUsername) {
  if (!payload || typeof payload !== "object") {
    throw malformed("LeetCode returned an empty payload");
  }

  const matchedUser = payload.data?.matchedUser;
  if (!matchedUser) {
    const messages = Array.isArray(payload.errors)
      ? payload.errors.map((error) => error?.message).filter(Boolean).join("; ")
      : "";
    if (/does not exist|not found|no user/i.test(messages)) {
      throw new LeetCodeError(`LeetCode user "${requestedUsername}" does not exist`, {
        code: "not_found",
        status: 404,
      });
    }
    throw malformed(`Unexpected LeetCode response: ${messages || "missing matchedUser"}`);
  }

  const submissions = matchedUser.submitStatsGlobal?.acSubmissionNum;
  if (!Array.isArray(submissions)) {
    throw malformed("LeetCode response is missing submitStatsGlobal.acSubmissionNum");
  }

  const counts = {};
  for (const entry of submissions) {
    if (
      !entry ||
      typeof entry.difficulty !== "string" ||
      !Number.isInteger(entry.count) ||
      entry.count < 0
    ) {
      throw malformed("LeetCode response contains an invalid submission count");
    }
    counts[entry.difficulty] = entry.count;
  }

  const total = counts.All;
  if (!Number.isInteger(total)) {
    throw malformed('LeetCode response is missing the "All" solved count');
  }

  const username =
    typeof matchedUser.username === "string" && matchedUser.username
      ? matchedUser.username
      : requestedUsername;

  return {
    username,
    solved: total,
    difficulty: {
      total,
      easy: counts.Easy ?? 0,
      medium: counts.Medium ?? 0,
      hard: counts.Hard ?? 0,
    },
    profileUrl: `https://leetcode.com/${encodeURIComponent(username)}`,
  };
}

/**
 * One request to LeetCode's public GraphQL endpoint. Never throws anything
 * other than a LeetCodeError, so callers can map failures to HTTP statuses.
 */
export async function fetchLeetCodeStats({
  username,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const profile = username ?? resolveUsername();

  if (typeof fetchImpl !== "function") {
    throw new LeetCodeError("fetch is unavailable in this runtime", {
      code: "unavailable",
      status: 502,
    });
  }

  let response;
  try {
    response = await fetchImpl(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: USER_PROBLEMS_QUERY,
        variables: { username: profile },
      }),
      signal: timeoutSignal(timeoutMs),
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new LeetCodeError(`LeetCode did not respond within ${timeoutMs}ms`, {
        code: "timeout",
        status: 504,
      });
    }
    throw new LeetCodeError(`LeetCode request failed: ${error?.message ?? error}`, {
      code: "unavailable",
      status: 502,
    });
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new LeetCodeError("LeetCode rate limited the request", {
        code: "rate_limited",
        status: 429,
      });
    }
    throw new LeetCodeError(`LeetCode responded with HTTP ${response.status}`, {
      code: "unavailable",
      status: 502,
    });
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw malformed("LeetCode returned a non-JSON response");
  }

  return normalizeStats(payload, profile);
}

// In-memory cache, keyed by username. Serverless instances are ephemeral, so
// this mainly helps warm instances and the dev server; the CDN-facing
// Cache-Control header set by the handler covers the rest.
const statsCache = new Map();

/** Test helper (also useful when debugging the dev server). */
export function clearStatsCache() {
  statsCache.clear();
}

/**
 * Cached read of the solved count.
 *
 * - Fresh within `ttlMs` (default 30 min) → no upstream request.
 * - Upstream failure → serve the last known good value marked `stale: true`,
 *   EXCEPT when the answer is definitive (e.g. the user no longer exists),
 *   which must surface as an error rather than a stale number.
 */
export async function getCachedStats({
  username,
  fetchImpl,
  timeoutMs,
  now = Date.now(),
  ttlMs = resolveCacheTtlMs(),
} = {}) {
  const profile = username ?? resolveUsername();
  const entry = statsCache.get(profile);

  if (entry && now - entry.fetchedAt < ttlMs) {
    return { ...entry.value, cachedAt: entry.fetchedAt, stale: false };
  }

  try {
    const value = await fetchLeetCodeStats({ username: profile, fetchImpl, timeoutMs });
    statsCache.set(profile, { value, fetchedAt: now });
    return { ...value, cachedAt: now, stale: false };
  } catch (error) {
    const transient =
      error?.code === "unavailable" ||
      error?.code === "timeout" ||
      error?.code === "rate_limited" ||
      error?.code === "malformed_response";
    if (entry && transient) {
      return { ...entry.value, cachedAt: entry.fetchedAt, stale: true };
    }
    throw error;
  }
}

// Browser-side accessor for our own `/api/leetcode` endpoint. Components only
// ever see a validated `{ solved, ... }` payload or an error — LeetCode's
// schema, its URL, and any upstream failure detail stay on the server.
//
// Failure strategy (never a fake number):
//   1. fresh value in this tab  → return it, no network call
//   2. API call succeeds        → validate, cache, return
//   3. API call fails           → return the last known value from
//                                 sessionStorage, marked `stale: true`
//   4. no last known value      → throw; the UI shows "—" and logs a warning
//                                 in development
// Never returns `undefined`/`NaN`/`null`/`0` as a visible count.

export const LEETCODE_ENDPOINT = "/api/leetcode";

// A value fetched less than 15 minutes ago short-circuits the network, so
// remounts and route changes don't re-hit the API. (Server + CDN cache for
// 30 minutes on top of this.)
const FRESH_MS = 15 * 60 * 1000;
const STORAGE_KEY = "portfolio:leetcode-solved:v1";

let memoryCache = null; // { data, savedAt }

function isValidStats(data) {
  return Boolean(data) && Number.isInteger(data.solved) && data.solved >= 0;
}

/** Validates the API payload; throws on anything unexpected. */
function normalize(payload) {
  if (!payload || typeof payload !== "object" || !isValidStats(payload)) {
    throw new Error("Malformed /api/leetcode response: missing a valid `solved` count");
  }
  return {
    solved: payload.solved,
    username: typeof payload.username === "string" ? payload.username : null,
    profileUrl: typeof payload.profileUrl === "string" ? payload.profileUrl : null,
    difficulty:
      payload.difficulty && typeof payload.difficulty === "object"
        ? payload.difficulty
        : null,
    stale: payload.stale === true,
  };
}

function readPersisted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidStats(parsed?.data) || !Number.isFinite(parsed?.savedAt)) return null;
    return parsed;
  } catch {
    // Private mode, quota, or corrupt JSON — degrade to "no last known value".
    return null;
  }
}

function writePersisted(data, savedAt) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, savedAt }));
  } catch {
    // Storage unavailable; the in-memory cache still works for this tab.
  }
}

/**
 * Resolves the LeetCode solved count.
 *
 * @returns {Promise<{solved: number, username: ?string, profileUrl: ?string,
 *   difficulty: ?object, stale: boolean, cached: boolean}>}
 * @throws when the API fails and no last known value exists.
 */
export async function fetchLeetCodeSolved({
  fetchImpl = globalThis.fetch,
  now = Date.now(),
} = {}) {
  const cached = memoryCache ?? readPersisted();
  if (cached && now - cached.savedAt < FRESH_MS) {
    return { ...cached.data, cached: true };
  }

  let data;
  try {
    const response = await fetchImpl(LEETCODE_ENDPOINT, {
      headers: { Accept: "application/json" },
    });
    if (!response?.ok) {
      throw new Error(`LeetCode API responded with ${response?.status ?? "unknown status"}`);
    }
    data = normalize(await response.json());
  } catch (error) {
    const lastKnown = readPersisted();
    if (lastKnown) {
      if (import.meta.env?.DEV) {
        console.warn("[QuickStats] LeetCode API failed; showing last known count:", error);
      }
      // Keep the old savedAt so the next mount retries instead of trusting a
      // failure-stale value for a full freshness window.
      return { ...lastKnown.data, stale: true, cached: true };
    }
    throw error;
  }

  memoryCache = { data, savedAt: now };
  writePersisted(data, now);
  return { ...data, cached: false };
}

/** Test/dev helper: forget the in-memory cache (sessionStorage is separate). */
export function clearLeetCodeClientCache() {
  memoryCache = null;
}

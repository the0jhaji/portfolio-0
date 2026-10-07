// HTTP adapter around the LeetCode service. Shared by:
//   - api/leetcode.js          (Vercel serverless function in production)
//   - vite.config.js middleware (local `npm run dev`)
// so both environments expose the identical GET /api/leetcode contract:
//
//   200 → { solved, username, profileUrl, difficulty, cachedAt, stale }
//   4xx/5xx → { error: "<stable code>" }   (details stay in the server log)

import { getCachedStats, LeetCodeError } from "./leetcode.js";

// CDN-friendly caching: browsers revalidate after a minute, Vercel's edge can
// reuse the response for 30 minutes (matching the service-level cache).
const SUCCESS_CACHE_CONTROL = "public, max-age=60, s-maxage=1800, stale-while-revalidate=3600";

function sendJson(res, status, body, cacheControl) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

export default async function leetcodeHandler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return sendJson(res, 405, { error: "method_not_allowed" }, "no-store");
  }

  try {
    const stats = await getCachedStats();
    return sendJson(
      res,
      200,
      {
        solved: stats.solved,
        username: stats.username,
        profileUrl: stats.profileUrl,
        difficulty: stats.difficulty,
        cachedAt: stats.cachedAt,
        stale: stats.stale,
      },
      SUCCESS_CACHE_CONTROL,
    );
  } catch (error) {
    // Real cause stays in the server log; clients get a stable error code.
    console.error("[api/leetcode]", error);
    const status = error instanceof LeetCodeError ? error.status : 500;
    const code = error instanceof LeetCodeError ? error.code : "internal_error";
    return sendJson(res, status, { error: code }, "no-store");
  }
}

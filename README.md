# Portfolio

React + Vite + Tailwind portfolio.

## Quick Stats: live LeetCode count

The **DSA Problems** number in *Quick Stats* is fetched from LeetCode instead of
being hardcoded. The other three stats (`15+ Projects Built`, `7.2 CGPA`,
`4+ Certifications`) are static and unchanged.

### Architecture

```
QuickStats.jsx  →  useLeetCodeSolved  →  src/services/leetcode.js
                                              ↓  GET /api/leetcode  (same-origin)
                              Vercel function  ←→  Vite dev middleware
                              api/leetcode.js      vite.config.js
                                              ↓
                                   server/leetcode.js (cache + fetch)
                                              ↓
                          LeetCode public GraphQL endpoint (no credentials)
```

LeetCode-specific knowledge (URL, schema, credentials-free request, cache) lives
only in `server/leetcode.js`; the browser only ever sees a validated
`{ solved, username, profileUrl, difficulty, stale }` payload or a stable error
code. No secrets are shipped to the frontend.

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `LEETCODE_USERNAME` | `the_ojhaji9` | Profile to read (public info, not a secret) |
| `LEETCODE_CACHE_TTL_MS` | `1800000` (30 min) | Server-side cache TTL (keep it in 15–60 min) |

Copy `.env.example` to `.env` to override locally; set the same variables in
your Vercel project settings for production.

### Caching & refresh behaviour

- **Server (in-memory):** 30 minutes — LeetCode is requested at most once per
  TTL per instance.
- **CDN (Vercel edge):** `s-maxage=1800, stale-while-revalidate=3600`.
- **Browser:** a value younger than 15 minutes short-circuits the network;
  the last known value is kept in `sessionStorage` as a failure fallback.

Solving a problem on LeetCode therefore appears on the portfolio **after the
cache expires** (up to ~30 minutes). Delayed updates are expected.

### Behaviour on failure

The portfolio never blocks on LeetCode and never shows a fake number:

| State | Card shows |
| --- | --- |
| Loading | `—` with a subtle pulse |
| Success | `247` + `↗ LeetCode` profile link |
| API down, previous value exists | last known count, tooltip says it's stale |
| API down, no previous value | `—` (static) + `console.warn` in dev |

Errors map to stable codes: `not_found` (404), `unavailable` (502),
`timeout` (504), `rate_limited` (429), `malformed_response` (502),
`invalid_config` (500).

### Commands

```bash
npm run dev      # local dev; /api/leetcode served by a Vite middleware
npm run build    # production build
npm run lint     # eslint
npm test         # vitest (service, API handler, Quick Stats component)
```

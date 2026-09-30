// Development-only helpers for verifying that every `githubUrl` in the project
// data actually resolves to a publicly reachable repository.
//
// GitHub returns the same 404 for a private repository as it does for one that
// does not exist, so an unreachable link is reported as "not publicly
// accessible" rather than guessing which of the two it is.

const GITHUB_REPO_API = "https://api.github.com/repos";

/** "https://github.com/owner/repo" -> "owner/repo" (null if not a repo URL). */
export function parseRepoSlug(url) {
  if (typeof url !== "string") return null;

  const match = /^https?:\/\/(?:www\.)?github\.com\/([^/\s]+)\/([^/\s?#]+)/i.exec(url.trim());
  if (!match) return null;

  return `${match[1]}/${match[2].replace(/\.git$/i, "")}`;
}

async function checkSlug(slug) {
  try {
    const response = await fetch(`${GITHUB_REPO_API}/${slug}`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (response.ok) {
      const repo = await response.json();
      // Authenticated-looking responses can still report private: true.
      return { slug, status: repo.private ? "inaccessible" : "ok" };
    }

    // Don't let a rate-limited request masquerade as a private repository.
    if (response.headers.get("x-ratelimit-remaining") === "0") {
      return { slug, status: "rate-limited" };
    }

    if (response.status === 404) return { slug, status: "inaccessible" };

    return { slug, status: "error", detail: `HTTP ${response.status}` };
  } catch (error) {
    // Offline, DNS failure, CORS — indistinguishable from a network hiccup.
    return { slug, status: "error", detail: error?.message ?? "Network error" };
  }
}

/**
 * Checks every distinct GitHub URL across the supplied projects.
 * `cacheKey` lets the caller reuse the result across component remounts so that
 * HMR and client-side navigation don't burn through the 60/hour rate limit.
 */
let cachedRun = null;

export async function checkGithubLinks(projects) {
  const entries = projects
    .filter((project) => project.githubUrl)
    .map((project) => ({
      projectId: project.id,
      title: project.title,
      url: project.githubUrl,
      slug: parseRepoSlug(project.githubUrl),
    }));

  const malformed = entries
    .filter((entry) => entry.slug === null)
    .map((entry) => ({ ...entry, status: "malformed", detail: "Not a github.com repository URL" }));

  const valid = entries.filter((entry) => entry.slug !== null);

  // Distinct slugs only — several projects can point at the same repository.
  const uniqueSlugs = [...new Set(valid.map((entry) => entry.slug))];
  const settled = await Promise.all(uniqueSlugs.map((slug) => checkSlug(slug)));

  const bySlug = new Map(settled.map((result) => [result.slug, result]));
  const results = [
    ...malformed,
    ...valid.map((entry) => ({ ...entry, ...bySlug.get(entry.slug) })),
  ];

  return {
    checkedAt: Date.now(),
    results,
    problems: results.filter((result) => result.status !== "ok"),
    checkedCount: results.length,
  };
}

export function getCachedRun() {
  return cachedRun;
}

export function setCachedRun(run) {
  cachedRun = run;
}

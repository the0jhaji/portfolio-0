import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { checkGithubLinks, getCachedRun, setCachedRun } from "../lib/githubLinks";

const STATUS_COPY = {
  inaccessible: {
    icon: "lock",
    label: "Not publicly accessible",
    hint: "GitHub returns the same response for a private repository as for one that does not exist, so this is either a private repo, a typo in the URL, or a repo that has been deleted/renamed.",
    tone: "text-error",
    ring: "bg-error/10",
  },
  "rate-limited": {
    icon: "hourglass_top",
    label: "Rate limited by GitHub",
    hint: "Anonymous GitHub API requests are capped at 60 per hour per IP address. These were not actually checked — re-run the check in a little while.",
    tone: "text-secondary",
    ring: "bg-secondary/10",
  },
  malformed: {
    icon: "link_off",
    label: "Malformed repository URL",
    hint: "This does not look like a github.com/owner/repository address.",
    tone: "text-error",
    ring: "bg-error/10",
  },
  error: {
    icon: "wifi_off",
    label: "Could not be checked",
    hint: "The request failed before GitHub could answer, so the link's visibility is unknown.",
    tone: "text-secondary",
    ring: "bg-secondary/10",
  },
};

function IssueList({ problems }) {
  return (
    <ul className="mt-5 flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
      {problems.map((problem) => {
        const copy = STATUS_COPY[problem.status] ?? STATUS_COPY.error;

        return (
          <li key={problem.projectId} className="neu-recessed rounded-2xl p-4 text-left">
            <div className="flex items-start gap-3">
              <span
                className={`material-symbols-outlined ${copy.tone} mt-0.5 text-xl`}
                aria-hidden="true"
              >
                {copy.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-on-surface">{problem.title}</p>
                <p className="mt-0.5 break-all font-label-mono text-xs text-secondary">
                  {problem.slug ?? problem.url}
                </p>
                <p className={`mt-2 text-xs font-semibold ${copy.tone}`}>
                  {copy.label}
                  {problem.detail ? ` — ${problem.detail}` : ""}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-on-surface-variant">
                  {copy.hint}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// A rate-limited or network-failed request proves nothing about visibility, so it
// must never be reported as a private repo.
const UNVERIFIED_STATUSES = new Set(["rate-limited", "error"]);

function ResultDialog({ run, onClose, onRecheck, isChecking }) {
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);
  const problems = run.problems;
  const isClean = problems.length === 0;

  const blocked = problems.filter((problem) => !UNVERIFIED_STATUSES.has(problem.status));
  const unverified = problems.length - blocked.length;
  const blockedCount = blocked.length;

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const titleId = "github-link-check-title";
  const descriptionId = "github-link-check-description";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/35 p-5 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-[28px] bg-surface p-7 text-on-surface neu-raised sm:p-8"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="neu-recessed flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
            <span className="material-symbols-outlined text-3xl" aria-hidden="true">
              {isClean ? "verified" : blockedCount > 0 ? "lock_person" : "help"}
            </span>
          </div>
          <button
            ref={closeRef}
            className="neu-raised neu-interactive flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            type="button"
            onClick={onClose}
            aria-label="Close GitHub link check"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <h3 id={titleId} className="mt-6 text-2xl font-bold text-on-surface">
          {isClean
            ? `All ${run.checkedCount} GitHub links are public`
            : blockedCount > 0
              ? `${blockedCount} GitHub ${blockedCount === 1 ? "link is" : "links are"} not public`
              : `${unverified} GitHub ${unverified === 1 ? "link was" : "links were"} not checked`}
        </h3>

        <p id={descriptionId} className="mt-3 text-sm leading-6 text-on-surface-variant">
          {isClean
            ? "Every repository link in the project data resolves to a public repository, so visitors will be able to open all of them."
            : blockedCount > 0
              ? "A visitor clicking these buttons would land on a GitHub 404. Either make the repository public, fix the URL, or set githubUrl to null so the card shows its polite “not public yet” notice instead."
              : "GitHub would not answer these requests, so nothing is known about whether the repositories are public. This is not a warning about your projects — re-run the check once the rate limit resets."}
        </p>

        {isClean ? null : <IssueList problems={problems} />}

        <p className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/10 px-3 py-2 text-xs text-secondary">
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            code_blocks
          </span>
          Development build only — this check never runs in production.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="neu-raised neu-interactive flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            type="button"
            onClick={onRecheck}
            disabled={isChecking}
          >
            <span
              className={`material-symbols-outlined ${isChecking ? "animate-spin" : ""}`}
              aria-hidden="true"
            >
              refresh
            </span>
            {isChecking ? "Checking…" : "Re-check"}
          </button>
          <button
            className="neu-raised neu-interactive rounded-xl px-5 py-3 text-sm font-bold text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            type="button"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Dev-only guard that flags any `githubUrl` in the project data which does not
 * resolve to a publicly reachable repository.
 *
 * Renders nothing at all in a production build, so the warning is never shown
 * to visitors.
 */
export default function GithubLinkGuard({ projects }) {
  const [run, setRun] = useState(() => getCachedRun());
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const hasRun = run !== null;

  const runCheck = useCallback(
    async ({ reuseCache }) => {
      setIsChecking(true);
      try {
        if (reuseCache) {
          const cached = getCachedRun();
          if (cached) {
            setRun(cached);
            return;
          }
        }
        const result = await checkGithubLinks(projects);
        setCachedRun(result);
        setRun(result);
      } finally {
        setIsChecking(false);
      }
    },
    [projects],
  );

  // First pass: reuse the module-level cache so HMR doesn't re-hit the API.
  useEffect(() => {
    if (!hasRun) void runCheck({ reuseCache: false });
  }, [hasRun, runCheck]);

  // Only a confirmed bad link warrants interrupting you. A rate-limited run
  // stays behind the badge so it can't cry wolf.
  const blockedCount =
    run?.problems.filter((problem) => !UNVERIFIED_STATUSES.has(problem.status)).length ?? 0;
  useEffect(() => {
    if (blockedCount > 0) setIsOpen(true);
  }, [blockedCount]);

  if (!import.meta.env.DEV) return null;

  const problemCount = run?.problems.length ?? 0;
  const problemTone = blockedCount > 0 ? "text-error" : "text-primary";

  return (
    <>
      {/* Persistent dev-only trigger, so the check can be re-run after a fix. */}
      <button
        type="button"
        onClick={() => void runCheck({ reuseCache: false })}
        onDoubleClick={() => setIsOpen(true)}
        className="neu-raised neu-interactive fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Dev only — re-check GitHub links (double-click for details)"
      >
        <span
          className={`material-symbols-outlined text-lg ${isChecking ? "animate-spin" : ""} ${problemTone}`}
          aria-hidden="true"
        >
          {isChecking
            ? "progress_activity"
            : blockedCount > 0
              ? "lock_person"
              : problemCount > 0
                ? "help"
                : "verified"}
        </span>
        <span className={problemTone}>
          {isChecking
            ? "Checking…"
            : !hasRun
              ? "Check links"
              : blockedCount > 0
                ? `${blockedCount} private link${blockedCount === 1 ? "" : "s"}`
                : problemCount > 0
                  ? `${problemCount} unchecked`
                  : `${run.checkedCount} links OK`}
        </span>
      </button>

      {isOpen && run && (
        <ResultDialog
          run={run}
          isChecking={isChecking}
          onClose={() => setIsOpen(false)}
          onRecheck={() => void runCheck({ reuseCache: false })}
        />
      )}
    </>
  );
}

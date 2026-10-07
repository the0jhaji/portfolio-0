import useLeetCodeSolved from "../hooks/useLeetCodeSolved";

// The three static stats keep their original values and markup — only the
// DSA Problems cell became dynamic.
const stats = [
  { value: "15+", label: "Projects Built" },
  { value: "7.2", label: "CGPA" },
  { value: "4+", label: "Certifications" },
];

/**
 * The dynamic "DSA Problems" cell.
 *
 * - loading → "—" with the project's existing pulse animation
 * - success → the real solved count from LeetCode (+ profile link)
 * - error   → "—" (static) so a LeetCode outage can never show a fake number,
 *             `undefined`, `NaN`, `null` or `0`, and never crashes the page.
 */
function DsaProblemStat() {
  const { status, data } = useLeetCodeSolved();
  const isLoading = status === "loading";

  const value = status === "success" ? String(data.solved) : "—";
  const title = isLoading
    ? "Loading LeetCode stats…"
    : status === "error"
      ? "LeetCode data unavailable"
      : data.stale
        ? "Last known value — LeetCode is currently unreachable"
        : `Solved on LeetCode — ${data.username ?? "profile"}`;

  return (
    <div className="flex min-w-0 flex-col items-center text-center p-2">
      <p
        className={`text-3xl font-bold text-primary${isLoading ? " motion-safe:animate-pulse" : ""}`}
        title={title}
        aria-live="polite"
      >
        {value}
      </p>
      <p className="mt-1 w-full break-words text-xs font-medium uppercase tracking-wide text-secondary">
        DSA Problems
      </p>
      {status === "success" && data.profileUrl && (
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 text-[10px] font-medium tracking-wide text-secondary transition-colors hover:text-primary"
          aria-label="Open my LeetCode profile"
        >
          <span aria-hidden="true">↗</span> LeetCode
        </a>
      )}
    </div>
  );
}

export default function QuickStats() {
  return (
    <div className="neu-recessed rounded-2xl p-6 mt-4">
      <h3 className="font-bold text-on-surface mb-4">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <DsaProblemStat />
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col items-center text-center p-2"
          >
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            {/* "Certifications" is one unbreakable word. It needs w-full
                as well as break-words: as a flex item its default
                min-width:auto is its min-content width, so break-words
                alone never gets a chance to fire. */}
            <p className="mt-1 w-full break-words text-xs font-medium uppercase tracking-wide text-secondary">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

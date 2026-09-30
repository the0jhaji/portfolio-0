import { useTheme } from "../lib/useTheme";

/**
 * Light/dark switch. The label names the destination, not the current state,
 * so it stays unambiguous to read out on a screen reader.
 */
export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className={`neu-raised neu-interactive flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${className}`}
      onClick={toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      type="button"
    >
      {/* Both glyphs are always mounted and cross-faded, so the icon does not
          pop in at a different size between the two themes. */}
      <span className="relative block h-6 w-6">
        <span
          aria-hidden="true"
          className={`material-symbols-outlined absolute inset-0 flex items-center justify-center text-xl transition-all duration-300 ${
            isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        >
          light_mode
        </span>
        <span
          aria-hidden="true"
          className={`material-symbols-outlined absolute inset-0 flex items-center justify-center text-xl transition-all duration-300 ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          }`}
        >
          dark_mode
        </span>
      </span>
    </button>
  );
}

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";
const THEMES = ["light", "dark"];

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : null;
  } catch {
    // Storage can be unavailable in private mode; treat that as "no preference".
    return null;
  }
}

function systemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  // Keep the browser chrome (address bar on mobile) in step with the page.
  const color = theme === "dark" ? "#22252e" : "#e0e5ec";
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    // The media-scoped copies are for visitors who never toggle; once we set
    // the theme explicitly ourselves, an unscoped one has to win.
    if (meta.getAttribute("media")) meta.removeAttribute("media");
    meta.setAttribute("content", color);
  }
}

/**
 * Resolves the active theme and keeps <html data-theme> in sync.
 *
 * Precedence is explicit choice > OS preference > light. The no-flash script in
 * index.html has already painted the correct theme before React mounts, so this
 * hook only has to agree with it, not repaint.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || systemTheme();
  });

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort; the theme still applies for this page view.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Follow the OS only while the visitor has not expressed a preference of
  // their own — otherwise un-toggling would silently undo their explicit choice.
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event) => {
      if (readStoredTheme()) return;
      const next = event.matches ? "dark" : "light";
      setThemeState(next);
      applyTheme(next);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return { theme, setTheme, toggleTheme };
}

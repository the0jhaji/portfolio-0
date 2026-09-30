import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SESSION_KEY = "astra-welcome-seen";
// Progress runs over 3s, then ~0.3s hold at 100% plus the 0.5s fade-out, so
// the overlay is on screen for roughly 3.8s — comfortably above the 3s minimum.
const DURATION_MS = 3000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function WelcomeLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const startRef = useRef(null);

  const finish = useCallback(() => {
    setIsDone(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // A loader that replays on every route change is noise, and one that
    // ignores reduced-motion is motion nobody asked for.
    if (prefersReducedMotion() || sessionStorage.getItem(SESSION_KEY)) {
      finish();
      return undefined;
    }

    startRef.current = performance.now();
    let tick = null;
    let hideTimer = null;

    // Driven by a timer, not requestAnimationFrame: rAF is paused in hidden and
    // background tabs, which would strand the bar at 0% for anyone who opens the
    // site in a background tab and only later switches to it.
    tick = window.setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      // Ease-out so it decelerates into 100% instead of snapping at the end.
      const ratio = Math.min(1, elapsed / DURATION_MS);
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      setProgress(Math.round(eased * 100));

      if (ratio >= 1) {
        window.clearInterval(tick);
        // Hold briefly at 100% so the completion reads as deliberate.
        hideTimer = window.setTimeout(() => setIsLeaving(true), 320);
      }
    }, 40);

    return () => {
      if (tick !== null) window.clearInterval(tick);
      if (hideTimer !== null) window.clearTimeout(hideTimer);
    };
  }, [finish]);

  // Unmount after the fade-out transition finishes, then remember this visit so
  // the loader does not return on client-side navigation.
  const onTransitionEnd = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    finish();
  };

  // Safety net: if the transition never fires (background tab, reduced motion
  // mid-flight) the overlay must not stay stuck over the page.
  useEffect(() => {
    if (!isLeaving) return undefined;
    const timer = window.setTimeout(onTransitionEnd, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaving, finish]);

  if (isDone) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-surface px-6 transition-opacity duration-500 ease-out ${
        isLeaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio, ${progress} percent`}
    >
      {/* Monogram */}
      <div className="neu-raised flex h-24 w-24 items-center justify-center rounded-[28px] text-4xl font-bold text-primary motion-safe:animate-pulse">
        AO
      </div>

      <div className="text-center">
        <p className="font-label-mono text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
          Welcome to
        </p>
        <p className="mt-2 font-display text-4xl font-bold text-on-surface sm:text-5xl">
          My Portfolio
        </p>
        <p className="mt-2 text-sm text-secondary">Adarsh Ojha</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div
          className="neu-recessed h-1.5 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading progress"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-center font-label-mono text-xs text-secondary">
          {progress}%
        </p>
      </div>
    </div>,
    document.body,
  );
}

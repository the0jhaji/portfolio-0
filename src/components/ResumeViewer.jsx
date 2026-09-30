import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Full-screen preview of a resume PDF, opened from the navbar dropdown.
 *
 * Selecting a resume no longer downloads it directly — it opens here, embedded
 * in the site, with an explicit Download button in the header. The dialog is
 * deliberately framed like the site's other overlays: portal to <body> so the
 * fixed navbar cannot trap it, body scroll locked while open, Escape to close,
 * backdrop click to close, and focus moved into the dialog.
 */
export default function ResumeViewer({ resume, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      // Simple focus trap so the Tab key cannot wander into the page behind
      // the overlay (the PDF iframe is intentionally left out of the trap).
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = dialog.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === dialog)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  if (!resume) return null;

  const titleId = "resume-viewer-title";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/35 p-4 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-surface text-on-surface neu-raised sm:h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="neu-recessed flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary">
              <span className="material-symbols-outlined" aria-hidden="true">
                {resume.icon}
              </span>
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-base font-bold">
                {resume.label}
              </h2>
              <p className="truncate font-label-mono text-xs text-secondary">
                Preview — use Download for the actual file
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={resume.href}
              download={resume.downloadName}
              className="neu-raised neu-interactive flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label={`Download ${resume.label}`}
            >
              <span className="material-symbols-outlined text-base" aria-hidden="true">
                download
              </span>
              Download
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close resume preview"
              className="neu-raised neu-interactive flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>
          </div>
        </div>

        <div className="bg-on-surface/5 min-h-0 flex-1">
          <iframe
            src={resume.href}
            title={`${resume.label} preview`}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import certificates from "virtual:certificates";

const imageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

export function formatCertificateTitle(filename) {
  const title = filename
    .replace(/\.[^.]+$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return title
    .split(/\s+/)
    .map((word) => {
      if (/^[a-z]{2,3}$/i.test(word)) return word.toUpperCase();
      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
    })
    .join(" ");
}

export default function Certificates() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const isOpen = activeIndex !== null;
  const activeCertificate = isOpen ? certificates[activeIndex] : null;
  const activeTitle = activeCertificate
    ? formatCertificateTitle(activeCertificate.filename)
    : "";
  const isImage = activeCertificate
    ? imageExtensions.has(activeCertificate.filename.match(/\.[^.]+$/)?.[0].toLowerCase())
    : false;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + certificates.length) % certificates.length);
        setZoom(1);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % certificates.length);
        setZoom(1);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const showCertificate = (index) => {
    setActiveIndex(index);
    setZoom(1);
  };

  const navigate = (direction) => {
    setActiveIndex((index) => (index + direction + certificates.length) % certificates.length);
    setZoom(1);
  };

  return (
    <section className="scroll-mt-32 section" id="certificates">
      <h2 className="mb-12 font-headline-lg text-4xl font-bold text-on-surface reveal">
        Certificates &amp; Achievements
      </h2>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, index) => {
            const title = formatCertificateTitle(certificate.filename);
            const isCardImage = imageExtensions.has(
              certificate.filename.match(/\.[^.]+$/)?.[0].toLowerCase(),
            );

            return (
              <button
                key={certificate.filename}
                type="button"
                onClick={() => showCertificate(index)}
                aria-label={`View ${title} certificate`}
                className="neu-raised group overflow-hidden rounded-3xl text-left transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-hud/20 p-3">
                  {isCardImage ? (
                    <img
                      src={certificate.src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full rounded-xl object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <span className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl text-primary">
                      <span className="material-symbols-outlined text-5xl" aria-hidden="true">
                        picture_as_pdf
                      </span>
                      <span className="text-sm font-medium">PDF certificate</span>
                    </span>
                  )}
                </span>
                <span className="block px-5 py-4 font-bold text-on-surface transition-colors group-hover:text-primary">
                  {title}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-secondary">Certificates will appear here when added.</p>
      )}

      <div className="mt-10">
        <h3 className="mb-5 text-2xl font-bold text-on-surface">Achievements</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="neu-raised rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-xl font-bold text-on-surface">
                Campus Ambassador — IIT Kharagpur
              </h4>
              <span className="rounded-full bg-primary/10 px-3 py-1 font-label-mono text-xs font-medium text-primary">
                2025
              </span>
            </div>
            <p className="mt-4 max-w-4xl leading-relaxed text-secondary">
              Served as a Campus Ambassador representing IIT Kharagpur, helping
              promote institute initiatives, events, and opportunities among
              students. Contributed to student outreach, communication, and
              campus-level engagement.
            </p>
          </article>
          <article className="neu-raised rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-xl font-bold text-on-surface">
                Top 50 Team — Smart India Hackathon (SIH) Internal Round
              </h4>
              <span className="rounded-full bg-primary/10 px-3 py-1 font-label-mono text-xs font-medium text-primary">
                2026
              </span>
            </div>
            <p className="mt-4 max-w-4xl leading-relaxed text-secondary">
              Achieved a Top 50 team position in the internal selection round of
              the Smart India Hackathon (SIH), demonstrating teamwork,
              innovation, and problem-solving skills.
            </p>
          </article>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-3 text-white sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeTitle} certificate preview`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setActiveIndex(null);
            }}
          >
            <header className="flex min-h-12 shrink-0 items-center justify-between gap-3">
              <h3 className="truncate text-base font-semibold sm:text-lg">{activeTitle}</h3>
              <div className="flex shrink-0 items-center gap-2">
                {isImage && (
                  <>
                    <button
                      type="button"
                      onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
                      aria-label="Zoom out"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">remove</span>
                    </button>
                    <span className="min-w-12 text-center text-sm" aria-live="polite">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
                      aria-label="Zoom in"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">add</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close certificate preview"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto py-3">
              {isImage ? (
                <img
                  src={activeCertificate.src}
                  alt={activeTitle}
                  className="max-h-[calc(100dvh-8rem)] max-w-[calc(100vw-1.5rem)] object-contain transition-transform duration-200 sm:max-w-[calc(100vw-2.5rem)]"
                  style={{ transform: `scale(${zoom})` }}
                />
              ) : (
                <iframe
                  src={activeCertificate.src}
                  title={activeTitle}
                  className="h-full w-full rounded-xl bg-white"
                />
              )}
            </div>

            <footer className="flex min-h-12 shrink-0 items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Previous certificate"
                className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-sm text-white/75">
                {activeIndex + 1} / {certificates.length}
              </span>
              <button
                type="button"
                onClick={() => navigate(1)}
                aria-label="Next certificate"
                className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </button>
            </footer>
          </div>,
          document.body,
        )}
    </section>
  );
}

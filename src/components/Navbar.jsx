import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import ResumeViewer from "./ResumeViewer";

const links = [
  { target: "about", label: "About" },
  { target: "experience", label: "Experience" },
  { target: "skills", label: "Skills" },
  { target: "projects", label: "Projects" },
  { target: "contact", label: "Contact" },
];

const resumeLinks = [
  {
    href: "/resume-ml.pdf",
    label: "ML Resume",
    icon: "neurology",
    // downloadName is only used by the viewer's Download button.
    downloadName: "Adarsh-Ojha-ML-Resume.pdf",
  },
  {
    href: "/resume-web-development.pdf",
    label: "Web Dev Resume",
    icon: "code",
    downloadName: "Adarsh-Ojha-Web-Development-Resume.pdf",
  },
];

export default function Navbar({ activeSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Two separate states on purpose: the desktop dropdown and the mobile
  // disclosure are never visible at the same time, but the desktop one has an
  // outside-click listener that would collapse the mobile one the instant it
  // opened if they shared a flag.
  const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);
  const [isMobileResumeOpen, setIsMobileResumeOpen] = useState(false);
  // Non-null when the resume preview dialog is open on the selected resume.
  const [openResume, setOpenResume] = useState(null);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileResumeOpen(false);
  };

  const resumeMenuRef = useRef(null);

  // Close the desktop dropdown on an outside click or Escape. The dropdown is
  // only ever mounted while open, so the listener's lifetime matches the menu.
  useEffect(() => {
    if (!isResumeMenuOpen) return undefined;

    const onPointerDown = (event) => {
      if (resumeMenuRef.current && !resumeMenuRef.current.contains(event.target)) {
        setIsResumeMenuOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsResumeMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isResumeMenuOpen]);

  const openResumePreview = (resume) => {
    setIsResumeMenuOpen(false);
    closeMenu();
    setOpenResume(resume);
  };

  return (
    <nav
      className="nav-safe fixed left-0 right-0 top-0 z-50 mx-auto flex w-[95%] max-w-container-max items-center justify-between rounded-full bg-surface py-4 neu-raised transition-all duration-300"
      aria-label="Primary navigation"
    >
      <a
        className="flex min-h-11 min-w-0 items-center gap-3 font-headline-lg font-bold tracking-tighter text-on-surface transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        href="/"
        onClick={closeMenu}
      >
        <img
          src="/logo.png"
          alt="Adarsh Ojha logo"
          width="40"
          height="40"
          className="brand-mark h-10 w-10 shrink-0 rounded-xl object-contain"
        />
        <span className="hidden truncate sm:inline">ADARSH</span>
      </a>

      {/* The desktop bar needs ~1024px before the five links, the resume
          dropdown and the wordmark stop competing for room. Below that the
          burger menu is the better layout, so the breakpoint is lg rather
          than md. */}
      <div className="hidden items-center space-x-6 lg:flex">
        {links.map((link) => (
          <a
            key={link.target}
            className={`nav-link font-body-md font-medium text-secondary transition-colors hover:text-primary ${
              activeSection === link.target ? "active-link" : ""
            }`}
            data-target={link.target}
            href={`/#${link.target}`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="hidden items-center lg:flex">
        <div ref={resumeMenuRef} className="relative">
          <button
            type="button"
            className={`neu-raised neu-interactive flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary transition-[box-shadow,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              isResumeMenuOpen ? "neu-recessed" : ""
            }`}
            aria-haspopup="menu"
            aria-expanded={isResumeMenuOpen}
            aria-controls="desktop-resume-menu"
            onClick={() => setIsResumeMenuOpen((isOpen) => !isOpen)}
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              description
            </span>
            Resume
            <span
              className={`material-symbols-outlined text-base transition-transform duration-300 ${
                isResumeMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>

          {isResumeMenuOpen && (
            <div
              id="desktop-resume-menu"
              role="menu"
              aria-label="Resume options"
              className="absolute right-0 top-full z-50 mt-3 min-w-[230px] rounded-2xl bg-surface p-2 neu-raised"
            >
              {resumeLinks.map((resume, index) => (
                <button
                  key={resume.href}
                  type="button"
                  role="menuitem"
                  onClick={() => openResumePreview(resume)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-on-surface transition-colors hover:bg-hud/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    index > 0 ? "mt-0.5 border-t border-hairline/60 pt-2.5" : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-secondary" aria-hidden="true">
                    {resume.icon}
                  </span>
                  {resume.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ThemeToggle />

      {/* 44px to match the theme toggle beside it; p-2 around a 24px glyph
          only reached 40px. */}
      <button
        className="neu-raised neu-interactive flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary lg:hidden"
        type="button"
        onClick={() => {
          setIsMenuOpen((isOpen) => !isOpen);
          setIsMobileResumeOpen(false);
        }}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span className="material-symbols-outlined">
          {isMenuOpen ? "close" : "menu"}
        </span>
      </button>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 right-0 top-[calc(100%+12px)] max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-[28px] bg-surface p-4 neu-raised lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.target}
                className={`rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-hud/30 hover:text-primary ${
                  activeSection === link.target
                    ? "text-primary"
                    : "text-on-surface-variant"
                }`}
                href={`/#${link.target}`}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Same "open, don't download" resume behaviour as the desktop
              dropdown, collapsed so the burger menu stays short. */}
          <div className="mt-3 border-t border-hairline pt-3">
            <div>
              <button
                type="button"
                aria-expanded={isMobileResumeOpen}
                aria-controls="mobile-resume-menu"
                onClick={() => setIsMobileResumeOpen((isOpen) => !isOpen)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-hud/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary" aria-hidden="true">
                    description
                  </span>
                  Resume
                </span>
                <span
                  className={`material-symbols-outlined text-base transition-transform duration-300 ${
                    isMobileResumeOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </button>

              {isMobileResumeOpen && (
                <div id="mobile-resume-menu" className="mt-1 flex flex-col gap-1">
                  {resumeLinks.map((resume) => (
                    <button
                      key={resume.href}
                      type="button"
                      onClick={() => openResumePreview(resume)}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-secondary transition-colors hover:bg-hud/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="material-symbols-outlined text-base" aria-hidden="true">
                        {resume.icon}
                      </span>
                      {resume.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openResume && (
        <ResumeViewer resume={openResume} onClose={() => setOpenResume(null)} />
      )}
    </nav>
  );
}
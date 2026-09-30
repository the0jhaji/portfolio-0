import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { target: "about", label: "About" },
  { target: "experience", label: "Experience" },
  { target: "skills", label: "Skills" },
  { target: "projects", label: "Projects" },
  { target: "contact", label: "Contact" },
];

const resumeLinks = [
  { href: "/resume-ml.pdf", label: "ML Resume", icon: "neurology" },
  {
    href: "/resume-web-development.pdf",
    label: "Web Dev Resume",
    icon: "code",
  },
];

export default function Navbar({ activeSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

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

      {/* The desktop bar needs ~1024px before the five links, two resume buttons
          and the wordmark stop competing for room. Below that the burger menu
          is the better layout, so the breakpoint is lg rather than md. */}
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

      <div className="hidden items-center gap-3 lg:flex">
        {resumeLinks.map((resume, index) => (
          <a
            key={resume.href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              index === 0
                ? "neu-raised neu-interactive text-primary"
                : "neu-recessed neu-interactive text-on-surface"
            }`}
            href={resume.href}
            download
          >
            <span className="material-symbols-outlined text-base">
              {resume.icon}
            </span>
            {resume.label}
          </a>
        ))}
      </div>

      <ThemeToggle />

      {/* 44px to match the theme toggle beside it; p-2 around a 24px glyph
          only reached 40px. */}
      <button
        className="neu-raised neu-interactive flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary lg:hidden"
        type="button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
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

          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-hairline pt-3 sm:grid-cols-2">
            {resumeLinks.map((resume) => (
              <a
                key={resume.href}
                className="neu-raised flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-primary"
                href={resume.href}
                download
                onClick={closeMenu}
              >
                <span className="material-symbols-outlined text-base">
                  {resume.icon}
                </span>
                {resume.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

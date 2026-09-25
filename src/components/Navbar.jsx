import { useState } from "react";

const links = [
  { target: "about", label: "About" },
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
      className="fixed left-0 right-0 top-0 z-50 mx-auto mt-4 flex w-[95%] max-w-container-max items-center justify-between rounded-full bg-surface px-5 py-4 neu-raised transition-all duration-300 md:px-8"
      aria-label="Primary navigation"
    >
      <a
        className="font-headline-lg font-bold tracking-tighter text-on-surface"
        href="/"
        onClick={closeMenu}
      >
        ADARSH
      </a>

      <div className="hidden items-center space-x-6 md:flex">
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

      <div className="hidden items-center gap-3 md:flex">
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

      <button
        className="neu-raised neu-interactive flex items-center justify-center rounded-full p-2 text-primary md:hidden"
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
          className="absolute left-0 right-0 top-[calc(100%+12px)] rounded-[28px] bg-surface p-4 neu-raised md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.target}
                className={`rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-white/30 hover:text-primary ${
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

          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-white/50 pt-3 sm:grid-cols-2">
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

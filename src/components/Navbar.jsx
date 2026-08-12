const links = [
  { target: "about", label: "About" },
  { target: "skills", label: "Skills" },
  { target: "projects", label: "Projects" },
  { target: "contact", label: "Contact" },
];

export default function Navbar({ activeSection }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-surface rounded-full mt-4 mx-auto w-[95%] max-w-container-max neu-raised transition-all duration-300">
      <div className="font-headline-lg font-bold tracking-tighter text-on-surface">
        ADARSH
      </div>

      <div className="hidden md:flex items-center space-x-6 nav-container">
        {links.map((link) => (
          <a
            key={link.target}
            className={`nav-link text-secondary hover:text-primary transition-colors font-body-md font-medium ${
              activeSection === link.target ? "active-link" : ""
            }`}
            data-target={link.target}
            href={`/#${link.target}`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <button className="neu-raised neu-interactive px-6 py-2 rounded-full text-primary font-bold transition-all hidden md:block">
        Resume
      </button>

      <button
        className="md:hidden neu-raised p-2 rounded-full flex items-center justify-center text-primary"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
    </nav>
  );
}

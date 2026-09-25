import GitHubIcon from "./GitHubIcon";

export default function Footer() {
  return (
    <footer className="w-full pt-12 pb-12 mt-12 border-t-2 border-white/20 reveal active">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-headline-lg font-bold text-2xl text-on-surface">ADARSH</div>
          <p className="font-caption text-secondary">Building. Learning. Shipping.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-secondary hover:text-primary transition-colors font-medium" href="#about">
            About
          </a>
          <a className="text-secondary hover:text-primary transition-colors font-medium" href="/#projects">
            Projects
          </a>
        </div>

        <div className="flex gap-4">
          <a
            className="neu-raised neu-interactive w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors"
            href="https://github.com/the0jhaji"
          >
            <GitHubIcon />
          </a>
          <a
            className="neu-raised neu-interactive w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors"
            href="https://www.linkedin.com/in/adarsh-ojha-2204b3322/"
          >
            <span className="material-symbols-outlined">link</span>
          </a>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-8 text-center md:text-left text-sm text-secondary/60">
        © 2026 Adarsh&nbsp;
      </div>
    </footer>
  );
}

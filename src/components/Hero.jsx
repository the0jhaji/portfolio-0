import { SOCIAL_LINKS } from "../data/contact";
import { SocialIcon } from "./SocialIcon";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh] section" id="hero">
      <div className="flex flex-col gap-6 reveal active">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-label-mono text-primary uppercase tracking-widest bg-primary/10 w-max px-4 py-1 rounded-full text-sm">
            CSE • AI/ML • Software Engineering
          </span>
          <span className="font-label-mono text-success uppercase tracking-widest bg-success/10 px-4 py-1 rounded-full text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Open to opportunities
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-on-surface">
          Hi, I'm Adarsh.
        </h1>
        <p className="font-headline-lg-mobile md:text-3xl text-on-surface-variant font-medium">
          I build thoughtful software with code, AI &amp; curiosity.
        </p>
        <p className="font-body-lg text-secondary max-w-lg">
          Passionate about solving complex problems through elegant code. Currently
          focusing on intelligent systems and scalable web architectures.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          <a
            className="neu-raised neu-interactive flex min-h-[44px] items-center justify-center rounded-full px-8 py-3 font-bold text-primary"
            href="#projects"
          >
            View Projects
          </a>
          <a
            className="neu-recessed neu-interactive flex min-h-[44px] items-center justify-center gap-2 rounded-full px-8 py-3 font-medium text-on-surface"
            href="#contact"
          >
            Let's Talk <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.key}
              className="neu-raised neu-interactive flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-3 text-secondary hover:text-primary transition-colors"
              href={social.href}
              aria-label={social.label}
              {...(social.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              <SocialIcon link={social} />
            </a>
          ))}
        </div>
      </div>

        <div className="neu-raised rounded-2xl p-6 flex flex-col items-center justify-center reveal stagger-1 active">
          <div className="neu-recessed p-3 rounded-2xl w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src="/profile.jpg"
              alt="Adarsh Ojha, Computer Science student specialising in AI and machine learning"
              width="458"
              height="486"
              decoding="async"
              className="w-full h-full object-cover rounded-xl aspect-square shadow-sm"
              onError={(event) => {
                // Self-hosted asset missing: show initials rather than a broken icon.
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement?.setAttribute("data-fallback", "AO");
              }}
            />
          </div>
        </div>
    </section>
  );
}

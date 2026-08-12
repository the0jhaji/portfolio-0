import GitHubIcon from "./GitHubIcon";

const socialLinks = [
  {
    href: "https://github.com/the0jhaji",
    label: "GitHub",
    icon: <GitHubIcon />,
  },
  { href: "#", label: "Code", icon: <span className="material-symbols-outlined">code</span> },
  { href: "#", label: "Work", icon: <span className="material-symbols-outlined">work</span> },
  { href: "#", label: "Mail", icon: <span className="material-symbols-outlined">mail</span> },
];

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh] section" id="hero">
      <div className="flex flex-col gap-6 reveal active">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-label-mono text-primary uppercase tracking-widest bg-primary/10 w-max px-4 py-1 rounded-full text-sm">
            CSE • AI/ML • Software Engineering
          </span>
          <span className="font-label-mono text-green-600 uppercase tracking-widest bg-green-500/10 px-4 py-1 rounded-full text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Open to opportunities
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-on-surface">
          Hi, I'm Adarsh.
        </h1>
        <h2 className="font-headline-lg-mobile md:text-3xl text-on-surface-variant font-medium">
          I build thoughtful software with code, AI &amp; curiosity.
        </h2>
        <p className="font-body-lg text-secondary max-w-lg">
          Passionate about solving complex problems through elegant code. Currently
          focusing on intelligent systems and scalable web architectures.
        </p>

        <div className="flex gap-4 mt-4">
          <button className="neu-raised neu-interactive px-8 py-3 rounded-full text-primary font-bold">
            View Projects
          </button>
          <a
            className="neu-recessed neu-interactive px-8 py-3 rounded-full text-on-surface font-medium flex items-center gap-2"
            href="#contact"
          >
            Let's Talk <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        <div className="flex gap-4 mt-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              className="neu-raised neu-interactive p-3 rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors"
              href={social.href}
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="neu-raised rounded-2xl p-6 flex flex-col items-center justify-center reveal stagger-1 active">
        <div className="neu-recessed p-3 rounded-2xl w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSwFgxPdqhwM_JGpp1WzjdN4Gwvr0aQF85-A1kxbGUz5VsDcQC3RuSD-YCMWX5H7fAto-OD5be3AFN3fdQig9a7-vqpiJqZ-9yw1cVxMltMzs9UdEpv2KT6D5mg64MfgvSb6z5TPQ6n9oNstsK8wE4cWtD1xyBnrS8TMHw-Xr7LqaQcNHV697hTTGQlhCi70wND9HKuiqjzDA5L9VPuPIjpUBW0mQkzF0g2gZd_SSDZDebyrBOVI7V8Hlbg0hLrj0xaQ"
            alt="Adarsh's Profile Photo"
            className="w-full h-full object-cover rounded-xl aspect-square shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}

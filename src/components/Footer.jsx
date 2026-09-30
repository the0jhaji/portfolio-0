import { CONTACT, SOCIAL_LINKS } from "../data/contact";
import { SocialIcon } from "./SocialIcon";

export default function Footer() {
  return (
    <footer className="w-full pt-12 pb-12 mt-12 border-t-2 border-hairline reveal active">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt=""
              width="36"
              height="36"
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
              aria-hidden="true"
            />
            <span className="font-headline-lg font-bold text-2xl text-on-surface">
              ADARSH
            </span>
          </div>
          <p className="font-caption text-secondary">Building. Learning. Shipping.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
          <a
            className="flex min-h-[44px] items-center text-secondary hover:text-primary transition-colors font-medium"
            href="#about"
          >
            About
          </a>
          <a
            className="flex min-h-[44px] items-center text-secondary hover:text-primary transition-colors font-medium"
            href="/#projects"
          >
            Projects
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.key}
              className="neu-raised neu-interactive flex h-11 w-11 items-center justify-center rounded-full text-secondary hover:text-primary transition-colors"
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

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-8 text-center md:text-left text-sm text-secondary">
        © 2026 {CONTACT.name}&nbsp;
      </div>
    </footer>
  );
}

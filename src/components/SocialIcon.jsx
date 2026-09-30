import GitHubIcon from "./GitHubIcon";

// Renders a social link's icon. Brand marks use the GitHub SVG; the rest use
// Material Symbols. Size comes from the surrounding layout, so `className` is
// only forwarded to the Material Symbols span.
export function SocialIcon({ link }) {
  if (link.icon === "github") {
    return <GitHubIcon className="h-5 w-5" />;
  }

  return <span className="material-symbols-outlined text-2xl">{link.icon}</span>;
}

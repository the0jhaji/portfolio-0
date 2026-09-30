/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Key `dark:` off our own attribute rather than prefers-color-scheme, so the
  // manual toggle and the OS preference stay in agreement. The default
  // (media-query based) would ignore the toggle entirely.
  darkMode: ["variant", '&[data-theme="dark"] &'],
  theme: {
    extend: {
      // Every colour resolves through a CSS variable declared in index.css, so
      // flipping `data-theme` on <html> re-themes the whole site at once.
      // The `rgb(var(--x) / <alpha-value>)` form is what lets Tailwind's own
      // opacity modifiers keep working — `bg-primary/10`, `text-primary/70`.
      colors: {
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-bright": "rgb(var(--primary-bright) / <alpha-value>)",
        "primary-soft": "rgb(var(--primary-soft) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        // Overlay helpers. These invert between themes: a white wash reads as
        // glare on a dark surface, so dark mode swaps them for black.
        hud: "rgb(var(--hud) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "1.5rem",
        "2xl": "1.75rem",
        full: "9999px",
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "container-max": "1200px",
        unit: "8px",
      },
      fontFamily: {
        "headline-lg-mobile": ["Geist"],
        display: ["Geist"],
        "label-mono": ["JetBrains Mono"],
        "body-lg": ["Geist"],
        "headline-lg": ["Geist"],
        caption: ["Geist"],
        "body-md": ["Geist"],
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-mono": ["14px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

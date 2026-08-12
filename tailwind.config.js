/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3525cd",
        secondary: "#5d5e5f",
        surface: "#e0e5ec",
        "on-surface": "#2d3748",
        "on-surface-variant": "#464555",
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
    },
  },
  plugins: [],
};

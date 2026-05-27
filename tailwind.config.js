/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        surface: "#0f0f0f",
        "surface-alt": "#1a1a1a",
        border: "#2a2a2a",
        accent: "#00d4ff",
        "accent-dim": "#007a99",
        primary: "#f5f5f5",
        secondary: "#9e9e9e",
        muted: "#555555",
      },
    },
  },
  plugins: [],
};

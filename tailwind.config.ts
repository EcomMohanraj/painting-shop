import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        navy: {
          50: "#f1f4f9",
          100: "#dfe6f1",
          200: "#bccbe2",
          600: "#2c4a7c",
          700: "#213a63",
          800: "#172a4a",
          900: "#0f1d35",
          950: "#0a1426",
        },
        charcoal: {
          500: "#5b6270",
          600: "#474d59",
          700: "#363b45",
          800: "#262a31",
        },
        gold: {
          50: "#fffaeb",
          100: "#fff1c6",
          200: "#ffe188",
          300: "#ffcd4a",
          400: "#f8b820",
          500: "#e89f0a",
          600: "#c77a05",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,29,53,0.04), 0 8px 24px -8px rgba(15,29,53,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

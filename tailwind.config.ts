import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
      // Fluid "gallery wall" headline sizes.
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.25rem, 4.6vw, 4.25rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.875rem, 3.2vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,29,53,0.04), 0 8px 24px -8px rgba(15,29,53,0.12)",
        lift: "0 2px 4px rgba(15,29,53,0.04), 0 24px 48px -20px rgba(15,29,53,0.22)",
        hero: "0 4px 8px rgba(15,29,53,0.05), 0 48px 96px -32px rgba(15,29,53,0.35)",
      },
      // Same curve as EASE in src/lib/motion.ts.
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [
    // `can-hover:` applies only on devices with a real hover (mouse/trackpad),
    // so hover-only reveals never hide content on touch screens.
    plugin(({ addVariant }) => {
      addVariant("can-hover", "@media (hover: hover) and (pointer: fine)");
    }),
  ],
};

export default config;

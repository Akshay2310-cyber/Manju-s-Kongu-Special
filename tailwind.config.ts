import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      colors: {
        // Warm & earthy palette for homemade / organic
        forest: {
          DEFAULT: "#2f5741",
          dark: "#22412f",
          light: "#3d6d53",
        },
        cream: "#f7f1e3",
        sand: "#efe6d3",
        turmeric: "#e0a53f",
        jaggery: "#8a5a2b",
        clay: "#b5451f",
        maroon: {
          DEFAULT: "#8a2b2b",
          dark: "#6f2020",
        },
        ink: "#2a241d",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(42,36,29,0.25)",
        card: "0 4px 20px -8px rgba(42,36,29,0.20)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pop: {
          "0%": { transform: "scale(0.9)" },
          "60%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.28s cubic-bezier(0.16,1,0.3,1)",
        "fade-in": "fade-in 0.2s ease-out",
        pop: "pop 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

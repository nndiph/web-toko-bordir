import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          DEFAULT: "#165028",
          dark: "#103B1E",
          hover: "#124522",
          light: "#EBF5EE",
          surface: "#F0FDF4",
          border: "#E2E8F0",
        },
        gold: {
          DEFAULT: "#C59B27",
          dark: "#A07C1C",
          light: "#FEF9C3",
          accent: "#D97706",
        },
        surface: {
          DEFAULT: "#F8FAFC", // Slate-50: ultra-clean neutral
          card: "#FFFFFF",
          muted: "#F1F5F9",
          border: "#E2E8F0",
        },
        ink: {
          DEFAULT: "#0F172A", // Slate-900: crisp, dark, professional
          body: "#334155",    // Slate-700: high legibility
          muted: "#64748B",   // Slate-500
          soft: "#94A3B8",    // Slate-400
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

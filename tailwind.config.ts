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
        // Brand Militer — tetap dipakai di halaman admin
        brand: {
          DEFAULT: "#14381B",
          dark: "#0D2612",
          hover: "#1B4D24",
          light: "#EAF2EA",
          border: "#E2E8F0",
        },
        // Alias admin
        army: {
          DEFAULT: "#14381B",
          dark: "#0D2612",
          hover: "#1B4D24",
        },
        surface: "#F8FAFC",
        accent: {
          gold: "#B45309",
          goldLight: "#FEF3C7",
          green: "#15803D",
          greenLight: "#DCFCE7",
          red: "#DC2626",
          redLight: "#FEE2E2",
        },
        slate: {
          canvas: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          ink: "#0F172A",
          muted: "#64748B",
          soft: "#94A3B8",
        },
        // ═══ Clean Retail Theme (Tokopedia/Uniqlo inspired, Zero AI-Slop) ═══
        vibrant: {
          DEFAULT: "#15803D",   // Hijau retail solid & tegas (Green-700)
          hover: "#166534",     // Green-800
          dark: "#14532D",      // Green-900
          light: "#DCFCE7",     // Green-100
          glow: "transparent",
        },
        dark: {
          bg: "#0F172A",        // Slate-900 solid
          surface: "#1E293B",   // Slate-800
          card: "#334155",      // Slate-700
          border: "#E2E8F0",    // Slate-200
          muted: "#64748B",     // Slate-500
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
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

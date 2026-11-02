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
        // Deep tactical military dark - arang kehijauan pekat & tegas
        tactical: {
          950: "#080E09", // Background paling pekat
          900: "#0D170E", // Background utama halaman
          850: "#132115", // Card background
          800: "#1A2C1D", // Elevated surface / Border
          700: "#263F2A", // Active / Highlight border
          600: "#385B3C", // Accent border
        },
        // Deep military forest green - wibawa, tegas, bersih
        army: {
          DEFAULT: "#1E3E20",
          dark: "#142B16",
          hover: "#254C28",
          light: "#EAF2EA",
          border: "#263F2A",
        },
        // Military brass / Bronze gold - tegas, maskulin, lencana
        gold: {
          DEFAULT: "#D97706",
          dark: "#B45309",
          light: "#FDE68A",
          muted: "#92400E",
        },
        // High contrast text
        ink: {
          DEFAULT: "#111827",
          muted: "#4B5563",
          soft: "#9CA3AF",
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

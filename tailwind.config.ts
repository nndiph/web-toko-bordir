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
        // Deep military forest green - wibawa, tegas, bersih
        army: {
          DEFAULT: "#1E3E20",
          dark: "#142B16",
          hover: "#18331A",
          light: "#EAF2EA",
          border: "#E5E7EB", // Neutral clean border (tidak kehijauan/keruh)
        },
        // Warm brass / bronze gold - tegas, tidak kusam
        gold: {
          DEFAULT: "#B45309",
          dark: "#92400E",
          light: "#FEF3C7",
        },
        // Neutral canvas - bersih, ramah mata, standar e-commerce
        surface: {
          DEFAULT: "#F9FAFB", // Gray-50 bersih
          card: "#FFFFFF",
          muted: "#F3F4F6",   // Gray-100
        },
        // High contrast text - hitam arang tajam, bukan hijau gelap
        ink: {
          DEFAULT: "#111827", // Gray-900: tegas, mudah dibaca
          muted: "#4B5563",   // Gray-600: kontras jelas
          soft: "#9CA3AF",    // Gray-400
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

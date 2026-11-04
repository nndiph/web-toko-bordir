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
        // ═══ TechNest Dark-Theme + Vibrant Green ═══
        vibrant: {
          DEFAULT: "#22C55E",   // Hijau neon segar
          hover: "#16A34A",
          dark: "#15803D",
          light: "#DCFCE7",
          glow: "rgba(34,197,94,0.15)",
        },
        dark: {
          bg: "#0B0F12",        // Hitam pekat modern
          surface: "#121820",   // Panel gelap
          card: "#161E27",      // Kartu gelap
          border: "#1E293B",    // Garis pemisah gelap
          muted: "#94A3B8",     // Teks sekunder abu terang
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

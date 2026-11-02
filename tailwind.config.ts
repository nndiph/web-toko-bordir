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
        // Clean Retail E-Commerce Palette (Inspirasi Tokopedia & Uniqlo)
        brand: {
          DEFAULT: "#14381B",    // Hijau militer wibawa
          dark: "#0D2612",
          hover: "#1B4D24",
          light: "#EAF2EA",
          border: "#E2E8F0",
        },
        // Alias admin (dipakai di komponen admin/) — mengarah ke brand yang sama
        army: {
          DEFAULT: "#14381B",
          dark: "#0D2612",
          hover: "#1B4D24",
        },
        // Background surface untuk admin pages
        surface: "#F8FAFC",
        accent: {
          gold: "#B45309",       // Kuningan lencana dinas
          goldLight: "#FEF3C7",
          green: "#15803D",      // Hijau status stok aman
          greenLight: "#DCFCE7",
          red: "#DC2626",        // Merah status stok habis
          redLight: "#FEE2E2",
        },
        slate: {
          canvas: "#F8FAFC",     // Background utama bersih
          card: "#FFFFFF",       // Kartu produk & panel
          border: "#E2E8F0",     // Border halus standar retail
          ink: "#0F172A",        // Teks utama hitam pekat kontras tinggi
          muted: "#64748B",      // Teks pendukung abu-abu sejuk
          soft: "#94A3B8",
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

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
        // Technical Console Theme Palette (Non-AI Slop, Autentik Militer)
        console: {
          ground: "#0A0F0B",       // Canvas dasar matte
          surface: "#111812",      // Surface kerja utama
          elevated: "#18241A",     // Surface baris/tabel
          rule: "#233626",         // Border hairline tipis tenang
          ruleFocus: "#C2850A",    // Hairline fokus
          gold: "#D97706",         // Kuningan lencana militer
          goldDark: "#92400E",
          green: "#22C55E",        // Signal status live
          red: "#EF4444",          // Signal habis
          textPrimary: "#F0F4F1",  // Teks terbaca jelas
          textSecondary: "#8A9E8D",// Teks pendukung
          textMuted: "#526354",    // Label mono teknikal
        },
      },
      fontFamily: {
        heading: ["Rajdhani", "sans-serif"],
        body: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

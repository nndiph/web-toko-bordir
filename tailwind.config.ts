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
          DEFAULT: "#2D5A27",
          dark: "#1E3D1A",
          light: "#E8F5E9",
          border: "#D0D7CF",
        },
        gold: {
          DEFAULT: "#C5A059",
          dark: "#A58039",
          light: "#FFF3E0",
        },
        surface: {
          DEFAULT: "#F7F9F6",
          card: "#FFFFFF",
          muted: "#F0F4EF",
        },
        ink: {
          DEFAULT: "#1C241B",
          muted: "#5D6B5C",
          soft: "#8C998B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;


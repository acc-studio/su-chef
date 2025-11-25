import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Covers all bases
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-dm-serif)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        paper: "#F4F1EA",
        ink: "#1A1A1A",
        accent: "#D9381E",
        kale: "#4A5D23",
      },
      boxShadow: {
        'hard': '8px 8px 0px 0px #1A1A1A',
        'hard-sm': '4px 4px 0px 0px #1A1A1A',
      }
    },
  },
  plugins: [],
};
export default config;
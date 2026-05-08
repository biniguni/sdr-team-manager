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
        "bg-primary": "#0b1120",
        "bg-secondary": "#111827",
        "accent-blue": "#38bdf8",
        "accent-purple": "#a78bfa",
        "accent-green": "#34d399",
        "accent-yellow": "#fbbf24",
        "accent-red": "#f87171",
        "accent-orange": "#fb923c",
      },
    },
  },
  plugins: [],
};

export default config;

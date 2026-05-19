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
        verde: {
          50:  "#e8f5ee",
          100: "#c8e6d5",
          500: "#2d9e5f",
          600: "#1a6b3c",
          700: "#145530",
          900: "#0d3b21",
        },
        dorado: {
          100: "#f5dba8",
          400: "#e0a83c",
          500: "#c8943a",
          600: "#a87530",
        },
        crema: "#faf7f2",
        cafe:  "#3d2b1f",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body:    ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0D1B2E",
          dark: "#060B2E",
        },
        brand: {
          gradient: {
            start: "#4831B0",
            end: "#2EE5F2",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
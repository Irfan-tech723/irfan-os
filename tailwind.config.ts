import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#050505",
        charcoal: "#0d0d0d",
        graphite: "#161616",
        gunmetal: "#242424",
        titanium: "#5a5a5a",
        offwhite: "#eef0ef",
        blue: "#3f7fff",
        amber: "#ffb020",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;

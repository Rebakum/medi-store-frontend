/** @type {import {  } from "module";('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      bg: "rgb(var(--bg) / <alpha-value>)",
      text: "rgb(var(--text) / <alpha-value>)",
      muted: "rgb(var(--muted) / <alpha-value>)",

      primary: "rgb(var(--primary) / <alpha-value>)",
      primary2: "rgb(var(--primary-2) / <alpha-value>)",
      primary3: "rgb(var(--primary-3) / <alpha-value>)",

      soft: "rgb(var(--soft) / <alpha-value>)",
      soft2: "rgb(var(--soft-2) / <alpha-value>)",

      border: "rgb(var(--border) / <alpha-value>)",
      footer: "rgb(var(--footer) / <alpha-value>)",
    },
  },
},

  plugins: [],
};

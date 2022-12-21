/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        start: "#4ee66c",
        end: "#e64e4e",
        wall: "#363029",
        visited: "#4e4ee6",
        path: "#e6e64e",
        default: "#ffffff",
        black: "#000000",
        hover: "#1e243d",
      },
    },
  },
  variants: {},
  plugins: [],
};
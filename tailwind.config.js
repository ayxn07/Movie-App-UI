/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        "primary-dark": "#6366f1",
        secondary: "#ec4899",
        accent: "#f59e0b",
      },
    },
  },
  plugins: [],
}
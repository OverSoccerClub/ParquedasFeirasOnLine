/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B1F3B",
          50: "#E8E9F0",
          100: "#C5C7DC",
          200: "#9EA2C3",
          300: "#777CAA",
          400: "#575C96",
          500: "#1B1F3B",
          600: "#181C35",
          700: "#13162B",
          800: "#0E1022",
          900: "#080A15",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF6B35",
          50: "#FFF0EB",
          100: "#FFD9CC",
          200: "#FFB899",
          300: "#FF9766",
          400: "#FF7D47",
          500: "#FF6B35",
          600: "#E55A26",
          700: "#CC4A18",
          800: "#B23B0C",
          900: "#992D00",
          foreground: "#FFFFFF",
        },
        background: "#F8F9FA",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
}

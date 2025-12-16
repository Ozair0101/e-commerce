/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#232F3E',
        secondary: '#ff9900',
        'background-dark': '#1a1a1a',
        'surface-dark': '#2d2d2d',
        'border-dark': '#404040',
        'text-secondary': '#9ca3af',
      }
    },
  },
  plugins: [],
}
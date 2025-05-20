/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        success: {
          600: '#4CAF50',
        },
        error: {
          600: '#F44336',
        },
      },
    },
  },
  plugins: [],
}

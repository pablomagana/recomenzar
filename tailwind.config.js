/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'brown': '#4A3728',
          'green': '#2E7D32',
          'green-light': '#E8F5E9',
          'orange': '#F9A825',
          'gray-dark': '#424242',
          'gray-light': '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
}

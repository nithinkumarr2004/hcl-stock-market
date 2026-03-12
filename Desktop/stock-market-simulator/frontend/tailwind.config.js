/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#121212',
          card: '#1e1e1e',
          border: '#333333',
          hover: '#2a2a2a'
        },
        primary: {
          DEFAULT: '#00d09c',
          hover: '#00b085'
        },
        secondary: {
          DEFAULT: '#eb5b3c',
          hover: '#d44a2d'
        }
      },
    },
  },
  plugins: [],
}

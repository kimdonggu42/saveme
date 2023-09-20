/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        shake: 'shake 1.5s infinite'
      },
      keyframes: {
        shake: {
          '0%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-10deg)' },
          '100%': { transform: 'rotate(10deg)' },
        }
      },
    },
  },
  plugins: [],
}



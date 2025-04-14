/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
    fontFamily: {
            gothic: ['"Style Script"', 'cursive'],
          },
    },
  },
  plugins: [],
}


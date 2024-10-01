/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        futura: ['Futura', 'sans-serif'], // Add Futura font
      },
    },
  },
  plugins: [require("daisyui")],
  
  daisyui: {
    themes: false,
  },
}

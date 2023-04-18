/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      ipad4: '800px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '2040px',
    },
    extend: {
      colors: {
        primary: '#003300',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
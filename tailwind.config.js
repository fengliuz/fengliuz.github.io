/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:'class',
  theme: {
    container:{
      center:true,
      padding:'16px',
    },
    extend: {
      colors:{
        primary:'#1d4ed8',
        secondary:'#4338ca',
        tripery:'#64748b',
        dark:'#0f172a'
      },
    },
  },
  plugins: [],
}


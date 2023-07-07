/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "2xl": { max: "1536px" },
      xl: { max: "1280px" },
      lg: { max: "1024px" },
      md: { max: "868px" },
      sm: { max: "640px" },
      xs: { max: "475px" },
    },
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Body font
        title: ["League Spartan", "sans-serif"], // Title font
        abril: ["Abril Fatface", "cursive"],
        robotoSlab: ['Roboto Slab', 'serif'],
        lato: ['Lato', 'sans-serif'],
        arimo: ['Arimo', 'sans-serif'],
        merriWeather: ['Merriweather', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
        nanum: ['Nanum Myeongjo', 'serif']
      },
      colors: {
        black: "#222222",
        gray: "#EFEFF0",
        darkGray: "#BEBEBE",
        textGray: "#393939",
        darkerGray: "#0C0C0C",
        lightGray: "#E7E7E7",
        lighterGray: "#EFEFEF",
        lightText: "#4F4F4F",
        darkBlue: "#126EB8",
        lightBlue: "#76ABD6",
        orange: "#C8292B",
        darkOrange: "#A12224",
        lightOrange: "#FAEAEA",
        aliceBlue: "#E7F1F8",
      },
      borderRadius: {
        "4xl": "40px",
        large: "48px",
      },
    },
  },
  variants: {
    extend: {
      lineClamp: ["hover"],
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

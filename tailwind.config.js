/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.njk",
    "./src/**/*.{js,ts}",
    "./public/**/*.{js,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Century Gothic", "CenturyGothic", "AppleGothic", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#24357a",
          secondary: "#7bc74d",
          accent: "#91da71",
          neutral: "#01002d",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-300": "#5066b0",
          info: "#00bafe",
          success: "#00d390",
          warning: "#ffa969",
          error: "#ff6755",
        },
      },
      {
        dark: {
          primary: "#61a83f",
          secondary: "#24357A",
          accent: "#91da71",
          neutral: "#01002d",
          "base-100": "#1a273a",
          "base-200": "#2e4062",
          "base-300": "#61a83f",
          info: "#00bafe",
          success: "#00d390",
          warning: "#ffa969",
          error: "#ff6755",
        },
      },
    ],
    darkTheme: "dark",
    styled: true,
    base: true,
    utils: true,
    logs: false,
  },
};

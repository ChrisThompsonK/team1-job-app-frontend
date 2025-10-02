/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.njk",
    "./src/**/*.{js,ts}",
    "./public/**/*.{js,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
    darkTheme: false,
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};

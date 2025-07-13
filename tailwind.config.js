/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "rgb(0, 87, 138)",
        "primary-red": "rgb(227, 61, 48)",
      },
    },
  },
  plugins: [],
};

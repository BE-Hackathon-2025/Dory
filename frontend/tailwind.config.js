/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // optional if you keep JSX there
  ],
  theme: {
    extend: {
      colors: {
        doryblue: "#69AAFD",
      },
    },
  },
  plugins: [],
};

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "accent-1": "#333",
      },
      inset: {
        "-20": "-8.75rem",
        "-10": "-1.75rem",
      },
      opacity: {
        95: ".95",
      },
    },
  },
  variants: {},
  plugins: [],
};

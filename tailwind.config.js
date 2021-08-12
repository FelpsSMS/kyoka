var flattenColorPalette =
  require("tailwindcss/lib/util/flattenColorPalette").default;

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: "372px",
        ms: "440px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    ({ addUtilities, e, theme, variants }) => {
      const colors = flattenColorPalette(theme("borderColor"));
      delete colors["default"];

      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-${color}`]: { borderTopColor: colors[color] },
        [`.border-r-${color}`]: { borderRightColor: colors[color] },
        [`.border-b-${color}`]: { borderBottomColor: colors[color] },
        [`.border-l-${color}`]: { borderLeftColor: colors[color] },
      }));
      const utilities = Object.assign({}, ...colorMap);

      addUtilities(utilities, variants("borderColor"));
    },
  ],
};

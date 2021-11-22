const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt", "ja"],
    localePath: path.resolve("./public/static/locales"),
  },
  react: { useSuspense: false }, //needed for some reason
};

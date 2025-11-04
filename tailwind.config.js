const { colors } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./**/*.html", "./assets/**/*.js"],
  theme: {
    extend: {
      colors: {
        blue: {
          300: "#bfdbfe",
          600: "#8fbdd3",
          900: "#2c2e83",
        },
        brown: {
          300: "#e4d1b9",
          600: "#A0522D",
          900: "#8B4513",
          950: "#5c3d2e",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const colors = theme("colors");
      const newUtilities = {};

      // generowanie klas text-border-[color]
      function generate(colorGroup, prefix = "") {
        for (const [key, value] of Object.entries(colorGroup)) {
          if (typeof value === "string") {
            newUtilities[`.tb-${prefix}${key}`] = {
              "--tb-color": value,
            };
          } else {
            generate(value, `${prefix}${key}-`);
          }
        }
      }

      generate(colors);

      addUtilities(newUtilities, ["responsive"]);
    }),
    require("tailwind-scrollbar"),
  ],
};

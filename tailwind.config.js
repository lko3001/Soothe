function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(--${variableName}), ${opacityValue})`;
    }
    return `rgba(var(--${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /hljs+/,
    },
  ],
  theme: {
    hljs: {
      theme: "atom-one-dark",
    },
    extend: {
      fontFamily: {
        hanken_grotesk: "var(--hanken_grotesk)",
        roboto_mono: "var(--roboto_mono)",
      },
      colors: {
        r: {
          // LIGHT MODE
          white: withOpacity("white"),
          black: withOpacity("black"),
          lightGray: withOpacity("lightGray"),
          accentWarm: withOpacity("accentWarm"),
          warmHover: withOpacity("warmHover"),
          accentCold: withOpacity("accentCold"),
          coldHover: withOpacity("coldHover"),
          grayHover: withOpacity("grayHover"),
          gray: withOpacity("gray"),
          // DARK MODE
          darkWhite: withOpacity("darkWhite"),
          darkBlack: withOpacity("darkBlack"),
          darkLightGray: withOpacity("darkLightGray"),
          darkGrayHover: withOpacity("darkGrayHover"),
          darkGray: withOpacity("darkGray"),
          darkAccentWarm: withOpacity("darkAccentWarm"),
          darkWarmHover: withOpacity("darkWarmHover"),
          darkAccentCold: withOpacity("darkAccentCold"),
          darkColdHover: withOpacity("darkColdHover"),
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    require("tailwind-highlightjs"),
  ],
};

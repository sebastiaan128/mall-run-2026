import colors from './src/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Achterwaartse compatibiliteit voor oude klassenamen
        surface: colors.base,
        rule: colors.line,
        deep: colors.ink,
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        // Achterwaartse compatibiliteit
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      maxWidth: {
        prose: '58ch',
      },
    },
  },
  plugins: [],
};

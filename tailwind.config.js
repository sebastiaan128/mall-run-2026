import colors from './src/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        wordmark: ['"Archivo Black"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '58ch',
      },
    },
  },
  plugins: [],
};

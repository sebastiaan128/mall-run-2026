/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        surface: '#F5F4F2',
        rule: '#E3E1DD',
        muted: '#6B665F',
        body: '#423E3A',
        ink: '#000000',
        deep: '#1E1C1A',
        // Route-verf-oranje: de kleur van een uitgezet parcours. Alleen voor
        // wat beweegt (voortgang), wat je meeneemt (primaire knop) en de
        // markeringen in de marge. Wit op accent haalt 4.5:1.
        accent: '#D93E11',
        accentDeep: '#B32F08',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '62ch',
      },
    },
  },
  plugins: [],
};

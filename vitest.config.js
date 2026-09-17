import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// De React-plugin is nodig zodat JSX (zoals in YfcLogo.jsx) ook in tests
// correct wordt getransformeerd — zonder deze plugin gebruikt esbuild de
// klassieke JSX-transform, die `React` in scope verwacht.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});

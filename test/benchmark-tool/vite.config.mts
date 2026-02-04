import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProduction = process.env.NODE_ENV === 'production';

const profiling = isProduction && {
  'react-dom/client': 'react-dom/profiling',
};

export default defineConfig({
  plugins: [react()],
  esbuild: {
    minifyIdentifiers: false,
  },
  build: { sourcemap: 'inline' },
  resolve: {
    alias: {
      ...profiling,
    },
  },
});

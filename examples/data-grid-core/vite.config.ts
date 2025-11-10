import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/x-data-grid-core': path.resolve(__dirname, '../../packages/x-data-grid-core/src'),
      '@mui/x-data-grid-core-pro': path.resolve(
        __dirname,
        '../../packages/x-data-grid-core-pro/src',
      ),
      '@mui/x-data-grid-core-premium': path.resolve(
        __dirname,
        '../../packages/x-data-grid-core-premium/src',
      ),
    },
  },
  server: {
    port: 3003,
  },
});

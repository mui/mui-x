import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/x-data-grid-headless': path.resolve(
        __dirname,
        '../../packages/x-data-grid-headless/src',
      ),
      '@mui/x-data-grid-headless-pro': path.resolve(
        __dirname,
        '../../packages/x-data-grid-headless-pro/src',
      ),
      '@mui/x-data-grid-headless-premium': path.resolve(
        __dirname,
        '../../packages/x-data-grid-headless-premium/src',
      ),
      '@mui/x-virtualizer': path.resolve(__dirname, '../../packages/x-virtualizer/src'),
    },
  },
  server: {
    port: 3003,
  },
});

import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import * as url from 'url';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));
const WORKSPACE_ROOT = path.resolve(currentDirectory, '../../');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      // Unfortunately necessary as we opted to write our jsx in js files
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (/\/node_modules\//.test(id)) {
          return null;
        }
        if (!/.*\.js$/.test(id)) {
          return null;
        }
        if (id.startsWith('\0')) {
          return null;
        }
        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'tsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
  ],
  define: {
    'process.env': '{}',
    DISABLE_CHANCE_RANDOM: JSON.stringify(true),
  },
  resolve: {
    alias: {
      '@mui/x-data-grid': path.resolve(WORKSPACE_ROOT, './packages/x-data-grid/src'),
      '@mui/x-data-grid-generator': path.resolve(
        WORKSPACE_ROOT,
        './packages/x-data-grid-generator/src',
      ),
      '@mui/x-data-grid-pro': path.resolve(WORKSPACE_ROOT, './packages/x-data-grid-pro/src'),
      '@mui/x-data-grid-premium': path.resolve(
        WORKSPACE_ROOT,
        './packages/x-data-grid-premium/src',
      ),
      '@mui/x-date-pickers': path.resolve(WORKSPACE_ROOT, './packages/x-date-pickers/src'),
      '@mui/x-date-pickers-pro': path.resolve(WORKSPACE_ROOT, './packages/x-date-pickers-pro/src'),
      '@mui/x-charts': path.resolve(WORKSPACE_ROOT, './packages/x-charts/src'),
      '@mui/x-charts-pro': path.resolve(WORKSPACE_ROOT, './packages/x-charts-pro/src'),
      '@mui/x-charts-vendor': path.resolve(WORKSPACE_ROOT, './packages/x-charts-vendor/es'),
      '@mui/x-tree-view': path.resolve(WORKSPACE_ROOT, './packages/x-tree-view/src'),
      '@mui/x-tree-view-pro': path.resolve(WORKSPACE_ROOT, './packages/x-tree-view-pro/src'),
      '@mui/x-license': path.resolve(WORKSPACE_ROOT, './packages/x-license/src'),
      '@mui/x-telemetry': path.resolve(WORKSPACE_ROOT, './packages/x-telemetry/src'),
      '@mui/x-internals': path.resolve(WORKSPACE_ROOT, './packages/x-internals/src'),
      '@mui/material-nextjs': path.resolve(
        WORKSPACE_ROOT,
        './node_modules/@mui/monorepo/packages/mui-material-nextjs/src',
      ),
      docs: path.resolve(WORKSPACE_ROOT, './node_modules/@mui/monorepo/docs'),
      docsx: path.resolve(WORKSPACE_ROOT, './docs'),
    },
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'tsx',
      },
    },
  },
  worker: {
    // needed for build
    format: 'es',
  },
});

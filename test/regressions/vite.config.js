import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  optimizeDeps: {
    include: ['prismjs', 'clipboard-copy'],
  },
  build: {
    outDir: 'build',
  },
  loader: {
    '.js': 'jsx',
  },
  resolve: {
    alias: {
      '@mui/docs': path.resolve(
        import.meta.dirname,
        '../../node_modules/@mui/monorepo/packages/mui-docs/src',
      ),
      '@mui/x-data-grid': path.resolve(import.meta.dirname, '../../packages/x-data-grid/src'),
      '@mui/x-data-grid-generator': path.resolve(
        import.meta.dirname,
        '../../packages/x-data-grid-generator/src',
      ),
      '@mui/x-data-grid-pro': path.resolve(
        import.meta.dirname,
        '../../packages/x-data-grid-pro/src',
      ),
      '@mui/x-data-grid-premium': path.resolve(
        import.meta.dirname,
        '../../packages/x-data-grid-premium/src',
      ),
      '@mui/x-date-pickers': path.resolve(import.meta.dirname, '../../packages/x-date-pickers/src'),
      '@mui/x-date-pickers-pro': path.resolve(
        import.meta.dirname,
        '../../packages/x-date-pickers-pro/src',
      ),
      '@mui/x-charts': path.resolve(import.meta.dirname, '../../packages/x-charts/src'),
      '@mui/x-charts-pro': path.resolve(import.meta.dirname, '../../packages/x-charts-pro/src'),
      '@mui/x-tree-view': path.resolve(import.meta.dirname, '../../packages/x-tree-view/src'),
      '@mui/x-tree-view-pro': path.resolve(
        import.meta.dirname,
        '../../packages/x-tree-view-pro/src',
      ),
      '@mui/x-license': path.resolve(import.meta.dirname, '../../packages/x-license/src'),
      '@mui/x-telemetry': path.resolve(import.meta.dirname, '../../packages/x-telemetry/src'),
      '@mui/x-internals': path.resolve(import.meta.dirname, '../../packages/x-internals/src'),
      '@mui/material-nextjs': path.resolve(
        import.meta.dirname,
        '../../node_modules/@mui/monorepo/packages/mui-material-nextjs/src',
      ),
      docs: path.resolve(import.meta.dirname, '../../node_modules/@mui/monorepo/docs'),
      docsx: path.resolve(import.meta.dirname, '../../docs'),
    },
  },
  worker: {
    format: 'es',
  },
  plugins: [
    react(),
    {
      name: 'replace-code',
      enforce: 'post',
      async transform(code) {
        return code
          .replaceAll('DISABLE_CHANCE_RANDOM', 'true')
          .replaceAll('LICENSE_DISABLE_CHECK', 'true');
      },
    },
    {
      name: 'js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.match(/.*\.js$/)) {
          return null;
        }
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
  ],
});

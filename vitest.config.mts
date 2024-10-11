import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@mui/x-charts',
        replacement: new URL('./packages/x-charts/src', import.meta.url).pathname,
      },
      {
        find: '@mui/x-charts-pro',
        replacement: new URL('./packages/x-charts-pro/src', import.meta.url).pathname,
      },
      {
        find: '@mui/x-date-pickers',
        replacement: new URL('./packages/x-date-pickers/src', import.meta.url).pathname,
      },
      {
        find: '@mui/x-date-pickers-pro',
        replacement: new URL('./packages/x-date-pickers-pro/src', import.meta.url).pathname,
      },
      {
        find: 'test/utils',
        replacement: new URL('./test/utils', import.meta.url).pathname,
      },
      {
        find: '@mui/x-internals',
        replacement: new URL('./packages/x-internals/src', import.meta.url).pathname,
      },
      {
        find: '@mui/x-license',
        replacement: new URL('./packages/x-license/src', import.meta.url).pathname,
      },
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale',
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['test/setup.ts'],
    // Required for some datepickers tests that contain early returns.
    passWithNoTests: true,
    sequence: {
      hooks: 'list',
    },
    env: {
      MUI_VITEST: 'true',
    },
  },
});

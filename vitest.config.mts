import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@mui/x-charts',
        replacement: new URL('./packages/x-charts/src', import.meta.url).pathname,
      },
      {
        find: '@mui/x-date-pickers',
        replacement: new URL('./packages/x-date-pickers/src', import.meta.url).pathname,
      },
      {
        find: 'test/utils',
        replacement: new URL('./test/utils', import.meta.url).pathname,
      },
      {
        find: '@mui/x-internals',
        replacement: new URL('./packages/x-internals/src', import.meta.url).pathname,
      },
      // Use built in replacements for date-fns and date-fns-jalali
      {
        find: 'date-fns',
        replacement: 'date-fns-v3',
        customResolver(source, importer) {
          if (importer?.includes('src/AdapterDateFnsV3')) {
            return source;
          }
          return null;
        },
      },
      {
        find: 'date-fns-jalali',
        replacement: 'date-fns-jalali-v3',
        customResolver(source, importer) {
          if (importer?.includes('src/AdapterDateFnsJalaliV3')) {
            return source;
          }
          return null;
        },
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
    env: {
      MUI_VITEST: 'true',
    },
  },
});

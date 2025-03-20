import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(CURRENT_DIR, './');

export default defineConfig({
  test: {
    workspace: [
      'packages/*/vitest.config.{jsdom,browser}.mts',
      'docs/vitest.config.{jsdom,browser}.mts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: resolve(WORKSPACE_ROOT, 'coverage'),
      include: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
      exclude: ['**/*.{test,spec}.{js,ts,tsx}', '**/*.test/*'],
    },
  },
});

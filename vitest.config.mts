import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(CURRENT_DIR, './');

const isJSDOM = process.env.JSDOM === 'true';
const isBrowser = process.env.BROWSER === 'true';

// Checking the environment variables simplifies the scripts in the package.json
const getWorkspaces = () => {
  const workspaces = (fill: string) => [
    `packages/*/vitest.config.${fill}.mts`,
    `docs/vitest.config.${fill}.mts`,
  ];

  if (isJSDOM) {
    return workspaces('jsdom');
  }
  if (isBrowser) {
    return workspaces('browser');
  }
  return workspaces('{jsdom,browser}');
};

export default defineConfig({
  test: {
    workspace: getWorkspaces(),
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['lcovonly'] : ['text'],
      reportsDirectory: resolve(WORKSPACE_ROOT, 'coverage'),
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: ['**/*.{test,spec}.{js,ts,tsx}'],
    },
  },
});

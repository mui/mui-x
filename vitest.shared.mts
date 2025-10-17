import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { getTestName } from './scripts/getTestName.mts';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(CURRENT_DIR, './');

export interface XDefaultConfiguratorOptions {
  /**
   * The import.meta.url of the calling file
   * Used to determine the test name from package.json
   */
  url: string;
  /**
   * Optional setup files to be loaded before tests
   */
  setupFiles?: string[];
  /**
   * Optional additional config to merge
   */
  config?: Record<string, any>;
  /**
   * Browser-specific options
   */
  browserOptions?: {
    /**
     * Whether to enable isolation for browser tests
     * @default false (inherited from shared config)
     */
    isolate?: boolean;
    /**
     * Whether to ignore default args for scrollbars (required for data-grid)
     * @default false
     */
    ignoreScrollbars?: boolean;
  };
}

export const alias = [
  // Generates resolver aliases for all packages and their plans.
  ...[
    { lib: 'x-charts', plans: ['pro', 'premium'] },
    { lib: 'x-date-pickers', plans: ['pro'] },
    { lib: 'x-tree-view', plans: ['pro'] },
    { lib: 'x-data-grid', plans: ['pro', 'premium', 'generator'] },
    { lib: 'x-scheduler' },
    { lib: 'x-scheduler-headless' },
    { lib: 'x-internals' },
    { lib: 'x-internal-gestures' },
    { lib: 'x-license' },
    { lib: 'x-telemetry' },
    { lib: 'x-virtualizer' },
  ].flatMap((v) => {
    return [
      {
        find: `@mui/${v.lib}`,
        replacement: resolve(WORKSPACE_ROOT, `./packages/${v.lib}/src`),
      },
      ...(v.plans ?? []).map((plan) => ({
        find: `@mui/${v.lib}-${plan}`,
        replacement: resolve(WORKSPACE_ROOT, `./packages/${v.lib}-${plan}/src`),
      })),
    ];
  }),
  {
    find: 'test/utils',
    replacement: fileURLToPath(new URL('./test/utils', import.meta.url)),
  },
];

const sharedConfig = defineConfig({
  // If enabling babel plugins, ensure the tests in CI are stable
  // https://github.com/mui/mui-x/pull/18341
  plugins: [react()],
  // We seem to need both this and the `env` property below to make it work.
  define: {
    'process.env.NODE_ENV': '"test"',
    LICENSE_DISABLE_CHECK: 'false',
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  resolve: {
    alias,
  },
  test: {
    globals: true,
    setupFiles: [fileURLToPath(new URL('test/setupVitest.ts', import.meta.url))],
    // Required for some tests that contain early returns or conditional tests.
    passWithNoTests: true,
    env: {
      NODE_ENV: 'test',
    },
    browser: {
      isolate: false,
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      orchestratorScripts: [
        {
          id: 'vitest-reload-on-error',
          content: `window.addEventListener('vite:preloadError', (event) => { window.location.reload(); });`,
          async: true,
        },
      ],
    },
    // Disable isolation to speed up the tests.
    isolate: false,
    // Performance improvements for the tests.
    // https://vitest.dev/guide/improving-performance.html#improving-performance
    ...(process.env.CI && {
      // Important to avoid timeouts on CI.
      fileParallelism: false,
      // Increase the timeout for the tests due to slow CI machines.
      testTimeout: 30000,
      // Retry failed tests up to 3 times. This is useful for flaky tests.
      retry: 3,
      // Reduce the number of workers to avoid CI timeouts.
      poolOptions: {
        forks: {
          singleFork: true,
        },
        threads: {
          singleThread: true,
        },
      },
    }),
    exclude: ['**/*.spec.{js,ts,tsx}', '**/node_modules/**', '**/dist/**'],
  },
});

/**
 * Creates a vitest configuration for a specific environment (browser, jsdom, or node)
 * This centralizes common configuration patterns across all packages
 *
 * @param mode - The test environment mode: 'browser', 'jsdom', or 'node'
 * @param options - Configuration options
 * @returns Vitest configuration
 *
 * @example
 * // packages/x-charts/vitest.config.browser.mts
 * export default xVitestConfig('browser', { url: import.meta.url });
 *
 * @example
 * // packages/x-charts/vitest.config.jsdom.mts
 * export default xVitestConfig('jsdom', { url: import.meta.url });
 *
 * @example
 * // packages/eslint-plugin-mui-x/vitest.config.node.mts
 * export default xVitestConfig('node', { url: import.meta.url });
 */
export function xVitestConfig(
  mode: 'browser' | 'jsdom' | 'node',
  options: XDefaultConfiguratorOptions,
) {
  const { url, setupFiles, config: additionalConfig, browserOptions } = options;

  const testName = getTestName(url);

  if (mode === 'node') {
    // Node tests don't use the shared config
    return defineConfig(
      mergeConfig(
        {
          test: {
            name: testName,
            environment: 'node',
            ...(setupFiles && { setupFiles }),
          },
        },
        additionalConfig ?? {},
      ),
    );
  }

  const projectConfig = {
    test: {
      name: testName,
      ...(setupFiles && { setupFiles }),
      ...(mode === 'jsdom' && {
        environment: 'jsdom',
      }),
      ...(mode === 'browser' && {
        browser: {
          enabled: true,
          ...(browserOptions?.isolate !== undefined && { isolate: browserOptions.isolate }),
          instances: [
            {
              browser: 'chromium',
              ...(process.env.PLAYWRIGHT_SERVER_WS
                ? {
                    connect: {
                      wsEndpoint: process.env.PLAYWRIGHT_SERVER_WS,
                    },
                  }
                : {
                    ...(browserOptions?.ignoreScrollbars && {
                      launch: {
                        // Required for tests which use scrollbars.
                        ignoreDefaultArgs: ['--hide-scrollbars'],
                      },
                    }),
                  }),
            },
          ],
        },
      }),
    },
  };

  const finalConfig = mergeConfig(projectConfig, additionalConfig ?? {});

  return mergeConfig(sharedConfig, finalConfig);
}

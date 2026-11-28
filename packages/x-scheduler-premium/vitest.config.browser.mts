import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      // Keep animation frames native so observer-driven layout settles while the clock is frozen.
      // A list and not `toNotFake`: fake-timers rejects both, and tests can pass their own `toFake`.
      fakeTimers: {
        toFake: [
          'Date',
          'Intl',
          'performance',
          'setTimeout',
          'clearTimeout',
          'setInterval',
          'clearInterval',
        ],
      },
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);

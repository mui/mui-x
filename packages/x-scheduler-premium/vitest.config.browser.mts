import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      // Keep animation frames native so observer-driven layout settles while the clock is frozen.
      fakeTimers: { toNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] },
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);

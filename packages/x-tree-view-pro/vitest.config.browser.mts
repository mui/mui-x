import { mergeConfig, defineProject } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import packageJson from './package.json';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: `browser/${packageJson.name.split('/')[1]}`,
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
        screenshotFailures: false,
      },
    },
  }),
);

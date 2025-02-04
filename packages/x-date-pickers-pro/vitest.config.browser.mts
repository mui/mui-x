/// <reference types="@vitest/browser/providers/playwright" />
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import packageJson from './package.json';

export default mergeConfig(sharedConfig, {
  test: {
    name: `browser/${packageJson.name.split('/')[1]}`,
    environment: 'browser',
    browser: {
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});

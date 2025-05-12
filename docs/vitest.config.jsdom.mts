import { mergeConfig, defineProject } from 'vitest/config';
import sharedConfig from '../vitest.shared.mts';
import { getTestName } from '../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: getTestName(import.meta.url),
      environment: 'jsdom',
    },
  }),
);

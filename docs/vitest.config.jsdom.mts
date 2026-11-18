import { mergeConfig, defineProject } from 'vitest/config';
import sharedConfig, { REACT_MAJOR } from '../vitest.shared.mts';
import { getTestName } from '../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: getTestName(import.meta.url),
      environment: 'jsdom',
      // The docs need React 18+ and do not ship, so the React 17 jobs skip their tests.
      exclude: REACT_MAJOR < 18 ? ['**'] : [],
    },
  }),
);

import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(sharedConfig, {
  test: {
    name: getTestName(import.meta.url),
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('../../test/utils/setupPickers.js', import.meta.url))],
  },
});

import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(sharedConfig, {
  test: {
    name: getTestName(import.meta.url),
    setupFiles: [fileURLToPath(new URL('../../test/utils/setupDataGrid.ts', import.meta.url))],
    environment: 'jsdom',
  },
});

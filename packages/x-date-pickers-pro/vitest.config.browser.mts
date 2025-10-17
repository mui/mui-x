/// <reference types="@vitest/browser/providers/playwright" />
import { fileURLToPath } from 'node:url';
import { xVitestConfig } from '../../vitest.shared.mts';

export default xVitestConfig('browser', {
  url: import.meta.url,
  setupFiles: [fileURLToPath(new URL('../../test/utils/setupPickers.js', import.meta.url))],
});

import { fileURLToPath } from 'node:url';
import { xVitestConfig } from '../../vitest.shared.mts';

export default xVitestConfig('browser', {
  url: import.meta.url,
  setupFiles: [fileURLToPath(new URL('./src/matchers/index.ts', import.meta.url))],
  browserOptions: {
    isolate: true,
  },
});

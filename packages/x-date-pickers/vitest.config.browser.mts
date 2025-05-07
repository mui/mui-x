/// <reference types="@vitest/browser/providers/playwright" />
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';

import { getTestName } from '../../scripts/getTestName.mts';
// eslint-disable-next-line import/no-relative-packages
import { redirectImports } from '../../test/vite-plugin-filter-replace.mts';

// This is different from the JSDOM config because we need to
// use the ESM version of date-fns* in the browser.
// It is unclear exactly why this is necessary, but it happens when we import from `index.js`
// Eg: 'date-fns/addDays/index.js' vs 'date-fns/addDays'
export const filterReplace = redirectImports([
  {
    test: /\/AdapterDateFnsV2\//,
    from: 'date-fns',
    to: 'date-fns-v2/esm',
  },
  {
    test: /\/AdapterDateFnsJalaliV2\//,
    from: 'date-fns-jalali',
    to: 'date-fns-jalali-v2/esm',
  },
]);

export default mergeConfig(sharedConfig, {
  plugins: [filterReplace],
  resolve: {
    alias: [
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale',
      },
    ],
  },
  test: {
    name: getTestName(import.meta.url),
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

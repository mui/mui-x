import { mergeConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import { redirectImports } from '../../test/vite-plugin-filter-replace.mts';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export const filterReplace = redirectImports([
  {
    test: /\/AdapterDateFnsV2\//,
    from: 'date-fns',
    to: 'date-fns-v2',
    include: ['date-fns-v2/locale', 'date-fns-v2/**/*.js'],
  },
  {
    test: /\/AdapterDateFnsJalaliV2\//,
    from: 'date-fns-jalali',
    to: 'date-fns-jalali-v2',
    include: ['date-fns-jalali-v2/locale', 'date-fns-jalali-v2/**/*.js'],
  },
]);

export default mergeConfig(sharedConfig, {
  plugins: [filterReplace],
  test: {
    name: getTestName(import.meta.url),
    environment: 'jsdom',
  },
});

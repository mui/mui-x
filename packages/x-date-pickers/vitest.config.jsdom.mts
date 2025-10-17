import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/no-relative-packages
import { redirectImports } from '../../test/vite-plugin-filter-replace.mts';
import { xVitestConfig } from '../../vitest.shared.mts';

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

export default xVitestConfig('jsdom', {
  url: import.meta.url,
  setupFiles: [fileURLToPath(new URL('../../test/utils/setupPickers.js', import.meta.url))],
  config: {
    plugins: [filterReplace],
  },
});

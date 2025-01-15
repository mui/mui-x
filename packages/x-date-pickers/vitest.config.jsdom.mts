import { mergeConfig, defineProject } from 'vitest/config';
import filterReplacePlugin from 'vite-plugin-filter-replace';
import sharedConfig from '../../vitest.shared.mts';
import packageJson from './package.json';

export const filterReplace = filterReplacePlugin(
  [
    {
      filter: /\/AdapterDateFnsV2\/.*/,
      replace: {
        from: /from 'date-fns'/g,
        to: "from 'date-fns-v2'",
      },
    },
    {
      filter: /\/AdapterDateFnsJalaliV2\/.*/,
      replace: {
        from: /from 'date-fns-jalali'/g,
        to: "from 'date-fns-jalali-v2'",
      },
    },
  ],
  { enforce: 'pre' },
);

export default mergeConfig(
  sharedConfig,
  defineProject({
    plugins: [filterReplace],
    test: {
      name: `jsdom/${packageJson.name.split('/')[1]}`,
      environment: 'jsdom',
    },
  }),
);

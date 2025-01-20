import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import packageJson from './package.json';
import { filterReplace } from './vitest.config.jsdom.mts';

export default mergeConfig(sharedConfig, {
  plugins: [filterReplace],
  test: {
    name: `browser/${packageJson.name.split('/')[1]}`,
    environment: 'browser',
    browser: {
      enabled: true,
    },
  },
});

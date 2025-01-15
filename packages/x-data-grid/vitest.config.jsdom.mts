import { mergeConfig, defineProject } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import packageJson from './package.json';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      name: `jsdom/${packageJson.name.split('/')[1]}`,
      environment: 'jsdom',
    },
  }),
);

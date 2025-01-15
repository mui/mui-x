import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vitest.config.{jsdom,browser}.mts',
  'docs/vitest.config.{jsdom,browser}.mts',
]);

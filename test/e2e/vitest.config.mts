import { defineConfig } from 'vitest/config';
import { alias } from '../../vitest.shared.mjs';

export default defineConfig({
  test: {
    globals: true,
    alias,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});

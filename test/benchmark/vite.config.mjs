import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { benchmarkPlugin } from '@mui/internal-benchmark/vitePlugin';

export default defineConfig({
  plugins: [benchmarkPlugin()],
  resolve: {
    alias: {
      // The test utilities of the repository, such as the builders of `test/utils/scheduler`.
      'test/utils': fileURLToPath(new URL('../utils', import.meta.url)),
    },
  },
});

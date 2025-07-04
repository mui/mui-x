/* eslint-disable */
import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';
import react from '@vitejs/plugin-react';
import { BenchmarkReporter } from 'vitest/reporters';
import util from 'util';

const isCI = process.env.CI === 'true';
const isTrace = !isCI && process.env.TRACE === 'true';

const reporter: BenchmarkReporter = {
  onTestModuleEnd(module) {
    console.log(
      util.inspect(
        module.task.tasks.flatMap((task) =>
          task.tasks.filter((task) => task.meta.benchmark).map((task) => task.result),
        ),
        { depth: null, colors: true },
      ),
    );
  },
};

export default defineConfig({
  plugins: [...(isCI ? [codspeedPlugin()] : []), react()],
  test: {
    setupFiles: ['./setup.ts'],
    env: { TRACE: isTrace ? 'true' : 'false' },
    environment: isTrace ? 'node' : 'jsdom',
    benchmark: { reporters: ['default', reporter] },
    browser: {
      enabled: isTrace,
      headless: true,
      instances: [
        {
          browser: 'chromium',
          testTimeout: 60_000,
          launch: {
            args: [
              '--enable-precise-memory-info',
              '--enable-devtools-experiments',
              '--disable-web-security',
            ],
          },
        },
      ],
      provider: 'playwright',
    },
  },
});

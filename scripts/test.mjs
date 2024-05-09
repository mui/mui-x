/* eslint-disable no-console */
import { spawn } from 'node:child_process';

/* 
This script ensures that we can use the same commands to run tests
when using pnpm as when using Yarn.
It enables to run `pnpm test` (or `pnpm t`) without any arguments, to run all tests,
or `pnpm test <test-name>` (or `pnpm t <test-name>`) to run a subset of tests in watch mode.

See https://github.com/mui/mui-x/pull/12948 for more context.
*/

if (process.argv.length < 3) {
  console.log('Running unit tests...');
  spawn('pnpm', ['test:unit'], {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
    env: {
      ...process.env,
      TZ: 'UTC',
    },
  });
} else {
  console.log('Running selected tests in watch mode...');
  console.warn(
    'Note: run `pnpm tc` to have a better experience (and be able to pass in additional parameters).',
  );

  console.log('cmd', ['tc', ...process.argv.slice(2)]);

  spawn('pnpm', ['tc', ...process.argv.slice(2)], {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
    env: {
      ...process.env,
      TZ: 'UTC',
    },
  });
}

export {}; // Ensure this file is treated as a module to avoid global scope TS error

declare global {
  interface MUIEnv {
    /*
     * The only values available are `production` and `development`.
     * Other values are invalid, if you need to detect a test environment use `globalThis.MUI_TEST_ENV` instead.
     * In public packaged it's recommended to combine with `process.env.NODE_ENV !== 'production'` to avoid bundle overhead.
     *   if (process.env.NODE_ENV !== 'production' && globalThis.MUI_TEST_ENV) {
     */
    NODE_ENV?: 'production' | 'development';
  }

  interface Process {
    env: MUIEnv;
  }

  // support process.env.NODE_ENV === '...'
  // @ts-ignore
  const process: Process;
}

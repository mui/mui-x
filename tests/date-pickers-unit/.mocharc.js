module.exports = {
  extension: ['js', 'ts', 'tsx'],
  ignore: ['**/build/**', '**/node_modules/**'],
  recursive: true,
  timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000, // Circle CI has low-performance CPUs.
  reporter: 'dot',
  require: [
    require.resolve('../../test/utils/setupBabel'),
    require.resolve('../../test/utils/setupJSDOM'),
  ],
  'watch-ignore': [
    '**/node_modules/**',
    // Unrelated directories with a large number of files
    '**/build/**',
  ],
  spec: ['../../packages/x-date-pickers{,-pro}/**/*.test.{js,ts,tsx}'],
};

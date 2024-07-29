// We can't import the `.mocharc.js` of the monorepo, otherwise we trigger its `setupBabel`.
module.exports = {
  extension: ['js', 'ts', 'tsx'],
  ignore: [
    '**/build/**',
    '**/node_modules/**',
    // Mocha seems to ignore .next anyway (maybe because dotfiles?).
    // We're leaving this to make sure.
    'docs/.next/**',
    // x-charts requires 'tsx/cjs' which conflict with the babel date-fns override for picker tests
    'packages/x-charts/**',
    'packages/x-charts-pro/**',
  ],
  recursive: true,
  timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000, // Circle CI has low-performance CPUs.
  reporter: 'dot',
  require: [require.resolve('./test/utils/setupBabel'), require.resolve('./test/utils/setupJSDOM')],
  'watch-ignore': [
    // default
    '.git',
    // node_modules can be nested with workspaces
    '**/node_modules/**',
    // Unrelated directories with a large number of files
    '**/build/**',
    'docs/.next/**',
  ],
  spec: ['packages/**/*.test.{js,ts,tsx}', 'docs/src/modules/**/*.test.{js,ts,tsx}'],
};

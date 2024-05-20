// We can't import the `.mocharc.js` of the monorepo, otherwise we trigger its `setupBabel`.
module.exports = {
  extension: ['js', 'ts', 'tsx'],
  ignore: [
    '**/build/**',
    '**/node_modules/**',
    // Mocha seems to ignore .next anyway (maybe because dotfiles?).
    // We're leaving this to make sure.
    'docs/.next/**',
  ],
  recursive: true,
  timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000, // Circle CI has low-performance CPUs.
  reporter: 'dot',
  require: [
    require.resolve('../../test/utils/setupBabel'),
    // Not strictly necessary, but just to keep the babel plugins in the loop for the tests
    // For compiling pure ESM modules that @babel/register can't handle.
    // See https://babeljs.io/docs/babel-register#experimental-babel-8-implementation
    //   Note: @babel/register does not support compiling native Node.js ES modules on the fly,
    //   since currently there is no stable API for intercepting ES modules loading.
    require.resolve('tsx/cjs'),
    require.resolve('../../test/utils/setupJSDOM'),
  ],
  'watch-ignore': [
    // default
    '.git',
    // node_modules can be nested with workspaces
    '**/node_modules/**',
    // Unrelated directories with a large number of files
    '**/build/**',
    'docs/.next/**',
  ],
  spec: ['packages/x-charts-pro/**/*.test.{js,ts,tsx}'],
};

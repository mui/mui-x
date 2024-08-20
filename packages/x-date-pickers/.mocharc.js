const mochaConfig = require('../../test/shared/setup/mochaConfig');

const { resolvePackagesDir, sharedConfig } = mochaConfig;

module.exports = {
  ...sharedConfig,
  require: [
    require.resolve('../../test/shared/setup/setupBabel'),
    require.resolve('../../test/shared/setup/setupJSDOM'),
    require.resolve('./test/setup/setupJSDOM'),
  ],
  spec: [resolvePackagesDir('./packages/x-date-pickers/**/*.test.{js,ts,tsx}', __dirname)],
};

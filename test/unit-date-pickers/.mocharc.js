const mochaConfig = require('../shared/setup/mochaConfig');

const { resolvePackagesDir, sharedConfig } = mochaConfig;

module.exports = {
  ...sharedConfig,
  require: [
    require.resolve('../shared/setup/setupBabel'),
    require.resolve('../shared/setup/setupJSDOM'),
    require.resolve('./setup/setupJSDOM'),
  ],
  spec: [resolvePackagesDir('./packages/x-date-pickers{,-pro}/**/*.test.{js,ts,tsx}', __dirname)],
};

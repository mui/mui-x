const { default: getBaseConfig } = require('@mui/internal-code-infra/babel-config');
const generateReleaseInfo = require('./packages/x-license/generateReleaseInfo');

/**
 * @typedef {import('@babel/core')} babel
 */

/** @type {babel.ConfigFunction} */
module.exports = function getBabelConfig(api) {
  const baseConfig = getBaseConfig(api);

  const removePropTypePlugin = baseConfig.plugins.find(
    (p) => p[2] === 'babel-plugin-transform-react-remove-prop-types',
  );
  if (removePropTypePlugin) {
    removePropTypePlugin[1] ??= {};
    removePropTypePlugin[1].mode = 'unsafe-wrap';
    removePropTypePlugin[1].ignoreFilenames ??= [];
    removePropTypePlugin[1].ignoreFilenames.push('DataGrid.tsx', 'DataGridPro.tsx');
  }
  const displayNamePlugin = baseConfig.plugins.find(
    (p) => p[2] === '@mui/internal-babel-plugin-display-name',
  );

  if (displayNamePlugin) {
    displayNamePlugin[1] ??= {};
    displayNamePlugin[1].allowedCallees = {
      ...displayNamePlugin[1].allowedCallees,
      '@mui/x-internals/forwardRef': ['forwardRef'],
    };
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.TEST_BUILD) {
      baseConfig.plugins.push([
        'babel-plugin-react-remove-properties',
        { properties: ['data-testid'] },
      ]);
    }

    if (process.env.BABEL_ENV) {
      baseConfig.plugins.push([
        'babel-plugin-search-and-replace',
        {
          rules: [
            {
              search: '__RELEASE_INFO__',
              replace: generateReleaseInfo(),
            },
          ],
        },
      ]);
    }
  }

  if (process.env.BABEL_ENV || process.env.NODE_ENV === 'test') {
    baseConfig.plugins.push([
      'babel-plugin-transform-replace-expressions',
      {
        replace: [['LICENSE_DISABLE_CHECK', 'false']],
      },
    ]);
  }

  baseConfig.plugins.push(['@babel/plugin-transform-object-rest-spread', { loose: true }]);
  delete baseConfig.assumptions.setSpreadProperties;

  return baseConfig;
};

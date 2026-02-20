const { default: getBaseConfig } = require('@mui/internal-code-infra/babel-config');
const generateReleaseInfo = require('./packages/x-license/generateReleaseInfo');

/**
 * @typedef {import('@babel/core')} babel
 */

/** @type {babel.ConfigFunction} */
module.exports = function getBabelConfig(api) {
  const baseConfig = getBaseConfig(api);

  const plugins = [
    ['@babel/plugin-transform-object-rest-spread', { loose: true }],
    [
      'babel-plugin-transform-react-remove-prop-types',
      {
        mode: 'unsafe-wrap',
        ignoreFilenames: ['DataGrid.tsx', 'DataGridPro.tsx'],
      },
    ],
    [
      '@mui/internal-babel-plugin-display-name',
      {
        allowedCallees: {
          '@mui/x-internals/forwardRef': ['forwardRef'],
        },
      },
      'mui-x-display-name',
    ],
  ];

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.TEST_BUILD) {
      plugins.push(['babel-plugin-react-remove-properties', { properties: ['data-testid'] }]);
    }

    if (process.env.BABEL_ENV) {
      plugins.push([
        'search-and-replace',
        {
          rules: [
            {
              search: '__RELEASE_INFO__',
              replace: generateReleaseInfo(),
            },
            {
              search: 'process.env.IS_TEST_ENV',
              replace: 'false',
            },
          ],
        },
      ]);
    }
  }

  if (process.env.BABEL_ENV || process.env.IS_TEST_ENV) {
    plugins.push([
      'transform-replace-expressions',
      {
        replace: [['LICENSE_DISABLE_CHECK', 'false']],
      },
    ]);
  }

  baseConfig.plugins = baseConfig.plugins
    .filter(
      ([, , pluginName]) =>
        pluginName !== 'babel-plugin-transform-react-remove-prop-types' &&
        pluginName !== '@mui/internal-babel-plugin-display-name',
    )
    .concat(plugins);
  delete baseConfig.assumptions.setSpreadProperties;

  return baseConfig;
};

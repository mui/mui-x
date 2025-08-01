// @ts-check
const path = require('path');
const generateReleaseInfo = require('./packages/x-license/generateReleaseInfo');

/**
 * @typedef {import('@babel/core')} babel
 */

/**
 *
 * @param {string} relativeToBabelConf
 * @returns {string}
 */
function resolveAliasPath(relativeToBabelConf) {
  const resolvedPath = path.relative(process.cwd(), path.resolve(__dirname, relativeToBabelConf));
  return `./${resolvedPath.replace('\\', '/')}`;
}

const defaultAlias = {
  '@mui/x-data-grid': resolveAliasPath('./packages/x-data-grid/src'),
  '@mui/x-data-grid-generator': resolveAliasPath('./packages/x-data-grid-generator/src'),
  '@mui/x-data-grid-pro': resolveAliasPath('./packages/x-data-grid-pro/src'),
  '@mui/x-data-grid-premium': resolveAliasPath('./packages/x-data-grid-premium/src'),
  '@mui/x-license': resolveAliasPath('./packages/x-license/src'),
  '@mui/x-telemetry': resolveAliasPath('./packages/x-telemetry/src'),
  '@mui/x-date-pickers': resolveAliasPath('./packages/x-date-pickers/src'),
  '@mui/x-date-pickers-pro': resolveAliasPath('./packages/x-date-pickers-pro/src'),
  '@mui/x-charts': resolveAliasPath('./packages/x-charts/src'),
  '@mui/x-charts-pro': resolveAliasPath('./packages/x-charts-pro/src'),
  '@mui/x-charts-premium': resolveAliasPath('./packages/x-charts-premium/src'),
  '@mui/x-charts-vendor': resolveAliasPath('./packages/x-charts-vendor'),
  '@mui/x-scheduler': resolveAliasPath('./packages/x-scheduler'),
  '@mui/x-tree-view': resolveAliasPath('./packages/x-tree-view/src'),
  '@mui/x-tree-view-pro': resolveAliasPath('./packages/x-tree-view-pro/src'),
  '@mui/x-internals': resolveAliasPath('./packages/x-internals/src'),
  '@mui/x-internal-gestures': resolveAliasPath('./packages/x-internal-gestures/src'),
  '@mui/x-virtualizer': resolveAliasPath('./packages/x-virtualizer/src'),
  '@mui/material-nextjs': '@mui/monorepo/packages/mui-material-nextjs/src',
  '@mui-internal/api-docs-builder': resolveAliasPath(
    './node_modules/@mui/monorepo/packages/api-docs-builder',
  ),
  docs: resolveAliasPath('./node_modules/@mui/monorepo/docs'),
  test: resolveAliasPath('./test'),
  packages: resolveAliasPath('./packages'),
};

/** @type {babel.ConfigFunction} */
module.exports = function getBabelConfig(api) {
  const useESModules = api.env(['stable', 'rollup']);

  const presets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        browserslistEnv: api.env() || process.env.NODE_ENV,
        debug: process.env.MUI_BUILD_VERBOSE === 'true',
        modules: useESModules ? false : 'commonjs',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ];

  // Essentially only replace in production builds.
  // When aliasing we want to keep the original extension
  const outFileExtension = process.env.MUI_OUT_FILE_EXTENSION || null;

  /** @type {babel.PluginItem[]} */
  const plugins = [
    'babel-plugin-optimize-clsx',
    // Need the following 3 transforms for all targets in .browserslistrc.
    // With our usage the transpiled loose mode is equivalent to spec mode.
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-object-rest-spread', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules,
        // any package needs to declare 7.27.0 as a runtime dependency. default is ^7.0.0
        version: process.env.MUI_BABEL_RUNTIME_VERSION || '^7.27.0',
      },
    ],
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
    ],
    [
      'transform-inline-environment-variables',
      {
        include: [
          'MUI_VERSION',
          'MUI_MAJOR_VERSION',
          'MUI_MINOR_VERSION',
          'MUI_PATCH_VERSION',
          'MUI_PRERELEASE',
        ],
      },
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
          ],
        },
      ]);
    }
  }

  if (process.env.BABEL_ENV || process.env.NODE_ENV === 'test') {
    plugins.push([
      'transform-replace-expressions',
      {
        replace: [['LICENSE_DISABLE_CHECK', 'false']],
      },
    ]);
  }

  if (useESModules) {
    plugins.push([
      '@mui/internal-babel-plugin-resolve-imports',
      {
        outExtension: outFileExtension,
      },
    ]);
  }

  return {
    assumptions: {
      noDocumentAll: true,
      // TODO: Replace "loose" mode with these:
      // setPublicClassFields: true,
      // privateFieldsAsProperties: true,
      // objectRestNoSymbols: true,
      // setSpreadProperties: true,
    },
    presets,
    plugins,
    ignore: [
      // Fix a Windows issue.
      /@babel[\\|/]runtime/,
      // Fix const foo = /{{(.+?)}}/gs; crashing.
      /prettier/,
    ],
    env: {
      development: {
        plugins: [
          [
            'babel-plugin-module-resolver',
            {
              alias: defaultAlias,
              root: ['./'],
            },
          ],
        ],
      },
    },
  };
};

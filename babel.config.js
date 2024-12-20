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
  '@mui/x-date-pickers': resolveAliasPath('./packages/x-date-pickers/src'),
  '@mui/x-date-pickers-pro': resolveAliasPath('./packages/x-date-pickers-pro/src'),
  '@mui/x-charts': resolveAliasPath('./packages/x-charts/src'),
  '@mui/x-charts-pro': resolveAliasPath('./packages/x-charts-pro/src'),
  '@mui/x-charts-vendor': resolveAliasPath('./packages/x-charts-vendor'),
  '@mui/x-tree-view': resolveAliasPath('./packages/x-tree-view/src'),
  '@mui/x-tree-view-pro': resolveAliasPath('./packages/x-tree-view-pro/src'),
  '@mui/x-internals': resolveAliasPath('./packages/x-internals/src'),
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
  const useESModules = api.env(['modern', 'stable', 'rollup']);

  const presets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        browserslistEnv: process.env.BABEL_ENV || process.env.NODE_ENV,
        debug: process.env.MUI_BUILD_VERBOSE === 'true',
        modules: useESModules ? false : 'commonjs',
        shippedProposals: api.env('modern'),
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

  const usesAliases =
    // in this config:
    api.env(['coverage', 'development', 'test', 'benchmark']) ||
    process.env.NODE_ENV === 'test' ||
    // in webpack config:
    api.env(['regressions']);

  const outFileExtension = '.js';

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
        // any package needs to declare 7.25.0 as a runtime dependency. default is ^7.0.0
        version: process.env.MUI_BABEL_RUNTIME_VERSION || '^7.25.0',
      },
    ],
    [
      'babel-plugin-transform-react-remove-prop-types',
      {
        mode: 'unsafe-wrap',
        ignoreFilenames: ['DataGrid.tsx', 'DataGridPro.tsx'],
      },
    ],
  ];

  if (process.env.NODE_ENV === 'test') {
    plugins.push(['@babel/plugin-transform-export-namespace-from']);
    // We replace `date-fns` imports with an aliased `date-fns@v4` version installed as `date-fns-v4` for tests.
    // The plugin is patched to only run on `AdapterDateFnsV3.ts`.
    // TODO: remove when we upgrade to date-fns v4 by default.
    plugins.push([
      'babel-plugin-replace-imports',
      {
        test: /date-fns/i,
        replacer: 'date-fns-v4',
        // This option is provided by the `patches/babel-plugin-replace-imports@1.0.2.patch` patch
        filenameIncludes: 'src/AdapterDateFnsV3/',
      },
    ]);
    plugins.push([
      'babel-plugin-replace-imports',
      {
        test: /date-fns-jalali/i,
        replacer: 'date-fns-jalali-v3',
        // This option is provided by the `patches/babel-plugin-replace-imports@1.0.2.patch` patch
        filenameIncludes: 'src/AdapterDateFnsJalaliV3/',
      },
      'replace-date-fns-jalali-imports',
    ]);
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.E2E_BUILD) {
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

  if (useESModules) {
    plugins.push([
      '@mui/internal-babel-plugin-resolve-imports',
      {
        // Don't replace the extension when we're using aliases.
        // Essentially only replace in production builds.
        outExtension: usesAliases ? null : outFileExtension,
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
      coverage: {
        plugins: [
          'babel-plugin-istanbul',
          [
            'babel-plugin-module-resolver',
            {
              root: ['./'],
              alias: defaultAlias,
            },
          ],
        ],
      },
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
      test: {
        sourceMaps: 'both',
        plugins: [
          [
            'babel-plugin-module-resolver',
            {
              root: ['./'],
              alias: defaultAlias,
            },
          ],
        ],
      },
    },
  };
};

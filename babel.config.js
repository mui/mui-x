const path = require('path');
const generateReleaseInfo = require('./packages/x-license-pro/generateReleaseInfo');

function getDefaultAlias() {
  function resolve(relativeToBabelConf) {
    const resolvedPath = path.relative(process.cwd(), path.resolve(__dirname, relativeToBabelConf));
    return `./${resolvedPath.replace('\\', '/')}`;
  }

  return {
    '@mui/x-charts': resolve('./packages/grid/x-charts/src'),
    '@mui/x-data-grid': resolve('./packages/grid/x-data-grid/src'),
    '@mui/x-data-grid-generator': resolve('./packages/grid/x-data-grid-generator/src'),
    '@mui/x-data-grid-pro': resolve('./packages/grid/x-data-grid-pro/src'),
    '@mui/x-data-grid-premium': resolve('./packages/grid/x-data-grid-premium/src'),
    '@mui/x-date-pickers': resolve('./packages/x-date-pickers/src'),
    '@mui/x-date-pickers-pro': resolve('./packages/x-date-pickers-pro/src'),
    '@mui/x-license-pro': resolve('./packages/x-license-pro/src'),
    '@mui/markdown': '@mui/monorepo/packages/markdown',
    '@mui-internal/docs-utilities': '@mui/monorepo/packages/docs-utilities',
    'typescript-to-proptypes': '@mui/monorepo/packages/typescript-to-proptypes/src',
    docs: resolve('./node_modules/@mui/monorepo/docs'),
    test: resolve('./test'),
    packages: resolve('./packages'),
  };
}

function getBabelConfig(api) {
  const useESModules = api.env(['legacy', 'modern', 'stable', 'rollup']);
  const defaultAlias = getDefaultAlias();

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

  const plugins = [
    'babel-plugin-optimize-clsx',
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules,
        // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
        version: '^7.4.4',
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

  const productionPlugins = [
    ['babel-plugin-react-remove-properties', { properties: ['data-mui-test'] }],
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push(...productionPlugins);

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
  if (process.env.NODE_ENV === 'test') {
    plugins.push([
      'babel-plugin-module-resolver',
      {
        alias: defaultAlias,
        root: ['./'],
      },
    ]);
  }

  return {
    assumptions: {
      noDocumentAll: true,
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
      objectRestNoSymbols: true,
      setSpreadProperties: true,
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
      legacy: {
        plugins: [
          // IE11 support
          '@babel/plugin-transform-object-assign',
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
      benchmark: {
        plugins: [
          ...productionPlugins,
          [
            'babel-plugin-module-resolver',
            {
              alias: defaultAlias,
            },
          ],
        ],
      },
    },
  };
}

getBabelConfig.getDefaultAlias = getDefaultAlias;

module.exports = getBabelConfig;

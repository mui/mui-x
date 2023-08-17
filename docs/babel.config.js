const fse = require('fs-extra');

const alias = {
  '@mui/x-data-grid': '../packages/grid/x-data-grid/src',
  '@mui/x-data-grid-generator': '../packages/grid/x-data-grid-generator/src',
  '@mui/x-data-grid-pro': '../packages/grid/x-data-grid-pro/src',
  '@mui/x-data-grid-premium': '../packages/grid/x-data-grid-premium/src',
  '@mui/x-date-pickers': '../packages/x-date-pickers/src',
  '@mui/x-date-pickers-pro': '../packages/x-date-pickers-pro/src',
  '@mui/x-charts': '../packages/x-charts/src',
  '@mui/x-tree-view': '../packages/x-tree-view/src',
  '@mui/x-license-pro': '../packages/x-license-pro/src',
  '@mui/docs': '../node_modules/@mui/monorepo/packages/mui-docs/src',
  '@mui/markdown': '../node_modules/@mui/monorepo/packages/markdown',
  '@mui/monorepo': '../node_modules/@mui/monorepo',
  '@mui-internal/docs-utilities': '../node_modules/@mui/monorepo/packages/docs-utilities',
  docs: '../node_modules/@mui/monorepo/docs',
  docsx: './',
};

const { version: transformRuntimeVersion } = fse.readJSONSync(
  require.resolve('@babel/runtime-corejs2/package.json'),
);

module.exports = {
  presets: [
    // backport of https://github.com/zeit/next.js/pull/9511
    ['next/babel', { 'transform-runtime': { corejs: 2, version: transformRuntimeVersion } }],
  ],
  plugins: [
    [
      'babel-plugin-transform-rename-import',
      {
        replacements: [{ original: '@mui/utils/macros/MuiError.macro', replacement: 'react' }],
      },
    ],
    'babel-plugin-optimize-clsx',
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
    'babel-plugin-preval',
    [
      'babel-plugin-module-resolver',
      {
        alias,
        transformFunctions: ['require', 'require.context'],
      },
    ],
  ],
  ignore: [
    // Fix a Windows issue.
    /@babel[\\|/]runtime/,
    // Fix const foo = /{{(.+?)}}/gs; crashing.
    /prettier/,
    /@mui[\\|/]docs[\\|/]markdown/,
  ],
  env: {
    production: {
      plugins: [
        // TODO fix useGridSelector side effect and enable back.
        // '@babel/plugin-transform-react-constant-elements',
        ['babel-plugin-react-remove-properties', { properties: ['data-mui-test'] }],
        ['babel-plugin-transform-react-remove-prop-types', { mode: 'remove' }],
      ],
    },
  },
};

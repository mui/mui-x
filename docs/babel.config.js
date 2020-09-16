const bpmr = require('babel-plugin-module-resolver');
const fse = require('fs-extra');

function resolvePath(sourcePath, currentFile, opts) {
  if (sourcePath === 'markdown') {
    const base = currentFile.substring(__dirname.length).slice(0, -3);
    return `${__dirname}/docs/src/${base}/`;
  }

  return bpmr.resolvePath(sourcePath, currentFile, opts);
}

const alias = {
  '@material-ui/data-grid': '../packages/grid/data-grid/src',
  '@material-ui/x-grid-data-generator': '../packages/grid/x-grid-data-generator/src',
  '@material-ui/x-grid-modules': '../packages/grid/x-grid-modules/src',
  '@material-ui/x-grid': '../packages/grid/x-grid/src',
  '@material-ui/x-license': '../packages/x-license/src',
  // Help in the event npm and git are significantly desynchronized.
  '@material-ui/core': './node_modules/@material-ui/monorepo/packages/material-ui/src',
  '@material-ui/styles': './node_modules/@material-ui/monorepo/packages/material-ui-styles/src',
  '@material-ui/docs': './node_modules/@material-ui/monorepo/packages/material-ui-docs/src',
  '@material-ui/lab': './node_modules/@material-ui/monorepo/packages/material-ui-lab/src',
  docs: './node_modules/@material-ui/monorepo/docs',
  docsx: './',
  modules: './node_modules/@material-ui/monorepo/modules',
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
        replacements: [
          { original: '@material-ui/utils/macros/MuiError.macro', replacement: 'react' },
        ],
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
        resolvePath,
      },
    ],
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  env: {
    production: {
      plugins: [
        '@babel/plugin-transform-react-constant-elements',
        'babel-plugin-transform-dev-warning',
        ['babel-plugin-react-remove-properties', { properties: ['data-mui-test'] }],
        ['babel-plugin-transform-react-remove-prop-types', { mode: 'remove' }],
      ],
    },
  },
};

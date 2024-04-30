const fse = require('fs-extra');
const getBaseConfig = require('../babel.config');

const alias = {
  '@mui/docs': '../node_modules/@mui/monorepo/packages/mui-docs/src',
  '@mui/monorepo': '../node_modules/@mui/monorepo',
  '@mui/material-nextjs': '../node_modules/@mui/monorepo/packages/mui-material-nextjs/src',
  '@mui-internal/api-docs-builder': '../node_modules/@mui/monorepo/packages/api-docs-builder',
  docs: '../node_modules/@mui/monorepo/docs',
  docsx: './',
};

const { version: transformRuntimeVersion } = fse.readJSONSync(
  require.resolve('@babel/runtime-corejs2/package.json'),
);

module.exports = function getBabelConfig(api) {
  const baseConfig = getBaseConfig(api);

  return {
    assumptions: baseConfig.assumptions,
    presets: [
      // backport of https://github.com/zeit/next.js/pull/9511
      ['next/babel', { 'transform-runtime': { corejs: 2, version: transformRuntimeVersion } }],
    ],
    plugins: [
      ...baseConfig.plugins,
      'babel-plugin-preval',
      [
        'babel-plugin-module-resolver',
        {
          alias,
          transformFunctions: ['require', 'require.context'],
        },
      ],
    ],
    ignore: [...baseConfig.ignore, /@mui[\\|/]docs[\\|/]markdown/],
  };
};

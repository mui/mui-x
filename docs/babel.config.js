const fse = require('fs-extra');
const getBaseConfig = require('../babel.config');

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
    plugins: [...baseConfig.plugins, 'babel-plugin-preval'],
    ignore: [...baseConfig.ignore, /@mui[\\|/]docs[\\|/]markdown/],
  };
};

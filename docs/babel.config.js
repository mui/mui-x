const getBaseConfig = require('../babel.config');

module.exports = function getBabelConfig(api) {
  const baseConfig = getBaseConfig(api);

  return {
    assumptions: baseConfig.assumptions,
    presets: ['next/babel'],
    plugins: [...baseConfig.plugins, 'babel-plugin-preval'],
    ignore: [...baseConfig.ignore, /@mui[\\|/]docs[\\|/]markdown/],
  };
};

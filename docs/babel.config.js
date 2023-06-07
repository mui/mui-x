const getBaseConfig = require('../babel.config');

module.exports = function getBabelConfig(api) {
  const baseConfig = getBaseConfig(api);

  const alias = {
    ...getBaseConfig.getSharedAlias(),
    '@mui/monorepo': '../node_modules/@mui/monorepo',
    '@mui/docs': '../node_modules/@mui/monorepo/packages/mui-docs/src',
    docs: '../node_modules/@mui/monorepo/docs',
    docsx: './',
  };

  return {
    assumptions: baseConfig.assumptions,
    presets: ['next/babel'],
    plugins: [
      [
        'babel-plugin-transform-rename-import',
        {
          replacements: [{ original: '@mui/utils/macros/MuiError.macro', replacement: 'react' }],
        },
      ],
      'babel-plugin-optimize-clsx',
      // for Safari support
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
    ignore: [...baseConfig.ignore, /@mui[\\|/]docs[\\|/]markdown/],
    env: {
      production: {
        plugins: [
          // https://github.com/mui/mui-x/pull/666
          // '@babel/plugin-transform-react-constant-elements',
          ['babel-plugin-react-remove-properties', { properties: ['data-mui-test'] }],
          ['babel-plugin-transform-react-remove-prop-types', { mode: 'remove' }],
        ],
      },
    },
  };
};

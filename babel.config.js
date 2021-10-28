const path = require('path');

let defaultPresets;

// We release a ES version of MUI.
// It's something that matches the latest official supported features of JavaScript.
// Nothing more (stage-1, etc), nothing less (require, etc).
if (process.env.BABEL_ENV === 'es') {
  defaultPresets = [];
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: ['esm', 'production-umd'].includes(process.env.BABEL_ENV) ? false : 'commonjs',
      },
    ],
  ];
}

function resolveAliasPath(relativeToBabelConf) {
  const resolvedPath = path.relative(process.cwd(), path.resolve(__dirname, relativeToBabelConf));
  return `./${resolvedPath.replace('\\', '/')}`;
}

const defaultAlias = {
  '@mui/x-data-grid': resolveAliasPath('./packages/grid/data-grid/src'),
  '@mui/x-data-grid-generator': resolveAliasPath('./packages/grid/x-grid-data-generator/src'),
  '@mui/x-data-grid-pro': resolveAliasPath('./packages/grid/x-grid/src'),
  '@mui/x-license-pro': resolveAliasPath('./packages/x-license/src'),
  'typescript-to-proptypes': '@material-ui/monorepo/packages/typescript-to-proptypes/src',
  docs: resolveAliasPath('./node_modules/@material-ui/monorepo/docs'),
};

module.exports = {
  presets: defaultPresets.concat(['@babel/preset-react', '@babel/preset-typescript']),
  plugins: [
    'babel-plugin-optimize-clsx',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
    ['@babel/plugin-transform-runtime', { version: '^7.4.4' }],
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.ts', '.tsx'],
        alias: defaultAlias,
      },
    ],
  ],
  ignore: [
    // Fix a Windows issue.
    /@babel[\\|/]runtime/,
    // Fix const foo = /{{(.+?)}}/gs; crashing.
    /prettier/,
  ],
  env: {
    coverage: {
      plugins: ['babel-plugin-istanbul'],
    },
    test: {
      sourceMaps: 'both',
    },
    benchmark: {
      plugins: [
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

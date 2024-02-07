const path = require('path');
const base = require('../webpackBaseConfig');

const root = __dirname;

module.exports = (env) => {
  if (!env.target) {
    console.error('###########################################################################');
    console.error('# Define the target source: `npx webpack --env=target=./src/filtering.ts` #');
    console.error('###########################################################################');
    process.exit(1);
  }

  return {
    target: 'node',
    mode: 'production',
    // devtool: 'inline-source-map',
    optimization: {
      minimize: false,
    },

    context: root,
    resolve: {
      ...base.resolve,
      modules: [root, 'node_modules'],
      alias: {
        react: path.resolve(root, './react-mock/'),
        ...base.resolve.alias,
      },
    },
    module: base.module,
    entry: {
      main: env.target,
    },
    output: {
      path: path.resolve(root, './build'),
      filename: 'bundle.js',
    },
  };
};

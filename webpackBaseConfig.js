const path = require('path');

// This module isn't used to build the documentation. We use Next.js for that.
// This module is used by the visual regression tests to run the demos.
module.exports = {
  context: path.resolve(__dirname),
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      '@material-ui/x-grid': path.resolve(__dirname, './packages/grid/x-grid/src'),
      '@material-ui/x-grid-modules': path.resolve(__dirname, './packages/grid/x-grid-modules/src'),
      '@material-ui/x-license': path.resolve(__dirname, './packages/license/src'),
      '@material-ui/data-grid': path.resolve(__dirname, './packages/grid/data-grid/src'),
      docs: path.resolve(__dirname, './docs/node_modules/@material-ui/monorepo/docs'),
    },
    extensions: ['.js', '.ts', '.tsx', '.d.ts'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};

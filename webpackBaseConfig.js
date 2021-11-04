const path = require('path');

// This module isn't used to build the documentation. We use Next.js for that.
// This module is used by the visual regression tests to run the demos.
module.exports = {
  context: path.resolve(__dirname),
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      '@mui/x-data-grid': path.resolve(__dirname, './packages/grid/x-data-grid/src'),
      '@mui/x-data-grid-generator': path.resolve(
        __dirname,
        './packages/grid/x-data-grid-generator/src',
      ),
      '@mui/x-data-grid-pro': path.resolve(__dirname, './packages/grid/x-data-grid-pro/src'),
      '@mui/x-license-pro': path.resolve(__dirname, './packages/x-license-pro/src'),
      '@mui/markdown': path.resolve(
        __dirname,
        './node_modules/@material-ui/monorepo/docs/packages/markdown',
      ),
      docs: path.resolve(__dirname, './node_modules/@material-ui/monorepo/docs'),
      docsx: path.resolve(__dirname, './docs'),
    },
    extensions: ['.js', '.ts', '.tsx', '.d.ts'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules\/(?!@material-ui)/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.tsx$/,
        loader: 'string-replace-loader',
        options: {
          search: '__RELEASE_INFO__',
          replace: 'MTU5NjMxOTIwMDAwMA==', // 2020-08-02
        },
      },
    ],
  },
};

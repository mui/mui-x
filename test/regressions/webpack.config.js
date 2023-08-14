const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const webpackBaseConfig = require('../../webpackBaseConfig');

module.exports = {
  ...webpackBaseConfig,
  entry: path.resolve(__dirname, 'index.js'),
  mode: process.env.NODE_ENV || 'development',
  optimization: {
    // Helps debugging and build perf.
    // Bundle size is irrelevant for local serving
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
    filename: 'tests.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.html'),
    }),
    new webpack.DefinePlugin({
      DISABLE_CHANCE_RANDOM: JSON.stringify(true),
    }),
    new webpack.ProvidePlugin({
      // required by enzyme > cheerio > parse5 > util
      process: 'process/browser.js',
    }),
  ],
  module: {
    ...webpackBaseConfig.module,
    rules: webpackBaseConfig.module.rules.concat([
      {
        test: /\.(jpg|gif|png)$/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]),
  },
  resolve: {
    ...webpackBaseConfig.resolve,
    alias: {
      ...webpackBaseConfig.resolve.alias,
      docs: false, // Disable this alias as it creates a circular resolution loop with the docsx alias
    },
  },
  // TODO: 'browserslist:modern'
  // See https://github.com/webpack/webpack/issues/14203
  target: 'web',
};

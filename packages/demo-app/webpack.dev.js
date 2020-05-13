const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  entry: ['webpack-dev-server/client?http://localhost:8080'],
  devtool: 'inline-source-map',

  devServer: {
    // hot:true,
    host: 'localhost',
    contentBase: ['./dist', './public'],
    compress: true,
    port: 3002,
  },
  module: {
    rules: [
      {
        test: /\.tsx?|\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
});

const { chromium } = require('@playwright/test');
const webpack = require('webpack');

const CI = Boolean(process.env.CI);

process.env.CHROME_BIN ||= chromium.executablePath();

// Karma configuration
module.exports = function setKarmaConfig(config) {
  const baseConfig = {
    basePath: '../',
    browsers: ['chromeHeadless'],
    browserDisconnectTimeout: 3 * 60 * 1000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 6 * 60 * 1000, // default 10000
    colors: true,
    client: {
      mocha: {
        // Some BrowserStack browsers can be slow.
        timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000,
      },
    },
    frameworks: (process.env.PARALLEL === 'true' ? ['parallel'] : []).concat(['mocha', 'webpack']),
    files: [
      {
        pattern: 'test/karma.tests.js',
        watched: true,
        served: true,
        included: true,
      },
    ],
    plugins: (process.env.PARALLEL === 'true' ? ['karma-parallel'] : []).concat([
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
    ]),
    /**
     * possible values:
     * - config.LOG_DISABLE
     * - config.LOG_ERROR
     * - config.LOG_WARN
     * - config.LOG_INFO
     * - config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,
    port: 9876,
    preprocessors: {
      'test/karma.tests.js': ['webpack', 'sourcemap'],
    },
    reporters: ['dots'],
    webpack: {
      mode: 'development',
      devtool: CI ? 'inline-source-map' : 'eval-source-map',
      target: 'web',
      optimization: {
        nodeEnv: false, // https://x.com/wsokra/status/1378643098893443072
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"test"',
            CI: JSON.stringify(process.env.CI),
            KARMA: 'true',
          },
        }),
      ],
      module: {
        rules: [
          {
            test: /\.(js|ts|tsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules\/.*\/node_modules\/(?!@mui\/monorepo)/,
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        fallback: {
          fs: false, // Some tests import fs,
          stream: require.resolve('stream-browserify'), // util > inherits breaks with `false`
          path: false,
        },
      },
    },
    webpackMiddleware: {
      noInfo: true,
      writeToDisk: CI,
    },
    customLaunchers: {
      chromeHeadless: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          // running headless chrome in a virtualized environment forces pointer type to default to `NONE`
          // to mimic "desktop" environment more correctly we force blink to have `pointer: fine` support
          // this allows correct pickers behavior, where their rendering depends on this condition
          // https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311
          '--blink-settings=primaryPointerType=4',
          // increasing default `800x600` size to certain window sizing cases to consider browser as "mobile"
          // i.e.: date time pickers do check height > 667
          '--window-size=1000,800',
        ],
      },
    },
    singleRun: CI,
  };

  config.set(baseConfig);
};

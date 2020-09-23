const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development'
/* eslint-disable */
const __DEV__ = env === 'development'
const __PROD__ = env === 'production'
/* eslint-enable */

if (!(__DEV__ || __PROD__)) {
  throw new Error(`Unknown env: ${env}.`)
}
console.log(`Loading config for ${env}`)
const maxAssetSize = 1024 * 1024;

module.exports = {
  stories: ['../src/**/*.stories.*'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-viewport/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-storysource/register',
    '@storybook/addon-a11y/register',
  ],
  typescript: {
    check: __DEV__, // Netlify is breaking the deploy with this settings on. So deactivate on release
  },
  webpackFinal: async config => {
    config.devtool = __DEV__ ? 'inline-source-map' : undefined;
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        }
      ],
    });
    if (__DEV__) {
      config.module.rules.push({
        test: /\.(js|ts|tsx)$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      });
    }

    config.module.rules.push({
      test: /\.stories\.tsx?$/,
      loaders: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: {
            parser: 'typescript',
            prettierConfig: {printWidth: 80, singleQuote: true},
            tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
          },
        },
      ],
      enforce: 'pre',
    });

    config.module.rules.push({
      test: /\.tsx$/,
      loader: 'string-replace-loader',
      options: {
        search: '__RELEASE_INFO__',
        replace: 'MTU5NjMxOTIwMDAwMA==', // 2020-08-02
      }
    });

    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 30 * 1024,
        maxSize: maxAssetSize,
      }
    };
    config.performance = {
      maxAssetSize: maxAssetSize
    };
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        '@material-ui/data-grid': path.resolve(__dirname, '../../../packages/grid/data-grid/src'),
        '@material-ui/x-grid-data-generator': path.resolve(__dirname, '../../../packages/x-grid-data-generator/src'),
        '@material-ui/x-grid': path.resolve(__dirname, '../../../packages/grid/x-grid/src'),
        '@material-ui/x-license': path.resolve(__dirname, '../../../packages/x-license/src'),
      },
    };
    return config;
  },
};

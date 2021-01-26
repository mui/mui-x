import path from 'path';
import webpack from 'webpack';
import type { StorybookConfig } from '@storybook/core/types';

const env = process.env.NODE_ENV || 'development';
/* eslint-disable */
const isDevelopment = env === 'development';
const isProduction = env === 'production';
/* eslint-enable */

if (!(isDevelopment || isProduction)) {
  throw new Error(`Unknown env: ${env}.`);
}
console.log(`Loading config for ${env}`);
const maxAssetSize = 1024 * 1024;

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.*'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-storysource', '@storybook/addon-a11y'],
  typescript: {
    check: isDevelopment, // Netlify is breaking the deploy with this settings on. So deactivate on release
  },
  webpackFinal: async (config) => {
    config.devtool = isDevelopment ? 'inline-source-map' : undefined;
    config.parallelism = 1;
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    });
    if (isDevelopment) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../../../packages/grid/'),
      });
    }

    config.module.rules.push({
      test: /\.stories\.tsx?$/,
      loaders: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: {
            parser: 'typescript',
            prettierConfig: { printWidth: 80, singleQuote: true },
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
      },
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          EXPERIMENTAL_ENABLED: JSON.stringify(
            // Set by Netlify
            process.env.PULL_REQUEST === 'false' ? 'false' : 'true',
          ),
        },
      }),
    );

    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 30 * 1024,
        maxSize: maxAssetSize,
      },
    };
    config.performance = {
      maxAssetSize: maxAssetSize,
    };
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        '@material-ui/data-grid': path.resolve(__dirname, '../../../packages/grid/data-grid/src'),
        '@material-ui/x-grid-data-generator': path.resolve(
          __dirname,
          '../../../packages/grid/x-grid-data-generator/src',
        ),
        '@material-ui/x-grid': path.resolve(__dirname, '../../../packages/grid/x-grid/src'),
        '@material-ui/x-license': path.resolve(__dirname, '../../../packages/x-license/src'),
      },
    };
    return config;
  },
};

export default config;

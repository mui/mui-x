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
  core: {
    builder: 'webpack5',
  },
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
      loader: require.resolve('@storybook/source-loader'),
      options: {
        parser: 'typescript',
        prettierConfig: { printWidth: 80, singleQuote: true },
        tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
      },
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
          GRID_EXPERIMENTAL_ENABLED: JSON.stringify(
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
        '@mui/x-data-grid': path.resolve(__dirname, '../../../packages/grid/x-data-grid/src'),
        '@mui/x-data-grid-generator': path.resolve(
          __dirname,
          '../../../packages/grid/x-data-grid-generator/src',
        ),
        '@mui/x-data-grid-pro': path.resolve(
          __dirname,
          '../../../packages/grid/x-data-grid-pro/src',
        ),
        '@mui/x-license-pro': path.resolve(__dirname, '../../../packages/x-license-pro/src'),
      },
    };
    return config;
  },
};

export default config;

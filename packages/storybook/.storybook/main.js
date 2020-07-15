const path = require('path');

const env = process.env.NODE_ENV || 'development'
/* eslint-disable */
const __DEV__ = env === 'development'
const __PROD__ = env === 'production'
/* eslint-enable */

if (!(__DEV__ || __PROD__)) {
  throw new Error(`Unknown env: ${env}.`)
}
console.log(`Loading config for ${env}`)

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
    if(__DEV__) {
      config.module.rules.push({
        test: /\.tsx?|\.js$/,
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
            prettierConfig: { printWidth: 80, singleQuote: false },
            tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
          },
        },
      ],
      enforce: 'pre',
    });

    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};

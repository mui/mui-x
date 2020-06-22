module.exports = {
  stories: ['../src/stories/**/*.stories.*'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-viewport/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-storysource/register',
    '@storybook/addon-a11y/register',
  ],
  webpackFinal: async config => {
    config.devtool = 'inline-source-map';
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.module.rules.push({
      test: /\.tsx?|\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    });

    config.module.rules.push({
      test: /\.stories\.tsx?$/,
      loaders: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: { parser: 'typescript', prettierConfig: { printWidth: 80, singleQuote: false } },
        },
      ],
      enforce: 'pre',
    });

    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};

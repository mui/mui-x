const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const workspaceRoot = path.join(__dirname, '..', '..');

async function getWebpackEntries() {
  return [
    {
      name: '@mui/x-data-grid-premium',
      path: 'packages/x-data-grid-premium/build/index-esm.js',
    },
    {
      name: '@mui/x-data-grid-pro',
      path: 'packages/x-data-grid-pro/build/index-esm.js',
    },
    {
      name: '@mui/x-data-grid',
      path: 'packages/x-data-grid/build/index-esm.js',
    },
    {
      name: '@mui/x-license',
      path: 'packages/x-license/build/esm/index.js',
    },
  ];
}

module.exports = async function webpackConfig(webpack, environment) {
  const analyzerMode = environment.analyze ? 'static' : 'disabled';
  const concatenateModules = !environment.accurateBundles;

  const entries = await getWebpackEntries();
  const configurations = entries.map((entry) => {
    return {
      // ideally this would be computed from the bundles peer dependencies
      externals: /^(react|react-dom|react\/jsx-runtime)$/,
      mode: 'production',
      optimization: {
        concatenateModules,
        minimizer: [
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
          }),
        ],
      },
      output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
      },
      plugins: [
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({
          analyzerMode,
          // We create a report for each bundle so around 120 reports.
          // Opening them all is spam.
          // If opened with `webpack --config . --analyze` it'll still open one new tab though.
          openAnalyzer: false,
          // '[name].html' not supported: https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/12
          reportFilename: `${entry.name}.html`,
        }),
      ],
      resolve: {
        alias: {
          '@mui/x-data-grid': path.join(workspaceRoot, 'packages/x-data-grid/build/index-esm.js'),
          '@mui/x-data-grid-pro': path.join(
            workspaceRoot,
            'packages/x-data-grid-pro/build/index-esm.js',
          ),
          '@mui/x-data-grid-premium': path.join(
            workspaceRoot,
            'packages/x-data-grid-premium/build/index-esm.js',
          ),
          '@mui/x-license': path.join(workspaceRoot, 'packages/x-license/build/esm/index.js'),
        },
      },
      entry: { [entry.name]: path.join(workspaceRoot, entry.path) },
    };
  });

  return configurations;
};

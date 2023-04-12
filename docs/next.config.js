const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const withTM = require('next-transpile-modules')(['@mui/monorepo']);
const withDocsInfra = require('@mui/monorepo/docs/nextConfigDocsInfra');
const pkg = require('../package.json');
const dataGridPkg = require('../packages/grid/x-data-grid/package.json');
const datePickersPkg = require('../packages/x-date-pickers/package.json');
const { findPages } = require('./src/modules/utils/find');
const { LANGUAGES, LANGUAGES_SSR } = require('./config');

const workspaceRoot = path.join(__dirname, '../');

module.exports = withDocsInfra({
  // Avoid conflicts with the other Next.js apps hosted under https://mui.com/
  assetPrefix: process.env.DEPLOY_ENV === 'development' ? undefined : '/x',
  env: {
    ENABLE_AD: process.env.ENABLE_AD,
    LIB_VERSION: pkg.version,
    DATA_GRID_VERSION: dataGridPkg.version,
    DATE_PICKERS_VERSION: datePickersPkg.version,
    FEEDBACK_URL: process.env.FEEDBACK_URL,
    CONTEXT: process.env.CONTEXT,
    // #default-branch-switch
    SOURCE_CODE_ROOT_URL: 'https://github.com/mui/mui-x/blob/master',
    SOURCE_CODE_REPO: 'https://github.com/mui/mui-x',
    GITHUB_TEMPLATE_DOCS_FEEDBACK: '6.docs-feedback.yml',
  },
  webpack: (config, options) => {
    const plugins = config.plugins.slice();

    if (process.env.DOCS_STATS_ENABLED) {
      plugins.push(
        // For all options see https://github.com/th0r/webpack-bundle-analyzer#as-plugin
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          generateStatsFile: true,
          analyzerPort: options.isServer ? 8888 : 8889,
          // Will be available at `.next/stats.json`
          statsFilename: 'stats.json',
        }),
      );
    }

    const includesMonorepo = [/(@mui[\\/]monorepo)$/, /(@mui[\\/]monorepo)[\\/](?!.*node_modules)/];

    return {
      ...config,
      plugins,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          docs: path.resolve(__dirname, '../node_modules/@mui/monorepo/docs'),
          docsx: path.resolve(__dirname, '../docs'),
        },
      },
      module: {
        ...config.module,
        rules: config.module.rules.concat([
          // used in some /getting-started/templates
          {
            test: /\.md$/,
            oneOf: [
              {
                resourceQuery: /@mui\/markdown/,
                use: [
                  options.defaultLoaders.babel,
                  {
                    loader: require.resolve('@mui/monorepo/packages/markdown/loader'),
                    options: {
                      env: {
                        SOURCE_CODE_REPO: options.config.env.SOURCE_CODE_REPO,
                        LIB_VERSION: options.config.env.LIB_VERSION,
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            test: /\.+(js|jsx|mjs|ts|tsx)$/,
            include: includesMonorepo,
            use: options.defaultLoaders.babel,
          },
          {
            test: /\.(js|mjs|ts|tsx)$/,
            include: [workspaceRoot],
            exclude: /node_modules/,
            use: options.defaultLoaders.babel,
          },
          {
            test: /\.(ts|tsx)$/,
            loader: 'string-replace-loader',
            options: {
              search: '__RELEASE_INFO__',
              replace: 'MTU5NjMxOTIwMDAwMA==', // 2020-08-02
            },
          },
        ]),
      },
    };
  },
  // Next.js provides a `defaultPathMap` argument, we could simplify the logic.
  // However, we don't in order to prevent any regression in the `findPages()` method.
  exportPathMap: () => {
    const pages = findPages();
    const map = {};

    function traverse(pages2, userLanguage) {
      const prefix = userLanguage === 'en' ? '' : `/${userLanguage}`;

      pages2.forEach((page) => {
        if (!page.children) {
          map[`${prefix}${page.pathname.replace(/^\/api-docs\/(.*)/, '/api/$1')}`] = {
            page: page.pathname,
            query: {
              userLanguage,
            },
          };
          return;
        }

        traverse(page.children, userLanguage);
      });
    }

    // We want to speed-up the build of pull requests.
    if (process.env.PULL_REQUEST === 'true') {
      // eslint-disable-next-line no-console
      console.log('Considering only English for SSR');
      traverse(pages, 'en');
    } else {
      // eslint-disable-next-line no-console
      console.log('Considering various locales for SSR');
      LANGUAGES_SSR.forEach((userLanguage) => {
        traverse(pages, userLanguage);
      });
    }

    return map;
  },
  rewrites: async () => {
    return [
      { source: `/:lang(${LANGUAGES.join('|')})?/:rest*`, destination: '/:rest*' },
      { source: '/api/:rest*', destination: '/api-docs/:rest*' },
    ];
  },
  // redirects only take effect in the development, not production (because of `next export`).
  redirects: async () => [
    {
      source: '/',
      destination: '/x/introduction/',
      permanent: false,
    },
  ],
});

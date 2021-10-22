const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const withTM = require('next-transpile-modules')(['@material-ui/monorepo']);
const pkg = require('../node_modules/@material-ui/monorepo/package.json');
const { findPages } = require('./src/modules/utils/find');
const { LANGUAGES, LANGUAGES_SSR } = require('./src/modules/constants');

const workspaceRoot = path.join(__dirname, '../');

/**
 * https://github.com/zeit/next.js/blob/287961ed9142a53f8e9a23bafb2f31257339ea98/packages/next/next-server/server/config.ts#L10
 * @typedef {'legacy' | 'blocking' | 'concurrent'} ReactRenderMode
 * legacy - ReactDOM.render(<App />)
 * legacy-strict - ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, Element)
 * blocking - ReactDOM.createSyncRoot(Element).render(<App />)
 * concurrent - ReactDOM.createRoot(Element).render(<App />)
 * @type {ReactRenderMode | 'legacy-strict'}
 */
const reactStrictMode = true;
if (reactStrictMode) {
  // eslint-disable-next-line no-console
  console.log(`Using React.StrictMode.`);
}

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Motivated by https://github.com/zeit/next.js/issues/7687
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  env: {
    COMMIT_REF: process.env.COMMIT_REF,
    CONTEXT: process.env.CONTEXT,
    ENABLE_AD: process.env.ENABLE_AD,
    GITHUB_AUTH: process.env.GITHUB_AUTH,
    LIB_VERSION: pkg.version,
    PULL_REQUEST: process.env.PULL_REQUEST === 'true',
    REACT_STRICT_MODE: reactStrictMode,
    // Set by Netlify
    GRID_EXPERIMENTAL_ENABLED: process.env.PULL_REQUEST === 'false' ? 'false' : 'true',
    SOURCE_CODE_ROOT_URL: 'https://github.com/mui-org/material-ui-x/blob/next',
    SOURCE_CODE_REPO: 'https://github.com/mui-org/material-ui-x',
  },
  webpack5: true,
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

    const includesMonorepo = [
      /(@material-ui[\\/]monorepo)$/,
      /(@material-ui[\\/]monorepo)[\\/](?!.*node_modules)/,
    ];

    return {
      ...config,
      plugins,
      module: {
        ...config.module,
        rules: config.module.rules.concat([
          // used in some /getting-started/templates
          {
            test: /\.md$/,
            oneOf: [
              {
                resourceQuery: /@mui\/markdown/,
                use: require.resolve(
                  '../node_modules/@material-ui/monorepo/docs/packages/markdown/loader',
                ),
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
            test: /\.tsx$/,
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
  trailingSlash: true,
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
  reactStrictMode,
  async rewrites() {
    return [
      { source: `/:lang(${LANGUAGES.join('|')})?/:rest*`, destination: '/:rest*' },
      { source: '/api/:rest*', destination: '/api-docs/:rest*' },
    ];
  },
  redirects:
    process.env.NODE_ENV !== 'production'
      ? async () => [
          {
            source: '/',
            destination: '/components/data-grid/',
            permanent: false,
          },
        ]
      : undefined,
};

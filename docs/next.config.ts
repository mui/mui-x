import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { createRequire } from 'module';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// @ts-expect-error This expected error should be gone once we update the monorepo
// eslint-disable-next-line no-restricted-imports
import withDocsInfra from '@mui/monorepo/docs/nextConfigDocsInfra';
import { findPages } from './src/modules/utils/find';
import { LANGUAGES, LANGUAGES_SSR, LANGUAGES_IGNORE_PAGES, LANGUAGES_IN_PROGRESS } from './config';
import { SOURCE_CODE_REPO, SOURCE_GITHUB_BRANCH } from './constants';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

const WORKSPACE_ROOT = path.resolve(currentDirectory, '../');
const MONOREPO_PATH = path.resolve(WORKSPACE_ROOT, './node_modules/@mui/monorepo');
const MONOREPO_ALIASES = {
  '@mui/docs': path.resolve(MONOREPO_PATH, './packages/mui-docs/src'),
  '@mui/internal-markdown': path.resolve(MONOREPO_PATH, './packages/markdown'),
};

const getWorkspaceAliases = (mode: 'production' | 'development') => {
  const folder = mode === 'production' ? 'build' : 'src';
  return {
    '@mui/x-data-grid': path.resolve(WORKSPACE_ROOT, './packages/x-data-grid', folder),
    '@mui/x-data-grid-generator': path.resolve(
      WORKSPACE_ROOT,
      './packages/x-data-grid-generator',
      folder,
    ),
    '@mui/x-data-grid-pro': path.resolve(WORKSPACE_ROOT, './packages/x-data-grid-pro', folder),
    '@mui/x-data-grid-premium': path.resolve(
      WORKSPACE_ROOT,
      './packages/x-data-grid-premium',
      folder,
    ),
    '@mui/x-date-pickers': path.resolve(WORKSPACE_ROOT, './packages/x-date-pickers', folder),
    '@mui/x-date-pickers-pro': path.resolve(
      WORKSPACE_ROOT,
      './packages/x-date-pickers-pro',
      folder,
    ),
    '@mui/x-charts': path.resolve(WORKSPACE_ROOT, './packages/x-charts', folder),
    '@mui/x-charts-pro': path.resolve(WORKSPACE_ROOT, './packages/x-charts-pro', folder),
    '@mui/x-charts-vendor': path.resolve(WORKSPACE_ROOT, './packages/x-charts-vendor'),
    '@mui/x-tree-view': path.resolve(WORKSPACE_ROOT, './packages/x-tree-view', folder),
    '@mui/x-tree-view-pro': path.resolve(WORKSPACE_ROOT, './packages/x-tree-view-pro', folder),
    '@mui/x-license': path.resolve(WORKSPACE_ROOT, './packages/x-license', folder),
  };
};

function loadPkg(pkgPath: string): { version: string } {
  const pkgContent = fs.readFileSync(path.resolve(WORKSPACE_ROOT, pkgPath, 'package.json'), 'utf8');
  return JSON.parse(pkgContent);
}

const pkg = loadPkg('.');
const dataGridPkg = loadPkg('./packages/x-data-grid');
const datePickersPkg = loadPkg('./packages/x-date-pickers');
const chartsPkg = loadPkg('./packages/x-charts');
const treeViewPkg = loadPkg('./packages/x-tree-view');

let localSettings = {};
try {
  // eslint-disable-next-line import/extensions
  localSettings = require('./next.config.local.js');
} catch (_) {
  // Ignore
}

export default withDocsInfra({
  transpilePackages: [
    // TODO, those shouldn't be needed in the first place
    '@mui/monorepo', // Migrate everything to @mui/docs until the @mui/monorepo dependency becomes obsolete
    '@mui/docs', // needed to fix slashes in the generated links (https://github.com/mui/mui-x/pull/13713#issuecomment-2205591461, )
  ],
  // Avoid conflicts with the other Next.js apps hosted under https://mui.com/
  assetPrefix: process.env.DEPLOY_ENV === 'development' ? undefined : '/x',
  env: {
    // docs-infra
    LIB_VERSION: pkg.version,
    SOURCE_CODE_REPO,
    SOURCE_GITHUB_BRANCH,
    GITHUB_TEMPLATE_DOCS_FEEDBACK: '6.docs-feedback.yml',
    // MUI X related
    DATA_GRID_VERSION: dataGridPkg.version,
    DATE_PICKERS_VERSION: datePickersPkg.version,
    CHARTS_VERSION: chartsPkg.version,
    TREE_VIEW_VERSION: treeViewPkg.version,
  },
  // @ts-ignore
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

    return {
      ...config,
      plugins,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          ...MONOREPO_ALIASES,
          ...getWorkspaceAliases(config.mode),
          // TODO: get rid of this, replace with @mui/docs
          docs: path.resolve(MONOREPO_PATH, './docs'),
          docsx: path.resolve(currentDirectory, '../docs'),
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
                resourceQuery: /muiMarkdown/,
                use: [
                  options.defaultLoaders.babel,
                  {
                    loader: '@mui/internal-markdown/loader',
                    options: {
                      workspaceRoot: WORKSPACE_ROOT,
                      ignoreLanguagePages: LANGUAGES_IGNORE_PAGES,
                      languagesInProgress: LANGUAGES_IN_PROGRESS,
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
            include: [/(@mui[\\/]monorepo)$/, /(@mui[\\/]monorepo)[\\/](?!.*node_modules)/],
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
  distDir: 'export',
  // Next.js provides a `defaultPathMap` argument, we could simplify the logic.
  // However, we don't in order to prevent any regression in the `findPages()` method.
  exportPathMap: () => {
    const pages = findPages();
    const map = {};

    // @ts-ignore
    function traverse(pages2, userLanguage) {
      const prefix = userLanguage === 'en' ? '' : `/${userLanguage}`;

      // @ts-ignore
      pages2.forEach((page) => {
        // The experiments pages are only meant for experiments, they shouldn't leak to production.
        if (page.pathname.includes('/experiments/') && process.env.DEPLOY_ENV === 'production') {
          return;
        }

        if (!page.children) {
          // @ts-ignore
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
  // Used to signal we run build
  ...(process.env.NODE_ENV === 'production'
    ? {
        output: 'export',
      }
    : {
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
      }),
  ...localSettings,
});

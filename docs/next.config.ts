import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as semver from 'semver';
import { createRequire } from 'module';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { withDeploymentConfig } from '@mui/internal-docs-infra/withDocsInfra';
import { findPages } from './src/modules/utils/find';
import { SOURCE_CODE_REPO, SOURCE_GITHUB_BRANCH } from './constants';
import { getPickerAdapterDeps } from './src/modules/utils/getPickerAdapterDeps';
// eslint-disable-next-line import/extensions
import generateReleaseInfo from '../scripts/generateReleaseInfo.mjs';

declare global {
  interface MUIEnv {
    DOCS_STATS_ENABLED?: string;
    PULL_REQUEST?: string;
    PICKERS_ADAPTERS_DEPS?: string;
    LIB_VERSION?: string;
    SOURCE_CODE_REPO?: string;
    SOURCE_GITHUB_BRANCH?: string;
    GITHUB_TEMPLATE_DOCS_FEEDBACK?: string;
    DATA_GRID_VERSION?: string;
    DATE_PICKERS_VERSION?: string;
    CHARTS_VERSION?: string;
    TREE_VIEW_VERSION?: string;
    SCHEDULER_VERSION?: string;
    CHAT_VERSION?: string;
  }
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

const require = createRequire(import.meta.url);

const WORKSPACE_ROOT = path.resolve(currentDirectory, '../');

function loadPkg(pkgPath: string): { version: string } {
  const pkgContent = fs.readFileSync(path.resolve(WORKSPACE_ROOT, pkgPath, 'package.json'), 'utf8');
  return JSON.parse(pkgContent);
}

const pkg = loadPkg('.');
const dataGridPkg = loadPkg('./packages/x-data-grid');
const datePickersPkg = loadPkg('./packages/x-date-pickers');
const chartsPkg = loadPkg('./packages/x-charts');
const treeViewPkg = loadPkg('./packages/x-tree-view');
const schedulerPkg = loadPkg('./packages/x-scheduler');
const chatPkg = loadPkg('./packages/x-chat');

const pickersAdaptersDeps = getPickerAdapterDeps();

// Generated once and shared by both the webpack and turbopack pipelines.
const releaseInfo = generateReleaseInfo();

// Serializable markdown-loader options, shared by webpack and turbopack.
// `ignoreLanguagePages` (a function) is added only on the webpack side since
// turbopack requires loader options to be serializable.
const markdownLoaderOptions = {
  workspaceRoot: WORKSPACE_ROOT,
  languagesInProgress: [],
  env: {
    SOURCE_CODE_REPO,
    LIB_VERSION: pkg.version,
  },
};

// `string-replace-loader` rules applied to all first-party `.ts`/`.tsx` files.
// All `search` values are strings (not RegExp), keeping the options serializable
// for turbopack.
const stringReplaceRules = [
  {
    search: '__RELEASE_INFO__',
    replace: releaseInfo,
    flags: 'g',
  },
  {
    search: '__ALLOW_TEST_LICENSES__',
    replace: 'false',
    flags: 'g',
  },
  {
    search: String.raw`\(process\.env\s*(as any\s*)?\)\.MUI_VERSION`,
    replace: JSON.stringify(pkg.version),
    flags: 'g',
  },
];

let localSettings = {};
try {
  // eslint-disable-next-line import/extensions
  localSettings = require('./next.config.local.js');
} catch (_) {
  // Ignore
}

export default withDeploymentConfig({
  reactStrictMode: true,
  experimental: {
    esmExternals: undefined,
    // Run each webpack compilation in a separate, disposable worker process so
    // its memory is released before static generation instead of accumulating
    // in the long-lived build process. This is off by default whenever a custom
    // `webpack` config is present (Next resolves the `undefined` default to
    // `false` when `config.webpack` is set), so it must be enabled explicitly.
    // Cuts peak docs-build RSS from ~10 GB to ~4 GB, keeping it well under the
    // Netlify build container limit that the static export was hitting.
    webpackBuildWorker: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  transpilePackages: [
    // This is needed because the package has next.js imports like `next/script` that need to be transpiled.
    '@mui/internal-core-docs',
  ],
  // Avoid conflicts with the other Next.js apps hosted under https://mui.com/
  assetPrefix: process.env.DEPLOY_ENV === 'development' ? undefined : '/x',
  env: {
    // docs-infra
    LIB_VERSION: pkg.version,
    SEARCH_INDEX: `material-ui-v${semver.major(pkg.version)}`,
    SOURCE_CODE_REPO,
    SOURCE_GITHUB_BRANCH,
    GITHUB_TEMPLATE_DOCS_FEEDBACK: '6.docs-feedback.yml',
    // MUI X related
    DATA_GRID_VERSION: dataGridPkg.version,
    DATE_PICKERS_VERSION: datePickersPkg.version,
    CHARTS_VERSION: chartsPkg.version,
    TREE_VIEW_VERSION: treeViewPkg.version,
    SCHEDULER_VERSION: schedulerPkg.version,
    CHAT_VERSION: chatPkg.version,
    PICKERS_ADAPTERS_DEPS: JSON.stringify(pickersAdaptersDeps),
    MUI_CHAT_API_BASE_URL: 'https://chat-backend.mui.com',
    MUI_CHAT_SCOPES: 'x-data-grid,x-date-pickers,x-charts,x-tree-view',
  },
  turbopack: {
    resolveExtensions: ['.mjs', '.tsx', '.ts', '.jsx', '.js', '.json'],
    rules: {
      // `.md?muiMarkdown` → markdown loader (mirrors the webpack `oneOf` branch).
      // `as: '*.js'` hands the emitted JS back to turbopack's own pipeline.
      '*.md': [
        {
          condition: { query: /[?&]muiMarkdown(?=&|$)/ },
          loaders: [{ loader: '@mui/internal-markdown/loader', options: markdownLoaderOptions }],
          as: '*.js',
        },
      ],
      // Token replacement that webpack does via `string-replace-loader`.
      // `{ not: 'foreign' }` keeps it off node_modules; the tokens only live in
      // first-party source (`docs/` and `packages/*/src`).
      '*.{ts,tsx}': [
        {
          condition: { not: 'foreign' },
          loaders: [{ loader: 'string-replace-loader', options: { multiple: stringReplaceRules } }],
        },
      ],
      // API page description JSON (imported only by generated API pages) → render
      // the markdown to HTML at build time.
      '**/translations/api-docs/**/*.json': [
        {
          loaders: [{ loader: '@mui/internal-markdown/apiPageTranslationLoader' }],
          as: '*.js',
        },
      ],
    },
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
                      ...markdownLoaderOptions,
                      // Function form is allowed under webpack; turbopack requires
                      // serializable options so it's omitted there.
                      ignoreLanguagePages: () => false,
                    },
                  },
                ],
              },
            ],
          },
          {
            test: /\.(ts|tsx)$/,
            loader: 'string-replace-loader',
            options: {
              multiple: stringReplaceRules,
            },
          },
          {
            // API page description JSON (`translations/api-docs/**`, imported only by
            // generated API pages) → render the markdown to HTML at build time.
            test: /translations[\\/]api-docs[\\/].*\.json$/,
            type: 'javascript/auto',
            use: [{ loader: '@mui/internal-markdown/apiPageTranslationLoader' }],
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
    function traverse(pages2) {
      // @ts-ignore
      pages2.forEach((page) => {
        // The experiments pages are only meant for experiments, they shouldn't leak to production.
        if (page.pathname.includes('/experiments/') && process.env.DEPLOY_ENV === 'production') {
          return;
        }

        if (!page.children) {
          // @ts-ignore
          map[page.pathname.replace(/^\/api-docs\/(.*)/, '/api/$1')] = {
            page: page.pathname,
          };
          return;
        }

        traverse(page.children);
      });
    }

    traverse(pages);

    return map;
  },
  // Used to signal we run build
  ...(IS_PRODUCTION
    ? {
        output: 'export',
      }
    : {
        rewrites: async () => {
          return [{ source: '/api/:rest*', destination: '/api-docs/:rest*' }];
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

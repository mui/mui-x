import {
  baseSpecRules,
  createBaseConfig,
  createDocsConfig,
  createTestConfig,
  EXTENSION_TEST_FILE,
  EXTENSION_TS,
} from '@mui/internal-code-infra/eslint';
import eslintPluginConsistentName from 'eslint-plugin-consistent-default-export-name';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import eslintPluginMuiX from 'eslint-plugin-mui-x';
import { defineConfig } from 'eslint/config';
import * as path from 'node:path';
import * as url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const CHARTS_PACKAGES = ['x-charts', 'x-charts-pro', 'x-charts-premium'];
const GRID_PACKAGES = [
  'x-data-grid',
  'x-data-grid-pro',
  'x-data-grid-premium',
  'x-data-grid-generator',
];
const PICKERS_PACKAGES = ['x-date-pickers', 'x-date-pickers-pro'];
const TREE_VIEW_PACKAGES = ['x-tree-view', 'x-tree-view-pro'];
const SCHEDULER_PACKAGES = ['x-scheduler', 'x-scheduler-headless'];

// Enable React Compiler Plugin rules globally
const ENABLE_REACT_COMPILER_PLUGIN = process.env.ENABLE_REACT_COMPILER_PLUGIN ?? false;

// Enable React Compiler Plugin rules per package
const ENABLE_REACT_COMPILER_PLUGIN_CHARTS = process.env.ENABLE_REACT_COMPILER_PLUGIN_CHARTS ?? true;
const ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID ?? false;
const ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS ?? false;
const ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW ?? true;
const ENABLE_REACT_COMPILER_PLUGIN_SCHEDULER =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_SCHEDULER ?? true;

const isAnyReactCompilerPluginEnabled =
  ENABLE_REACT_COMPILER_PLUGIN ||
  ENABLE_REACT_COMPILER_PLUGIN_CHARTS ||
  ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID ||
  ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS ||
  ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW ||
  ENABLE_REACT_COMPILER_PLUGIN_SCHEDULER;

/**
 * @param {Object[]} packageInfo
 * @param {string[]} packageInfo.packagesNames
 * @param {boolean} packageInfo.isEnabled
 */
function getReactCompilerFilesForPackages(packageInfo) {
  return packageInfo
    .filter((pkg) => pkg.isEnabled)
    .flatMap((pkg) =>
      pkg.packagesNames.map((packageName) => `packages/${packageName}/src/**/*${EXTENSION_TS}`),
    );
}

const RESTRICTED_TOP_LEVEL_IMPORTS = [
  '@mui/material',
  '@mui/utils',
  '@mui/x-charts',
  '@mui/x-charts-pro',
  '@mui/x-charts-premium',
  '@mui/x-codemod',
  '@mui/x-date-pickers',
  '@mui/x-date-pickers-pro',
  '@mui/x-tree-view',
  '@mui/x-tree-view-pro',
  '@mui/x-scheduler',
  '@mui/x-scheduler-headless',
];

const packageFilesWithReactCompiler = getReactCompilerFilesForPackages([
  {
    packagesNames: CHARTS_PACKAGES,
    isEnabled: ENABLE_REACT_COMPILER_PLUGIN_CHARTS,
  },
  {
    packagesNames: GRID_PACKAGES,
    isEnabled: ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID,
  },
  {
    packagesNames: PICKERS_PACKAGES,
    isEnabled: ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS,
  },
  {
    packagesNames: TREE_VIEW_PACKAGES,
    isEnabled: ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW,
  },
  {
    packagesNames: SCHEDULER_PACKAGES,
    isEnabled: ENABLE_REACT_COMPILER_PLUGIN_SCHEDULER,
  },
]);

export default defineConfig(
  createBaseConfig({
    baseDirectory: dirname,
    enableReactCompiler: isAnyReactCompilerPluginEnabled,
  }),
  {
    name: 'MUI X Overrides',
    files: [`**/*${EXTENSION_TS}`],
    plugins: {
      jsdoc: eslintPluginJsdoc,
      'mui-x': eslintPluginMuiX,
      'consistent-default-export-name': eslintPluginConsistentName,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-redeclare': 'error',
      'material-ui/straight-quotes': 'error',
      // turn off global react compiler plugin as it's controlled per package on this repo
      'react-compiler/react-compiler': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-relative-packages': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            ...CHARTS_PACKAGES,
            ...PICKERS_PACKAGES,
            ...TREE_VIEW_PACKAGES,
            ...SCHEDULER_PACKAGES,
          ].map((packageName) => ({
            target: `./packages/${packageName}/src/**/!(*.test.*|*.spec.*)`,
            from: `./packages/${packageName}/src/internals/index.ts`,
            message: `Use a more specific import instead. E.g. import { MyInternal } from '../internals/MyInternal';`,
          })),
        },
      ],
      'no-restricted-imports': 'off',
      // TODO move to @mui/internal-code-infra/eslint
      'jsdoc/require-param': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/require-param-type': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/require-param-name': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/require-param-description': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/require-returns': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/require-returns-type': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/require-returns-description': ['error', { contexts: ['TSFunctionType'] }],
      'jsdoc/no-bad-blocks': [
        'error',
        {
          ignore: [
            'ts-check',
            'ts-expect-error',
            'ts-ignore',
            'ts-nocheck',
            'typescript-to-proptypes-ignore',
          ],
        },
      ],
      // Fixes false positive when using both `inputProps` and `InputProps` on the same example
      // See https://stackoverflow.com/questions/42367236/why-am-i-getting-this-warning-no-duplicate-props-allowed-react-jsx-no-duplicate
      // TODO move to @mui/internal-code-infra/eslint
      // TODO Fix <Input> props names to not conflict
      'react/jsx-no-duplicate-props': ['warn', { ignoreCase: false }],
      // TODO move to @mui/internal-code-infra/eslint, these are false positive
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      // migration rules
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/exhaustive-deps': [
        'error',
        {
          additionalHooks: '(useEnhancedEffect|useIsoLayoutEffect|useEffectAfterFirstRender)',
        },
      ],
      'react-hooks/immutability': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  // Test start
  {
    files: [
      // matching the pattern of the test runner
      `**/*${EXTENSION_TEST_FILE}`,
    ],
    extends: createTestConfig({ useMocha: false, useVitest: true }),
    ignores: ['test/e2e/**/*', 'test/regressions/**/*'],
    rules: {
      // Doesn't work reliantly with chai style .to.deep.equal (replace with .toEqual?)
      'vitest/valid-expect': 'off',
      // Annoying auto-fix
      'vitest/no-focused-tests': 'off',
    },
  },
  {
    files: [
      // TODO: Fix one-by-one
      `packages/x-data-grid{,-*}/**/*${EXTENSION_TEST_FILE}`,
      `packages/x-date-pickers{,-*}/**/*${EXTENSION_TEST_FILE}`,
      `packages/x-internals{,-*}/**/*${EXTENSION_TEST_FILE}`,
      `packages/x-scheduler{,-*}/**/*${EXTENSION_TEST_FILE}`,
    ],
    rules: {
      // Can't unambiguously detect all patterns of adding expects
      'vitest/expect-expect': 'off',
      'vitest/no-standalone-expect': 'off',
    },
  },
  baseSpecRules,
  {
    files: [`packages/x-charts{,-*}/**/*${EXTENSION_TS}`],
    rules: {
      'import/no-cycle': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
  {
    files: [`**/*${EXTENSION_TEST_FILE}`, `test/**/*${EXTENSION_TS}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['@testing-library/react', 'test/utils/index'],
        },
      ],
      'compat/compat': 'off',
    },
  },

  {
    files: [
      'packages/x-data-grid/**/*{.tsx,.ts,.js}',
      'packages/x-data-grid-pro/**/*{.tsx,.ts,.js}',
      'packages/x-data-grid-premium/**/*{.tsx,.ts,.js}',
      'docs/src/pages/**/*.tsx',
    ],
    rules: {
      'mui-x/no-direct-state-access': 'error',
    },
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: dirname,
        project: ['./tsconfig.json'],
      },
    },
  },

  // TODO remove, shouldn't disable prop-type generation rule.
  // lot of public components are missing it.
  {
    files: ['**/*.tsx'],
    ignores: ['**/*.spec.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },

  {
    files: [`packages/*/src/**/*${EXTENSION_TS}`],
    ignores: ['**/*.d.ts', `**/*.spec${EXTENSION_TS}`, `**/*.test${EXTENSION_TS}`],
    rules: {
      'material-ui/mui-name-matches-component-name': [
        'error',
        {
          customHooks: [
            'useDatePickerProcessedProps',
            'useDatePickerDefaultizedProps',
            'useTimePickerDefaultizedProps',
            'useDateTimePickerDefaultizedProps',
            'useDateRangePickerDefaultizedProps',
            'useDateTimeRangePickerDefaultizedProps',
            'useTimeRangePickerDefaultizedProps',
            'useDateCalendarDefaultizedProps',
            'useMonthCalendarDefaultizedProps',
            'useYearCalendarDefaultizedProps',
            'useDateRangeCalendarDefaultizedProps',
          ],
        },
      ],
      'material-ui/disallow-react-api-in-server-components': 'error',
    },
  },

  // Common config from core start
  {
    files: [`docs/**/*${EXTENSION_TS}`],
    extends: createDocsConfig(),
    rules: {
      '@next/next/no-img-element': 'off',
      'react/jsx-filename-extension': 'off',
    },
  },
  {
    files: [`test/regressions/**/*${EXTENSION_TS}`],
    rules: {
      'react/jsx-filename-extension': 'off',
    },
  },

  {
    files: [`docs/src/pages/**/*${EXTENSION_TS}`, `docs/data/**/*${EXTENSION_TS}`],
    rules: {
      // This most often reports data that is defined after the component definition.
      // This is safe to do and helps readability of the demo code since the data is mostly irrelevant.
      '@typescript-eslint/no-use-before-define': 'off',
      'react/prop-types': 'off',
      'no-alert': 'off',
      'no-console': 'off',
    },
  },

  {
    files: [`docs/data/**/*${EXTENSION_TS}`],
    ignores: [
      // filenames/match-exported sees filename as 'file-name.d'
      // Plugin looks unmaintain, find alternative? (e.g. eslint-plugin-project-structure)
      '**/*.d.ts',
      'docs/data/**/{css,system,tailwind}/*',
    ],
    plugins: {
      'consistent-default-export-name': eslintPluginConsistentName,
    },
    rules: {
      'consistent-default-export-name/default-export-match-filename': ['error'],
    },
  },

  // Next.js entry points pages
  {
    files: [`docs/pages/**/*${EXTENSION_TS}`],
    rules: {
      'react/prop-types': 'off',
    },
  },
  // Common config from core end

  {
    files: [
      `docs/**/*${EXTENSION_TS}`,
      `packages/*/src/**/*.test${EXTENSION_TS}`,
      `packages/*/src/**/*.spec${EXTENSION_TS}`,
    ],
    ignores: ['**/*.d.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: RESTRICTED_TOP_LEVEL_IMPORTS.map((name) => ({
            name,
            message: 'Use deeper import instead',
          })),
          patterns: [
            {
              group: [
                '@mui/*/*/*',
                // Allow any import depth with any internal packages
                '!@mui/internal-*/**',

                // Exceptions (QUESTION: Keep or remove?)
                '!@mui/x-data-grid/internals/demo',
                '!@mui/x-date-pickers/internals/demo',
                // TODO: export this from /ButtonBase in core. This will break after we move to package exports
                '!@mui/material/ButtonBase/TouchRipple',
                /* Module augmentation for feature flags in Charts. Users should be able to pick the features they need.
                 * so it's useful to allow deeper imports */
                '!@mui/x-charts*/moduleAugmentation/*',
              ],
              message: 'Use less deep import instead',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['packages/x-telemetry/**/*{.tsx,.ts,.js}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: [
      'packages/x-scheduler/**/*{.tsx,.ts,.js}',
      'packages/x-scheduler-headless/**/*{.tsx,.ts,.js}',
    ],
    rules: {
      // Base UI lint rules
      '@typescript-eslint/no-redeclare': 'off',
      'import/export': 'off',
      'material-ui/straight-quotes': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
  ...[
    'x-charts',
    'x-charts-pro',
    'x-charts-premium',
    'x-codemod',
    'x-data-grid',
    'x-data-grid-pro',
    'x-data-grid-premium',
    'x-data-grid-generator',
    'x-date-pickers',
    'x-date-pickers-pro',
    'x-scheduler',
    'x-scheduler-headless',
    'x-tree-view',
    'x-tree-view-pro',
    'x-license',
    'x-telemetry',
  ].map((pkgName) => ({
    files: [`packages/${pkgName}/src/**/*${EXTENSION_TS}`],
    ignores: ['**/*.d.ts', '**/*.spec{.ts,.tsx}', '**/*.test{.ts,.tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            ...RESTRICTED_TOP_LEVEL_IMPORTS.map((pkName) => ({
              name: pkName,
              message: 'Use relative import instead',
            })),
            {
              name: '@mui/x-charts-vendor/d3-scale',
              importNames: ['scaleBand', 'scalePoint'],
              message:
                'Use the scaleBand and scalePoint implementations from @mui/x-charts/internals/scales instead',
            },
          ],
          patterns: [
            {
              group: ['@mui/*/*/*'],
              message: 'Use less deep import instead',
            },
            {
              group: [`@mui/${pkgName}/*`, `@mui/${pkgName}/**`],
              message: 'Use relative import instead',
            },
          ],
        },
      ],
    },
  })),
  ...[
    packageFilesWithReactCompiler.length > 0
      ? {
          files: packageFilesWithReactCompiler,
          rules: {
            'react-compiler/react-compiler': 'error',
          },
        }
      : {},
  ],

  // We can't use the react-compiler plugin in the base-ui-utils folder because the Base UI team doesn't use it yet.
  {
    files: ['packages/x-scheduler-headless/src/base-ui-copy/**/*{.tsx,.ts,.js}'],
    rules: {
      'react-compiler/react-compiler': 'off',
    },
  },

  {
    // TODO: typescript namespaces found to be harmful. Refactor to different patterns. More info: https://github.com/mui/mui-x/pull/19071
    files: [
      `packages/x-scheduler/src/**/*${EXTENSION_TS}`,
      `packages/x-scheduler-headless/src/**/*${EXTENSION_TS}`,
      `packages/x-virtualizer/src/**/*${EXTENSION_TS}`,
    ],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },
);

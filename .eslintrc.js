const baseline = require('@mui/monorepo/.eslintrc');
const path = require('path');

const chartsPackages = ['x-charts', 'x-charts-pro'];

const dataGridPackages = [
  'x-data-grid',
  'x-data-grid-pro',
  'x-data-grid-premium',
  'x-data-grid-generator',
];

const datePickersPackages = ['x-date-pickers', 'x-date-pickers-pro'];

const treeViewPackages = ['x-tree-view', 'x-tree-view-pro'];

// Enable React Compiler Plugin rules globally
const ENABLE_REACT_COMPILER_PLUGIN = process.env.ENABLE_REACT_COMPILER_PLUGIN ?? false;

// Enable React Compiler Plugin rules per package
const ENABLE_REACT_COMPILER_PLUGIN_CHARTS = process.env.ENABLE_REACT_COMPILER_PLUGIN_CHARTS ?? true;
const ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID ?? false;
const ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS ?? false;
const ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW =
  process.env.ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW ?? false;

const isAnyReactCompilerPluginEnabled =
  ENABLE_REACT_COMPILER_PLUGIN ||
  ENABLE_REACT_COMPILER_PLUGIN_CHARTS ||
  ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID ||
  ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS ||
  ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW;

const addReactCompilerRule = (packagesNames, isEnabled) =>
  !isEnabled
    ? []
    : packagesNames.map((packageName) => ({
        files: [`packages/${packageName}/src/**/*{.ts,.tsx,.js}`],
        rules: {
          'react-compiler/react-compiler': 'error',
        },
      }));

const RESTRICTED_TOP_LEVEL_IMPORTS = [
  '@mui/material',
  '@mui/x-charts',
  '@mui/x-charts-pro',
  '@mui/x-codemod',
  '@mui/x-date-pickers',
  '@mui/x-date-pickers-pro',
  '@mui/x-tree-view',
  '@mui/x-tree-view-pro',
];

// TODO move this helper to @mui/monorepo/.eslintrc
// It needs to know about the parent "no-restricted-imports" to not override them.
const buildPackageRestrictedImports = (packageName, root, allowRootImports = true) => [
  {
    files: [`packages/${root}/src/**/*{.ts,.tsx,.js}`],
    excludedFiles: ['*.d.ts', '*.spec.ts', '*.spec.tsx', '**.test.tx', '**.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: packageName,
              message: 'Use relative import instead',
            },
            {
              name: '@mui/material',
              message: 'Use @mui/utils or a more specific import instead',
            },
          ],
          patterns: [
            // TODO move rule into main repo to allow deep @mui/monorepo imports
            {
              group: ['@mui/*/*/*'],
              message: 'Use less deep import instead',
            },
            {
              group: [`${packageName}/*`, `${packageName}/**`],
              message: 'Use relative import instead',
            },
          ],
        },
      ],
    },
  },
  ...(allowRootImports
    ? []
    : [
        {
          files: [
            `packages/${root}/src/**/*.test{.ts,.tsx,.js}`,
            `packages/${root}/src/**/*.spec{.ts,.tsx,.js}`,
          ],
          excludedFiles: ['*.d.ts'],
          rules: {
            'no-restricted-imports': [
              'error',
              {
                paths: RESTRICTED_TOP_LEVEL_IMPORTS.map((name) => ({
                  name,
                  message: 'Use deeper import instead',
                })),
              },
            ],
          },
        },
      ]),
];

module.exports = {
  ...baseline,
  plugins: [
    ...baseline.plugins,
    'eslint-plugin-jsdoc',
    ...(isAnyReactCompilerPluginEnabled ? ['eslint-plugin-react-compiler'] : []),
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, './webpackBaseConfig.js'),
      },
    },
  },
  /**
   * Sorted alphanumerically within each group. built-in and each plugin form
   * their own groups.
   */
  rules: {
    ...baseline.rules,
    ...(ENABLE_REACT_COMPILER_PLUGIN ? { 'react-compiler/react-compiler': 'error' } : {}),
    // TODO move to @mui/monorepo, codebase is moving away from default exports https://github.com/mui/material-ui/issues/21862
    'import/prefer-default-export': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [...chartsPackages, ...datePickersPackages, ...treeViewPackages].map(
          (packageName) => ({
            target: `./packages/${packageName}/src/**/!(*.test.*|*.spec.*)`,
            from: `./packages/${packageName}/src/internals/index.ts`,
            message: `Use a more specific import instead. E.g. import { MyInternal } from '../internals/MyInternal';`,
          }),
        ),
      },
    ],
    // TODO move rule into the main repo once it has upgraded
    '@typescript-eslint/return-await': 'off',
    'no-restricted-imports': 'off',
    // TODO move to @mui/monorepo/.eslintrc
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
    // TODO move to @mui/monorepo/.eslintrc
    // TODO Fix <Input> props names to not conflict
    'react/jsx-no-duplicate-props': [1, { ignoreCase: false }],
    // TODO move to @mui/monorepo/.eslintrc, these are false positive
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
  },
  overrides: [
    ...baseline.overrides,
    {
      files: [
        // matching the pattern of the test runner
        '*.test.js',
        '*.test.ts',
        '*.test.tsx',
      ],
      excludedFiles: ['test/e2e/**/*', 'test/regressions/**/*'],
      extends: ['plugin:testing-library/react'],
      rules: {
        'testing-library/no-container': 'off',
      },
    },
    {
      files: [
        // matching the pattern of the test runner
        '*.test.js',
        '*.test.ts',
        '*.test.tsx',
        'test/**',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@testing-library/react', 'test/utils/index'],
          },
        ],
      },
    },
    {
      files: [
        'packages/x-data-grid/**/*{.tsx,.ts,.js}',
        'packages/x-data-grid-pro/**/*{.tsx,.ts,.js}',
        'packages/x-data-grid-premium/**/*{.tsx,.ts,.js}',
        'docs/src/pages/**/*.tsx',
      ],
      excludedFiles: [
        'packages/x-data-grid/src/themeAugmentation/index.js', // TypeScript ignores JS files with the same name as the TS file
        'packages/x-data-grid-pro/src/themeAugmentation/index.js',
        'packages/x-data-grid-premium/src/themeAugmentation/index.js',
      ],
      rules: {
        'material-ui/no-direct-state-access': 'error',
      },
      parserOptions: { tsconfigRootDir: __dirname, project: ['./tsconfig.json'] },
    },
    // TODO remove, shouldn't disable prop-type generation rule.
    // lot of public components are missing it.
    {
      files: ['*.tsx'],
      excludedFiles: '*.spec.tsx',
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['**/*.mjs'],
      rules: {
        'import/extensions': ['error', 'ignorePackages'],
      },
    },
    {
      files: ['packages/*/src/**/*{.ts,.tsx,.js}'],
      excludedFiles: ['*.d.ts', '*.spec.ts', '*.spec.tsx'],
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
              'useDateCalendarDefaultizedProps',
              'useMonthCalendarDefaultizedProps',
              'useYearCalendarDefaultizedProps',
              'useDateRangeCalendarDefaultizedProps',
            ],
          },
        ],
      },
    },
    {
      files: ['docs/**/*{.ts,.tsx,.js}'],
      excludedFiles: ['*.d.ts'],
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
                  '!@mui/x-date-pickers/internals/demo',
                  '!@mui/x-tree-view/hooks/useTreeViewApiRef',
                  // TODO: export this from /ButtonBase in core. This will break after we move to package exports
                  '!@mui/material/ButtonBase/TouchRipple',
                ],
                message: 'Use less deep import instead',
              },
            ],
          },
        ],
      },
    },
    ...buildPackageRestrictedImports('@mui/x-charts', 'x-charts', false),
    ...buildPackageRestrictedImports('@mui/x-charts-pro', 'x-charts-pro', false),
    ...buildPackageRestrictedImports('@mui/x-codemod', 'x-codemod', false),
    ...buildPackageRestrictedImports('@mui/x-data-grid', 'x-data-grid'),
    ...buildPackageRestrictedImports('@mui/x-data-grid-pro', 'x-data-grid-pro'),
    ...buildPackageRestrictedImports('@mui/x-data-grid-premium', 'x-data-grid-premium'),
    ...buildPackageRestrictedImports('@mui/x-data-grid-generator', 'x-data-grid-generator'),
    ...buildPackageRestrictedImports('@mui/x-date-pickers', 'x-date-pickers', false),
    ...buildPackageRestrictedImports('@mui/x-date-pickers-pro', 'x-date-pickers-pro', false),
    ...buildPackageRestrictedImports('@mui/x-tree-view', 'x-tree-view', false),
    ...buildPackageRestrictedImports('@mui/x-tree-view-pro', 'x-tree-view-pro', false),
    ...buildPackageRestrictedImports('@mui/x-license', 'x-license'),

    ...addReactCompilerRule(chartsPackages, ENABLE_REACT_COMPILER_PLUGIN_CHARTS),
    ...addReactCompilerRule(dataGridPackages, ENABLE_REACT_COMPILER_PLUGIN_DATA_GRID),
    ...addReactCompilerRule(datePickersPackages, ENABLE_REACT_COMPILER_PLUGIN_DATE_PICKERS),
    ...addReactCompilerRule(treeViewPackages, ENABLE_REACT_COMPILER_PLUGIN_TREE_VIEW),
  ],
};

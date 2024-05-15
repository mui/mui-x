const baseline = require('@mui/monorepo/.eslintrc');
const path = require('path');

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
            'docs/data/**/*{.ts,.tsx,.js}',
          ],
          excludedFiles: ['*.d.ts'],
          rules: {
            'no-restricted-imports': [
              'error',
              {
                paths: [
                  {
                    name: '@mui/x-charts',
                    message: 'Use deeper import instead',
                  },
                  {
                    name: '@mui/x-codemod',
                    message: 'Use deeper import instead',
                  },
                  {
                    name: '@mui/x-date-pickers',
                    message: 'Use deeper import instead',
                  },
                  {
                    name: '@mui/x-date-pickers-pro',
                    message: 'Use deeper import instead',
                  },
                  {
                    name: '@mui/x-tree-view',
                    message: 'Use deeper import instead',
                  },
                  {
                    name: '@mui/x-tree-view-pro',
                    message: 'Use deeper import instead',
                  },
                ],
              },
            ],
          },
        },
      ]),
];

module.exports = {
  ...baseline,
  plugins: [...baseline.plugins, 'eslint-plugin-jsdoc'],
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
    // TODO move to @mui/monorepo/.eslintrc, codebase is moving away from default exports
    'import/prefer-default-export': 'off',
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
    // TOOD move to @mui/monorepo/.eslintrc, these are false positive
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
    ...buildPackageRestrictedImports('@mui/x-charts', 'x-charts', false),
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
  ],
};

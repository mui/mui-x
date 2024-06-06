const baseline = require('@mui/monorepo/.eslintrc');
const path = require('path');

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

    // Rules only impacting bundled files and doc files
    {
      files: ['packages/*/src/**/*{.ts,.tsx,.js}', 'docs/data/**/*{.ts,.tsx,.js}'],
      excludedFiles: ['*.d.ts', '**/*.test.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@mui/*/*/*'],
                message: 'Use less deep import instead',
              },
            ],
          },
        ],
      },
    },

    // Rules only impacting bundled files, test files and doc files
    {
      files: ['packages/*/src/**/*{.ts,.tsx,.js}', 'docs/data/**/*{.ts,.tsx,.js}'],
      excludedFiles: ['*.d.ts'],
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
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@mui/x-charts',
                message: 'Use deeper import instead',
              },
              {
                name: '@mui/x-charts-pro',
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
              {
                name: '@mui/material',
                message: 'Use deeper import instead',
              },
              {
                name: '@mui/utils',
                message: 'Use deeper import instead',
              },
            ],
          },
        ],
      },
    },
  ],
};

const baseline = require('@mui/monorepo/.eslintrc');
const path = require('path');

module.exports = {
  ...baseline,
  plugins: [...baseline.plugins, 'jsdoc', 'filenames'],
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
    'import/prefer-default-export': 'off',
    // TODO move rule into the main repo once it has upgraded
    '@typescript-eslint/return-await': 'off',
    // TODO move rule into main repo to allow deep @mui/monorepo imports
    'no-restricted-imports': 'off',
    'jsdoc/require-param': ['error', { contexts: ['TSFunctionType'] }],
    'jsdoc/require-param-type': ['error', { contexts: ['TSFunctionType'] }],
    'jsdoc/require-param-name': ['error', { contexts: ['TSFunctionType'] }],
    'jsdoc/require-param-description': ['error', { contexts: ['TSFunctionType'] }],
    'jsdoc/require-returns': ['error', { contexts: ['TSFunctionType'] }],
    'jsdoc/require-returns-type': ['error', { contexts: ['TSFunctionType'] }],
    'jsdoc/require-returns-description': ['error', { contexts: ['TSFunctionType'] }],
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
      files: ['packages/grid/**/*.ts', 'packages/grid/**/*.js', 'docs/src/pages/**/*.tsx'],
      excludedFiles: [
        'packages/grid/x-data-grid/src/themeAugmentation/index.js', // TypeScript ignores JS files with the same name as the TS file
        'packages/grid/x-data-grid-pro/src/themeAugmentation/index.js',
      ],
      rules: {
        'material-ui/no-direct-state-access': 'error',
      },
      parserOptions: { tsconfigRootDir: __dirname, project: ['./tsconfig.json'] },
    },
    {
      files: ['docs/src/pages/components/**/*.js', 'docs/src/pages/components/**/*.tsx'],
      rules: {
        'filenames/match-exported': ['error'],
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
            ],
          },
        ],
      },
    },
    {
      files: ['packages/x-pickers/src/**/*{.ts,.tsx,.js}'],
      excludedFiles: ['*.d.ts', '*.spec.ts', '*.spec.tsx', '**.test.tx', '**.test.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@mui/x-pickers'],
            patterns: ['@mui/x-pickers/*'],
          },
        ],
      },
    },
    {
      files: ['packages/x-pickers-pro/src/**/*{.ts,.tsx,.js}'],
      excludedFiles: ['*.d.ts', '*.spec.ts', '*.spec.tsx', '**.test.tx', '**.test.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: ['@mui/x-pickers-pro'],
            patterns: ['@mui/x-pickers-pro/*'],
          },
        ],
      },
    },
    {
      files: ['packages/grid/**/*{.ts,.tsx,.js}'],
      excludedFiles: [
        'packages/grid/x-data-grid-generator/**',
        '*.d.ts',
        '*.spec.ts',
        '*.spec.tsx',
        '**.test.tx',
        '**.test.tsx',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@mui/base',
                message: 'Use @mui/material instead',
              },
            ],
            patterns: [
              {
                group: ['@mui/base/*'],
                message: 'Use @mui/material instead',
              },
            ],
          },
        ],
      },
    },
  ],
};

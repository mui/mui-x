const baseline = require('@mui/monorepo/.eslintrc');
const path = require('path');

const buildPackageRestrictedImports = (packageName, root) => ({
  files: [`packages/${root}/src/**/*{.ts,.tsx,.js}`],
  excludedFiles: ['*.d.ts', '*.spec.ts', '*.spec.tsx', '**.test.tx', '**.test.tsx'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/base',
            message: 'Use @mui/material instead',
          },
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
          {
            group: ['@mui/base/*'],
            message: 'Use @mui/material instead',
          },
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
});

// Remove the rule blocking `@mui/material` root imports
// TODO: Remove when our packages will have `@mui/base` as a dependency.
const baselineOverrides = baseline.overrides.filter((override) => {
  const noRestrictedImports = override.rules?.['no-restricted-imports']?.[1];

  if (!noRestrictedImports?.paths) {
    return true;
  }

  return noRestrictedImports.paths;
});

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
    'import/prefer-default-export': 'off',
    // TODO move rule into the main repo once it has upgraded
    '@typescript-eslint/return-await': 'off',
    'no-restricted-imports': 'off',
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
    'react/jsx-no-duplicate-props': [1, { ignoreCase: false }],
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
  },
  overrides: [
    ...baselineOverrides,
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
        'packages/grid/x-data-grid-premium/src/themeAugmentation/index.js',
      ],
      rules: {
        'material-ui/no-direct-state-access': 'error',
      },
      parserOptions: { tsconfigRootDir: __dirname, project: ['./tsconfig.json'] },
    },
    {
      files: ['*.tsx'],
      excludedFiles: '*.spec.tsx',
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['docs/data/**/*.js', 'docs/data/**/*.tsx'],
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
              'useDateRangePickerDefaultizedProps',
              'useDateCalendarDefaultizedProps',
              'useMonthCalendarDefaultizedProps',
              'useYearCalendarDefaultizedProps',
              'useDateRangeCalendarDefaultizedProps',
            ],
          },
        ],
      },
    },
    buildPackageRestrictedImports('@mui/x-data-grid', 'grid/x-data-grid'),
    buildPackageRestrictedImports('@mui/x-data-grid-pro', 'grid/x-data-grid-pro'),
    buildPackageRestrictedImports('@mui/x-data-grid-premium', 'grid/x-data-grid-premium'),
    buildPackageRestrictedImports('@mui/x-data-grid-generator', 'grid/x-data-grid-generator'),
    buildPackageRestrictedImports('@mui/x-pickers', 'x-pickers'),
    buildPackageRestrictedImports('@mui/x-pickers-pro', 'x-pickers-pro'),
    buildPackageRestrictedImports('@mui/x-license-pro', 'x-license-pro'),
  ],
};

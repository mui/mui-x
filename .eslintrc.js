const baseline = require('@material-ui/monorepo/.eslintrc.js');
const path = require('path');

module.exports = {
  ...baseline,
  env: {
    ...baseline.env,
    jest: true,
  },
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
    // TODO
    'no-restricted-imports': 'off',
    'react-hooks/exhaustive-deps': ['warn', { additionalHooks: 'useEnhancedEffect' }],
  },
};

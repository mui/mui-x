const baseline = require('@mui/monorepo/prettier.config');

module.exports = {
  ...baseline,
  overrides: [
    ...baseline.overrides,
    {
      files: ['**/*.json'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
};

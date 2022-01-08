const baseline = require('@mui/monorepo/prettier.config');

module.exports = {
  ...baseline,
  overrides: [
    ...baseline.overrides,
    {
      files: ['**/*.mdx'],
      options: {
        // otherwise code blocks overflow on the docs website
        printWidth: 80,
      },
    },
  ],
};

/* eslint-disable global-require */
const { rules } = require('@material-ui/monorepo/packages/eslint-plugin-material-ui');

module.exports.rules = {
  ...rules,
  'no-direct-state-access': require('./rules/no-direct-state-access'),
};

module.exports = {
  extends: '../../.eslintrc.js',
  rules: {
    "react/display-name": 0,
    "react-hooks/rules-of-hooks": "warn", // Checks effect dependencies
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  },
};
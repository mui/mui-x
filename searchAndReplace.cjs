const generateReleaseInfo = require('./packages/x-license/generateReleaseInfo');

module.exports = {
  rules: [
    {
      search: '__RELEASE_INFO__',
      replace: generateReleaseInfo(),
    },
  ],
};

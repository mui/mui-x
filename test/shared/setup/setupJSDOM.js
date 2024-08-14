const coreExports = require('@mui/internal-test-utils/setupJSDOM');

require('../license/licenseRelease');
const { createSharedMochaHooks } = require('./setupMochaHooks');

const mochaHooks = createSharedMochaHooks(coreExports.mochaHooks);

module.exports = { ...coreExports, mochaHooks };

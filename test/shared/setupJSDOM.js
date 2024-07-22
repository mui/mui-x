const coreExports = require('@mui/internal-test-utils/setupJSDOM');

require('./license/licenseRelease');
const { createSharedMochaHooks } = require('./mochaHooks');

const mochaHooks = createSharedMochaHooks(coreExports.mochaHooks);

module.exports = { ...coreExports, mochaHooks };

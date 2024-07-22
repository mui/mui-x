const coreExports = require('@mui/internal-test-utils/setupJSDOM');

require('../utils/licenseRelease');
const { createXMochaHooks } = require('../utils/mochaHooks');

const mochaHooks = createXMochaHooks(coreExports.mochaHooks);

module.exports = { ...coreExports, mochaHooks };

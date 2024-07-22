const coreExports = require('@mui/internal-test-utils/setupJSDOM');

require('./licenseRelease');
require('../date-pickers-unit/setup/addChaiAssertions');
require('../date-pickers-unit/setup/setupPickers');
const { createXMochaHooks } = require('./mochaHooks');

const mochaHooks = createXMochaHooks(coreExports.mochaHooks);

// The JSDOM implementation is too slow
// https://github.com/jsdom/jsdom/issues/3234
window.getComputedStyle = function getComputedStyleMock() {
  return {
    getPropertyValue: () => {
      return undefined;
    },
  };
};

module.exports = { ...coreExports, mochaHooks };

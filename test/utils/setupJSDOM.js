const coreExports = require('@mui/internal-test-utils/setupJSDOM');

require('./licenseRelease');
require('./addChaiAssertions');
require('./setupPickers');
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

/* Not implemented by JSDOM. We need to set it to `SVGElement` instead of `SVGGraphicsElement` because JSDOM returns
 * `SVGElement` when referencing an `SVGTextElement`: https://github.com/jsdom/jsdom/issues/3310 */
window.SVGElement.prototype.getBBox = function getBBoxMock() {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
};

module.exports = { ...coreExports, mochaHooks };

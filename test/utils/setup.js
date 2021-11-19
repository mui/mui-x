const testingLibrary = require('@testing-library/dom');
const Mocha = require('mocha');
const createDOM = require('@material-ui/monorepo/test/utils/createDOM');
const { createMochaHooks } = require('@material-ui/monorepo/test/utils/mochaHooks');

require('@babel/register')({
  extensions: ['.js', '.ts', '.tsx'],
  ignore: [/node_modules\/(?!@material-ui\/(monorepo|unstyled))/],
});

createDOM();
require('./init');

testingLibrary.configure({
  // JSDOM logs errors otherwise on `getComputedStyles(element, pseudoElement)` calls.
  computedStyleSupportsPseudoElements: false,
});

const mochaHooks = createMochaHooks(Mocha);

module.exports = { mochaHooks };

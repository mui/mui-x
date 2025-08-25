"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeConformance = void 0;
var vitest_1 = require("vitest");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var propForwarding_1 = require("./conformanceTests/propForwarding");
var refForwarding_1 = require("./conformanceTests/refForwarding");
var className_1 = require("./conformanceTests/className");
var fullSuite = {
    propsSpread: propForwarding_1.testPropForwarding,
    refForwarding: refForwarding_1.testRefForwarding,
    className: className_1.testClassName,
};
function describeConformanceFn(minimalElement, getOptions) {
    var _a = getOptions(), _b = _a.after, runAfterHook = _b === void 0 ? function () { } : _b, _c = _a.only, only = _c === void 0 ? Object.keys(fullSuite) : _c, _d = _a.skip, skip = _d === void 0 ? [] : _d;
    var filteredTests = Object.keys(fullSuite).filter(function (testKey) {
        return only.indexOf(testKey) !== -1 && skip.indexOf(testKey) === -1;
    });
    (0, vitest_1.afterAll)(runAfterHook);
    filteredTests.forEach(function (testKey) {
        var test = fullSuite[testKey];
        test(minimalElement, getOptions);
    });
}
exports.describeConformance = (0, internal_test_utils_1.createDescribe)('Scheduler Primitives component API', describeConformanceFn);

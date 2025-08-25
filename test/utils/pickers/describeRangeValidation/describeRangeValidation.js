"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeRangeValidation = void 0;
var createDescribe_1 = require("@mui/internal-test-utils/createDescribe");
var testDayViewRangeValidation_1 = require("./testDayViewRangeValidation");
var testTextFieldRangeValidation_1 = require("./testTextFieldRangeValidation");
var testTextFieldKeyboardRangeValidation_1 = require("./testTextFieldKeyboardRangeValidation");
var TEST_SUITES = [
    testDayViewRangeValidation_1.testDayViewRangeValidation,
    testTextFieldRangeValidation_1.testTextFieldRangeValidation,
    testTextFieldKeyboardRangeValidation_1.testTextFieldKeyboardRangeValidation,
];
function innerDescribeRangeValidation(ElementToTest, getOptions) {
    var _a = getOptions(), _b = _a.after, runAfterHook = _b === void 0 ? function () { } : _b, views = _a.views;
    afterAll(runAfterHook);
    function getTestOptions() {
        return __assign(__assign({}, getOptions()), { withDate: views.includes('year') || views.includes('month') || views.includes('day'), withTime: views.includes('hours') || views.includes('minutes') || views.includes('seconds') });
    }
    TEST_SUITES.forEach(function (testSuite) {
        testSuite(ElementToTest, getTestOptions);
    });
}
/**
 * Tests various aspects of the range picker validation.
 */
exports.describeRangeValidation = (0, createDescribe_1.default)('Range pickers validation API', innerDescribeRangeValidation);

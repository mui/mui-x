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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeValue = void 0;
var React = require("react");
var createDescribe_1 = require("@mui/internal-test-utils/createDescribe");
var pickers_1 = require("test/utils/pickers");
var testControlledUnControlled_1 = require("./testControlledUnControlled");
var testPickerOpenCloseLifeCycle_1 = require("./testPickerOpenCloseLifeCycle");
var testPickerActionBar_1 = require("./testPickerActionBar");
var testShortcuts_1 = require("./testShortcuts");
var TEST_SUITES = [
    testControlledUnControlled_1.testControlledUnControlled,
    testPickerOpenCloseLifeCycle_1.testPickerOpenCloseLifeCycle,
    testPickerActionBar_1.testPickerActionBar,
    testShortcuts_1.testShortcuts,
];
function innerDescribeValue(ElementToTest, getOptions) {
    var options = getOptions();
    var defaultProps = options.defaultProps, render = options.render, componentFamily = options.componentFamily;
    function WrappedElementToTest(props) {
        var hook = props.hook, other = __rest(props, ["hook"]);
        var hookResult = hook === null || hook === void 0 ? void 0 : hook(props);
        return <ElementToTest {...defaultProps} {...other} {...hookResult}/>;
    }
    var renderWithProps;
    if (componentFamily === 'field' || componentFamily === 'picker') {
        var interactions_1 = (0, pickers_1.buildFieldInteractions)({ render: render, Component: ElementToTest });
        renderWithProps = function (props, config) {
            return interactions_1.renderWithProps(__assign(__assign({}, defaultProps), props), __assign(__assign({}, config), { componentFamily: componentFamily }));
        };
    }
    else {
        renderWithProps = function (_a, config) {
            var enableAccessibleFieldDOMStructure = _a.enableAccessibleFieldDOMStructure, props = __rest(_a, ["enableAccessibleFieldDOMStructure"]);
            var response = render(<WrappedElementToTest {...props} hook={config === null || config === void 0 ? void 0 : config.hook}/>);
            return __assign(__assign({}, response), { getSectionsContainer: function () {
                    throw new Error('You can only use `getSectionsContainer` on components that render a field');
                }, selectSection: function () {
                    throw new Error('You can only use `selectSection` on components that render a field');
                }, selectSectionAsync: function () {
                    throw new Error('You can only use `selectSectionAsync` on components that render a field');
                }, getHiddenInput: function () {
                    throw new Error('You can only use `getHiddenInput` on components that render a field');
                }, getActiveSection: function () {
                    throw new Error('You can only use `getActiveSection` on components that render a field');
                }, getSection: function () {
                    throw new Error('You can only use `getSection` on components that render a field');
                }, pressKey: function () {
                    throw new Error('You can only use `pressKey` on components that render a field');
                } });
        };
    }
    TEST_SUITES.forEach(function (testSuite) {
        var typedTestSuite = testSuite;
        typedTestSuite(WrappedElementToTest, __assign(__assign({}, options), { renderWithProps: renderWithProps }));
    });
}
/**
 * Tests various aspects of component value.
 */
exports.describeValue = (0, createDescribe_1.default)('Value API', innerDescribeValue);

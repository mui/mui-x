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
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var useControlledValue_1 = require("./useControlledValue");
var valueManagers_1 = require("../utils/valueManagers");
describe('useValueWithTimezone', function () {
    var _a = (0, pickers_1.createPickerRenderer)({
        adapterName: 'luxon',
    }), render = _a.render, adapter = _a.adapter;
    function runTest(params) {
        var expectedTimezone = params.expectedTimezone, other = __rest(params, ["expectedTimezone"]);
        function TestComponent(props) {
            var timezone = (0, useControlledValue_1.useControlledValue)(__assign(__assign({ name: 'test' }, props), { valueManager: valueManagers_1.singleItemValueManager, onChange: undefined })).timezone;
            return <div data-testid="result">{timezone}</div>;
        }
        render(<TestComponent {...other}/>);
        expect(internal_test_utils_1.screen.getByTestId('result').textContent).to.equal(expectedTimezone);
    }
    it('should use the timezone parameter when provided', function () {
        runTest({
            timezone: 'America/New_York',
            value: undefined,
            defaultValue: undefined,
            referenceDate: undefined,
            expectedTimezone: 'America/New_York',
        });
    });
    it('should use the timezone parameter over the value parameter when both are provided', function () {
        runTest({
            timezone: 'America/New_York',
            value: adapter.date(undefined, 'Europe/Paris'),
            defaultValue: undefined,
            referenceDate: undefined,
            expectedTimezone: 'America/New_York',
        });
    });
    it('should use the value parameter when provided', function () {
        runTest({
            timezone: undefined,
            value: adapter.date(undefined, 'America/New_York'),
            defaultValue: undefined,
            referenceDate: undefined,
            expectedTimezone: 'America/New_York',
        });
    });
    it('should use the value parameter over the defaultValue parameter when both are provided', function () {
        runTest({
            timezone: undefined,
            value: adapter.date(undefined, 'America/New_York'),
            defaultValue: adapter.date(undefined, 'Europe/Paris'),
            referenceDate: undefined,
            expectedTimezone: 'America/New_York',
        });
    });
    it('should use the defaultValue parameter when provided', function () {
        runTest({
            timezone: undefined,
            value: undefined,
            defaultValue: adapter.date(undefined, 'America/New_York'),
            referenceDate: undefined,
            expectedTimezone: 'America/New_York',
        });
    });
    it('should use the referenceDate parameter when provided', function () {
        runTest({
            timezone: undefined,
            value: undefined,
            defaultValue: undefined,
            referenceDate: adapter.date(undefined, 'America/New_York'),
            expectedTimezone: 'America/New_York',
        });
    });
    it('should use the "default" timezone is there is no way to deduce the user timezone', function () {
        runTest({
            timezone: undefined,
            value: undefined,
            defaultValue: undefined,
            referenceDate: undefined,
            expectedTimezone: 'default',
        });
    });
});

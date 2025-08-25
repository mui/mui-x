"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = require("moment");
var moment_jalaali_1 = require("moment-jalaali");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var useField_utils_1 = require("../internals/hooks/useField/useField.utils");
require("moment/locale/fa");
var testDate = '2018-05-15T09:35:10';
function updateDate(date, adapter, sectionType, diff) {
    switch (sectionType) {
        case 'year':
            return adapter.addYears(date, diff);
        case 'month':
            return adapter.addMonths(date, diff);
        case 'day':
        case 'weekDay':
            return adapter.addDays(date, diff);
        case 'hours':
            return adapter.addHours(date, diff);
        case 'minutes':
            return adapter.addMinutes(date, diff);
        case 'seconds':
            return adapter.addSeconds(date, diff);
        case 'meridiem':
            return adapter.setHours(date, (adapter.getHours(date) + 12 * diff) % 24);
        default:
            throw new Error('Unsupported section type');
    }
}
var adapterToTest = [
    'luxon',
    'date-fns',
    'dayjs',
    'moment',
    'date-fns-jalali',
    // 'moment-hijri',
    'moment-jalaali',
];
describe("RTL - test arrows navigation", function () {
    var _a = (0, pickers_1.createPickerRenderer)({
        adapterName: 'moment-jalaali',
    }), render = _a.render, adapter = _a.adapter;
    beforeAll(function () {
        moment_jalaali_1.default.loadPersian();
    });
    afterAll(function () {
        moment_1.default.locale('en');
    });
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({ render: render, Component: DateTimeField_1.DateTimeField }).renderWithProps;
    it('should move selected section to the next section respecting RTL order in empty field', function () {
        var expectedValues = ['hh', 'mm', 'YYYY', 'MM', 'DD', 'DD'];
        // Test with accessible DOM structure
        var view = renderWithProps({ enableAccessibleFieldDOMStructure: true }, { direction: 'rtl' });
        view.selectSection('hours');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowRight' });
        });
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({ enableAccessibleFieldDOMStructure: false }, { direction: 'rtl' });
        var input = (0, pickers_1.getTextbox)();
        view.selectSection('hours');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
        });
    });
    it('should move selected section to the previous section respecting RTL order in empty field', function () {
        var expectedValues = ['DD', 'MM', 'YYYY', 'mm', 'hh', 'hh'];
        // Test with accessible DOM structure
        var view = renderWithProps({ enableAccessibleFieldDOMStructure: true }, { direction: 'rtl' });
        view.selectSection('day');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowLeft' });
        });
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({ enableAccessibleFieldDOMStructure: false }, { direction: 'rtl' });
        var input = (0, pickers_1.getTextbox)();
        view.selectSection('day');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
        });
    });
    it('should move selected section to the next section respecting RTL order in non-empty field', function () {
        // 25/04/2018 => 1397/02/05
        var expectedValues = ['11', '54', '1397', '02', '05', '05'];
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            defaultValue: adapter.date('2018-04-25T11:54:00'),
        }, { direction: 'rtl' });
        view.selectSection('hours');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowRight' });
        });
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            defaultValue: adapter.date('2018-04-25T11:54:00'),
            enableAccessibleFieldDOMStructure: false,
        }, { direction: 'rtl' });
        var input = (0, pickers_1.getTextbox)();
        view.selectSection('hours');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
        });
    });
    it('should move selected section to the previous section respecting RTL order in non-empty field', function () {
        // 25/04/2018 => 1397/02/05
        var expectedValues = ['05', '02', '1397', '54', '11', '11'];
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            defaultValue: adapter.date('2018-04-25T11:54:00'),
        }, { direction: 'rtl' });
        view.selectSection('day');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowLeft' });
        });
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            defaultValue: adapter.date('2018-04-25T11:54:00'),
            enableAccessibleFieldDOMStructure: false,
        }, { direction: 'rtl' });
        var input = (0, pickers_1.getTextbox)();
        view.selectSection('day');
        expectedValues.forEach(function (expectedValue) {
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(expectedValue);
            internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
        });
    });
});
adapterToTest.forEach(function (adapterName) {
    describe("test keyboard interaction with ".concat(adapterName, " adapter"), function () {
        var _a = (0, pickers_1.createPickerRenderer)({
            adapterName: adapterName,
        }), render = _a.render, adapter = _a.adapter;
        beforeEach(function () {
            if (adapterName === 'moment-jalaali') {
                moment_jalaali_1.default.loadPersian();
            }
            else if (adapterName === 'moment') {
                moment_1.default.locale('en');
            }
        });
        afterEach(function () {
            if (adapterName === 'moment-jalaali') {
                moment_1.default.locale('en');
            }
        });
        var renderWithProps = (0, pickers_1.buildFieldInteractions)({ render: render, Component: DateTimeField_1.DateTimeField }).renderWithProps;
        var cleanValueStr = function (valueStr, sectionConfig) {
            if (sectionConfig.contentType === 'digit' && sectionConfig.maxLength != null) {
                return (0, useField_utils_1.cleanLeadingZeros)(valueStr, sectionConfig.maxLength);
            }
            return valueStr;
        };
        var testKeyPress = function (_a) {
            var key = _a.key, format = _a.format, initialValue = _a.initialValue, expectedValue = _a.expectedValue, sectionConfig = _a.sectionConfig;
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                defaultValue: initialValue,
                format: format,
            });
            view.selectSection(sectionConfig.type);
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: key });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), cleanValueStr(adapter.formatByString(expectedValue, format), sectionConfig));
        };
        var testKeyboardInteraction = function (formatToken) {
            var sectionConfig = (0, useField_utils_1.getDateSectionConfigFromFormatToken)(adapter, formatToken);
            it("should increase \"".concat(sectionConfig.type, "\" when pressing ArrowUp on \"").concat(formatToken, "\" token"), function () {
                var initialValue = adapter.date(testDate);
                var expectedValue = updateDate(initialValue, adapter, sectionConfig.type, 1);
                testKeyPress({
                    key: 'ArrowUp',
                    initialValue: initialValue,
                    expectedValue: expectedValue,
                    sectionConfig: sectionConfig,
                    format: formatToken,
                });
            });
            it("should decrease \"".concat(sectionConfig.type, "\" when pressing ArrowDown on \"").concat(formatToken, "\" token"), function () {
                var initialValue = adapter.date(testDate);
                var expectedValue = updateDate(initialValue, adapter, sectionConfig.type, -1);
                testKeyPress({
                    key: 'ArrowDown',
                    initialValue: initialValue,
                    expectedValue: expectedValue,
                    sectionConfig: sectionConfig,
                    format: formatToken,
                });
            });
        };
        Object.keys(adapter.formatTokenMap).forEach(function (formatToken) {
            testKeyboardInteraction(formatToken);
        });
    });
});

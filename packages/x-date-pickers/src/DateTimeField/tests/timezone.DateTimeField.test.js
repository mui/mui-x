"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var pickers_1 = require("test/utils/pickers");
var TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];
describe('<DateTimeField /> - Timezone', function () {
    (0, pickers_1.describeAdapters)('Timezone prop', DateTimeField_1.DateTimeField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', function () {
            var format = "".concat(adapter.formats.keyboardDate, " ").concat(adapter.formats.hours24h);
            var fillEmptyValue = function (v7Response, timezone) {
                v7Response.selectSection('month');
                // Set month
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(0), { key: 'ArrowDown' });
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(0), { key: 'ArrowRight' });
                // Set day
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(1), { key: 'ArrowDown' });
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(1), { key: 'ArrowRight' });
                // Set year
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(2), { key: 'ArrowDown' });
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(2), { key: 'ArrowRight' });
                // Set hours
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(3), { key: 'ArrowDown' });
                internal_test_utils_1.fireEvent.keyDown(v7Response.getActiveSection(3), { key: 'ArrowRight' });
                return adapter.setHours(adapter.setDate(adapter.setMonth(adapter.date(undefined, timezone), 11), 31), 23);
            };
            it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', function () {
                var onChange = (0, sinon_1.spy)();
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    format: format,
                });
                var expectedDate = fillEmptyValue(view, 'default');
                // Check the rendered value (uses default timezone, for example: UTC, see TZ env variable)
                (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '12/31/2022 23');
                // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
                var actualDate = onChange.lastCall.firstArg;
                // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
                // In a real world scenario, this should probably never occur.
                expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
                expect(actualDate).toEqualDateTime(expectedDate);
            });
            TIMEZONE_TO_TEST.forEach(function (timezone) {
                describe("Timezone: ".concat(timezone), function () {
                    it('should use timezone prop for onChange and rendering when no value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        var view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChange,
                            format: format,
                            timezone: timezone,
                        });
                        var expectedDate = fillEmptyValue(view, timezone);
                        // Check the rendered value (uses timezone prop)
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '12/31/2022 23');
                        // Check the `onChange` value (uses timezone prop)
                        var actualDate = onChange.lastCall.firstArg;
                        expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' && timezone === 'system' ? 'UTC' : timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                    it('should use timezone prop for rendering and value timezone for onChange when a value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        var view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date(undefined, timezone),
                            onChange: onChange,
                            format: format,
                            timezone: 'America/Chicago',
                        });
                        view.selectSection('month');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });
                        // Check the rendered value (uses America/Chicago timezone)
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '05/14/2022 19');
                        // Check the `onChange` value (uses timezone prop)
                        var expectedDate = adapter.addMonths(adapter.date(undefined, timezone), -1);
                        var actualDate = onChange.lastCall.firstArg;
                        expect(adapter.getTimezone(actualDate)).to.equal(timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                });
            });
        });
    });
    describe('Value timezone modification - Luxon', function () {
        var _a = (0, pickers_1.createPickerRenderer)({
            adapterName: 'luxon',
        }), render = _a.render, adapter = _a.adapter;
        var renderWithProps = (0, pickers_1.buildFieldInteractions)({
            render: render,
            Component: DateTimeField_1.DateTimeField,
        }).renderWithProps;
        it('should update the field when the timezone changes (timestamp remains the same)', function () {
            var view = renderWithProps({ enableAccessibleFieldDOMStructure: true, value: null });
            var date = adapter.date('2020-06-18T14:30:10.000Z').setZone('UTC');
            view.setProps({ value: date });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/18/2020 02:30 PM');
            view.setProps({ value: date.setZone('America/Los_Angeles') });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/18/2020 07:30 AM');
        });
    });
});

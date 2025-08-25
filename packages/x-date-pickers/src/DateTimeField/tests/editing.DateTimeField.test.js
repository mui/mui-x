"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var pickers_1 = require("test/utils/pickers");
describe('<DateTimeField /> - Editing', function () {
    var render = (0, pickers_1.createPickerRenderer)({
        clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743),
    }).render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: DateTimeField_1.DateTimeField,
    }).renderWithProps;
    describe('Reference value', function () {
        it('should use the referenceDate prop when defined', function () {
            var onChange = (0, sinon_1.spy)();
            var referenceDate = pickers_1.adapterToUse.date('2012-05-03T14:30:00');
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                referenceDate: referenceDate,
                format: pickers_1.adapterToUse.formats.month,
            });
            view.selectSection('month');
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
            // All sections not present should equal the one from the referenceDate, and the month should equal January (because it's an ArrowUp on an empty month).
            expect(onChange.lastCall.firstArg).toEqualDateTime(pickers_1.adapterToUse.setMonth(referenceDate, 0));
        });
        it('should not use the referenceDate prop when a value is defined', function () {
            var onChange = (0, sinon_1.spy)();
            var value = pickers_1.adapterToUse.date('2018-11-03T22:15:00');
            var referenceDate = pickers_1.adapterToUse.date('2012-05-03T14:30:00');
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                referenceDate: referenceDate,
                value: value,
                format: pickers_1.adapterToUse.formats.month,
            });
            view.selectSection('month');
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
            // Should equal the initial `value` prop with one less month.
            expect(onChange.lastCall.firstArg).toEqualDateTime(pickers_1.adapterToUse.setMonth(value, 11));
        });
        it('should not use the referenceDate prop when a defaultValue is defined', function () {
            var onChange = (0, sinon_1.spy)();
            var defaultValue = pickers_1.adapterToUse.date('2018-11-03T22:15:00');
            var referenceDate = pickers_1.adapterToUse.date('2012-05-03T14:30:00');
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                referenceDate: referenceDate,
                defaultValue: defaultValue,
                format: pickers_1.adapterToUse.formats.month,
            });
            view.selectSection('month');
            internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
            // Should equal the initial `defaultValue` prop with one less month.
            expect(onChange.lastCall.firstArg).toEqualDateTime(pickers_1.adapterToUse.setMonth(defaultValue, 11));
        });
        describe('Reference value based on section granularity', function () {
            it('should only keep year when granularity = month', function () {
                var onChange = (0, sinon_1.spy)();
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    format: pickers_1.adapterToUse.formats.month,
                });
                view.selectSection('month');
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                expect(onChange.lastCall.firstArg).toEqualDateTime('2012-01-01');
            });
            it('should only keep year and month when granularity = day', function () {
                var onChange = (0, sinon_1.spy)();
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    format: pickers_1.adapterToUse.formats.dayOfMonth,
                });
                view.selectSection('day');
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                expect(onChange.lastCall.firstArg).toEqualDateTime('2012-05-01');
            });
            it('should only keep up to the hours when granularity = minutes', function () {
                var onChange = (0, sinon_1.spy)();
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    format: pickers_1.adapterToUse.formats.fullTime24h,
                });
                view.selectSection('hours');
                // Set hours
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                // Set minutes
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowUp' });
                expect(onChange.lastCall.firstArg).toEqualDateTime('2012-05-03T00:00:00.000Z');
            });
        });
        describe('Reference value based on validation props', function () {
            it("should create a reference date just after the `minDate` if it's after the current date", function () {
                var onChange = (0, sinon_1.spy)();
                var minDate = pickers_1.adapterToUse.date('2030-05-05T18:30:00');
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    minDate: minDate,
                    format: pickers_1.adapterToUse.formats.month,
                });
                view.selectSection('month');
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                // Respect the granularity and the minDate
                expect(onChange.lastCall.firstArg).toEqualDateTime('2030-01-01T00:00');
            });
            it("should ignore the `minDate` if  it's before the current date", function () {
                var onChange = (0, sinon_1.spy)();
                var minDate = pickers_1.adapterToUse.date('2007-05-05T18:30:00');
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    minDate: minDate,
                    format: pickers_1.adapterToUse.formats.month,
                });
                view.selectSection('month');
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                // Respect the granularity but not the minDate
                expect(onChange.lastCall.firstArg).toEqualDateTime('2012-01-01T00:00');
            });
            it("should create a reference date just before the `maxDate` if it's before the current date", function () {
                var onChange = (0, sinon_1.spy)();
                var maxDate = pickers_1.adapterToUse.date('2007-05-05T18:30:00');
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    maxDate: maxDate,
                    format: pickers_1.adapterToUse.formats.month,
                });
                view.selectSection('month');
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                // Respect the granularity and the minDate
                expect(onChange.lastCall.firstArg).toEqualDateTime('2007-01-01T00:00');
            });
            it("should ignore the `maxDate` if  it's after the current date", function () {
                var onChange = (0, sinon_1.spy)();
                var maxDate = pickers_1.adapterToUse.date('2030-05-05T18:30:00');
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    maxDate: maxDate,
                    format: pickers_1.adapterToUse.formats.month,
                });
                view.selectSection('month');
                internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowUp' });
                // Respect the granularity but not the maxDate
                expect(onChange.lastCall.firstArg).toEqualDateTime('2012-01-01T00:00');
            });
        });
    });
    it('should correctly update `value` when both `format` and `value` are changed', function () {
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            value: null,
            format: 'P',
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
        view.setProps({
            format: 'Pp',
            value: pickers_1.adapterToUse.date('2012-05-03T14:30:00'),
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '05/03/2012, 02:30 PM');
    });
});

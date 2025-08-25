"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var MobileDateRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateRangePicker");
var pickers_1 = require("test/utils/pickers");
var MultiInputDateRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateRangeField");
describe('<MobileDateRangePicker /> - Describes', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileDateRangePicker_1.MobileDateRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-range',
        variant: 'mobile',
        initialFocus: 'start',
        fieldType: 'multi-input',
        defaultProps: {
            slots: { field: MultiInputDateRangeField_1.MultiInputDateRangeField },
        },
        values: [
            // initial start and end dates
            [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-04')],
            // start and end dates after `setNewValue`
            [pickers_1.adapterToUse.date('2018-01-02'), pickers_1.adapterToUse.date('2018-01-05')],
        ],
        emptyValue: [null, null],
        assertRenderedValue: function (expectedValues) {
            var startSectionsContainer = (0, pickers_1.getFieldSectionsContainer)(0);
            var expectedStartValueStr = expectedValues[0]
                ? pickers_1.adapterToUse.format(expectedValues[0], 'keyboardDate')
                : 'MM/DD/YYYY';
            (0, pickers_1.expectFieldValueV7)(startSectionsContainer, expectedStartValueStr);
            var endFieldRoot = (0, pickers_1.getFieldSectionsContainer)(1);
            var expectedEndValueStr = expectedValues[1]
                ? pickers_1.adapterToUse.format(expectedValues[1], 'keyboardDate')
                : 'MM/DD/YYYY';
            (0, pickers_1.expectFieldValueV7)(endFieldRoot, expectedEndValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, _b = _a.setEndDate, setEndDate = _b === void 0 ? false : _b;
            var newValue;
            if (applySameValue) {
                newValue = value;
            }
            else if (setEndDate) {
                newValue = [value[0], pickers_1.adapterToUse.addDays(value[1], 1)];
            }
            else {
                newValue = [pickers_1.adapterToUse.addDays(value[0], 1), value[1]];
            }
            if (!isOpened) {
                (0, pickers_1.openPicker)({ type: 'date-range', initialFocus: 'start', fieldType: 'multi-input' });
            }
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', {
                name: pickers_1.adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
            }));
            // Close the picker
            if (!isOpened) {
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            }
            return newValue;
        },
    }); });
    // With single input field
    (0, pickers_1.describeValue)(MobileDateRangePicker_1.MobileDateRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-range',
        variant: 'mobile',
        initialFocus: 'start',
        fieldType: 'single-input',
        values: [
            // initial start and end dates
            [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-04')],
            // start and end dates after `setNewValue`
            [pickers_1.adapterToUse.date('2018-01-02'), pickers_1.adapterToUse.date('2018-01-05')],
        ],
        emptyValue: [null, null],
        assertRenderedValue: function (expectedValues) {
            var fieldRoot = (0, pickers_1.getFieldInputRoot)(0);
            var expectedStartValueStr = expectedValues[0]
                ? pickers_1.adapterToUse.format(expectedValues[0], 'keyboardDate')
                : 'MM/DD/YYYY';
            var expectedEndValueStr = expectedValues[1]
                ? pickers_1.adapterToUse.format(expectedValues[1], 'keyboardDate')
                : 'MM/DD/YYYY';
            var expectedValueStr = "".concat(expectedStartValueStr, " \u2013 ").concat(expectedEndValueStr);
            (0, pickers_1.expectFieldValueV7)(fieldRoot, expectedValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, _b = _a.setEndDate, setEndDate = _b === void 0 ? false : _b, selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue;
            if (applySameValue) {
                newValue = value;
            }
            else if (setEndDate) {
                newValue = [value[0], pickers_1.adapterToUse.addDays(value[1], 1)];
            }
            else {
                newValue = [pickers_1.adapterToUse.addDays(value[0], 1), value[1]];
            }
            if (isOpened) {
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getAllByRole('gridcell', {
                    name: pickers_1.adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
                })[0]);
            }
            else {
                selectSection('day');
                pressKey(undefined, 'ArrowUp');
            }
            return newValue;
        },
    }); });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopDateRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopDateRangePicker");
describe('<DesktopDateRangePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    // With single input field
    (0, pickers_1.describeValue)(DesktopDateRangePicker_1.DesktopDateRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-range',
        variant: 'desktop',
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

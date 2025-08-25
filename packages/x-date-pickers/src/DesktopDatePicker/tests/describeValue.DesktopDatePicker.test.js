"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopDatePicker_1 = require("@mui/x-date-pickers/DesktopDatePicker");
describe('<DesktopDatePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DesktopDatePicker_1.DesktopDatePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date',
        variant: 'desktop',
        values: [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-02')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var fieldRoot = (0, pickers_1.getFieldInputRoot)();
            var expectedValueStr = expectedValue
                ? pickers_1.adapterToUse.format(expectedValue, 'keyboardDate')
                : 'MM/DD/YYYY';
            (0, pickers_1.expectFieldValueV7)(fieldRoot, expectedValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue = applySameValue ? value : pickers_1.adapterToUse.addDays(value, 1);
            if (isOpened) {
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.getDate(newValue).toString() }));
            }
            else {
                selectSection('day');
                pressKey(undefined, 'ArrowUp');
            }
            return newValue;
        },
    }); });
});

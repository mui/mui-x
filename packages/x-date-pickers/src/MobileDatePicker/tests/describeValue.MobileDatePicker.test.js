"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileDatePicker_1 = require("@mui/x-date-pickers/MobileDatePicker");
describe('<MobileDatePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileDatePicker_1.MobileDatePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date',
        variant: 'mobile',
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
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue;
            if (!isOpened) {
                (0, pickers_1.openPicker)({ type: 'date' });
            }
            var newValue = applySameValue ? value : pickers_1.adapterToUse.addDays(value, 1);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.getDate(newValue).toString() }));
            // Close the Picker to return to the initial state
            if (!isOpened) {
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            }
            return newValue;
        },
    }); });
});

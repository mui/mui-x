"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileDateTimePicker_1 = require("@mui/x-date-pickers/MobileDateTimePicker");
describe('<MobileDateTimePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileDateTimePicker_1.MobileDateTimePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-time',
        variant: 'mobile',
        values: [pickers_1.adapterToUse.date('2018-01-01T11:30:00'), pickers_1.adapterToUse.date('2018-01-02T12:35:00')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
            var fieldRoot = (0, pickers_1.getFieldInputRoot)();
            var expectedValueStr;
            if (expectedValue) {
                expectedValueStr = pickers_1.adapterToUse.format(expectedValue, hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h');
            }
            else {
                expectedValueStr = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
            }
            (0, pickers_1.expectFieldValueV7)(fieldRoot, expectedValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue;
            if (!isOpened) {
                (0, pickers_1.openPicker)({ type: 'date-time' });
            }
            var newValue = applySameValue
                ? value
                : pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(pickers_1.adapterToUse.addDays(value, 1), 1), 5);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.getDate(newValue).toString() }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Next' }));
            var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
            var hours = pickers_1.adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
            var hoursNumber = pickers_1.adapterToUse.getHours(newValue);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(parseInt(hours, 10), " hours") }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(pickers_1.adapterToUse.getMinutes(newValue), " minutes") }));
            if (hasMeridiem) {
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
            }
            // Close the picker
            if (!isOpened) {
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            }
            else {
                // return to the date view in case we'd like to repeat the selection process
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('tab', { name: 'pick date' }));
            }
            return newValue;
        },
    }); });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimePicker_1 = require("@mui/x-date-pickers/DesktopDateTimePicker");
describe('<DesktopDateTimePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DesktopDateTimePicker_1.DesktopDateTimePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-time',
        variant: 'desktop',
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
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue = applySameValue
                ? value
                : pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(pickers_1.adapterToUse.addDays(value, 1), 1), 5);
            if (isOpened) {
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.getDate(newValue).toString() }));
                var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
                var hours = pickers_1.adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
                var hoursNumber = pickers_1.adapterToUse.getHours(newValue);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(parseInt(hours, 10), " hours") }));
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(pickers_1.adapterToUse.getMinutes(newValue), " minutes") }));
                if (hasMeridiem) {
                    internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
                }
            }
            else {
                selectSection('day');
                pressKey(undefined, 'ArrowUp');
                selectSection('hours');
                pressKey(undefined, 'ArrowUp');
                selectSection('minutes');
                pressKey(undefined, 'PageUp'); // increment by 5 minutes
                var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
                if (hasMeridiem) {
                    selectSection('meridiem');
                    var previousHours = pickers_1.adapterToUse.getHours(value);
                    var newHours = pickers_1.adapterToUse.getHours(newValue);
                    // update meridiem section if it changed
                    if ((previousHours < 12 && newHours >= 12) || (previousHours >= 12 && newHours < 12)) {
                        pressKey(undefined, 'ArrowUp');
                    }
                }
            }
            return newValue;
        },
    }); });
});

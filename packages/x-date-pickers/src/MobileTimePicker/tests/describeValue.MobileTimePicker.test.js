"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileTimePicker_1 = require("@mui/x-date-pickers/MobileTimePicker");
describe('<MobileTimePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileTimePicker_1.MobileTimePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'time',
        variant: 'mobile',
        values: [pickers_1.adapterToUse.date('2018-01-01T11:30:00'), pickers_1.adapterToUse.date('2018-01-01T12:35:00')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
            var fieldRoot = (0, pickers_1.getFieldInputRoot)();
            var expectedValueStr;
            if (expectedValue) {
                expectedValueStr = (0, pickers_1.formatFullTimeValue)(pickers_1.adapterToUse, expectedValue);
            }
            else {
                expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
            }
            (0, pickers_1.expectFieldValueV7)(fieldRoot, expectedValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue;
            if (!isOpened) {
                (0, pickers_1.openPicker)({ type: 'time' });
            }
            var newValue = applySameValue
                ? value
                : pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(value, 1), 5);
            var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
            // change hours
            var hourClockEvent = (0, pickers_1.getClockTouchEvent)(pickers_1.adapterToUse.getHours(newValue), hasMeridiem ? '12hours' : '24hours');
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', hourClockEvent);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', hourClockEvent);
            // change minutes
            var minutesClockEvent = (0, pickers_1.getClockTouchEvent)(pickers_1.adapterToUse.getMinutes(newValue), 'minutes');
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', minutesClockEvent);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', minutesClockEvent);
            if (hasMeridiem) {
                var newHours = pickers_1.adapterToUse.getHours(newValue);
                // select appropriate meridiem
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: newHours >= 12 ? 'PM' : 'AM' }));
            }
            // Close the picker
            if (!isOpened) {
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            }
            else {
                // return to the hours view in case we'd like to repeat the selection process
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Open previous view' }));
            }
            return newValue;
        },
    }); });
});

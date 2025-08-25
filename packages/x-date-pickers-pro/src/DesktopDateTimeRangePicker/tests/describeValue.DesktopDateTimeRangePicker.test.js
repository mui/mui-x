"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimeRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopDateTimeRangePicker");
var MultiInputDateTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateTimeRangeField");
describe('<DesktopDateTimeRangePicker /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-time-range',
        variant: 'desktop',
        initialFocus: 'start',
        fieldType: 'multi-input',
        defaultProps: {
            slots: { field: MultiInputDateTimeRangeField_1.MultiInputDateTimeRangeField },
            slotProps: {
                tabs: {
                    hidden: false,
                },
            },
        },
        values: [
            // initial start and end dates
            [pickers_1.adapterToUse.date('2018-01-01T11:30:00'), pickers_1.adapterToUse.date('2018-01-04T11:45:00')],
            // start and end dates after `setNewValue`
            [pickers_1.adapterToUse.date('2018-01-02T12:35:00'), pickers_1.adapterToUse.date('2018-01-05T12:50:00')],
        ],
        emptyValue: [null, null],
        assertRenderedValue: function (expectedValues) {
            var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
            var expectedPlaceholder = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
            var startSectionsContainer = (0, pickers_1.getFieldSectionsContainer)(0);
            var expectedStartValueStr = expectedValues[0]
                ? pickers_1.adapterToUse.format(expectedValues[0], hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h')
                : expectedPlaceholder;
            (0, pickers_1.expectFieldValueV7)(startSectionsContainer, expectedStartValueStr);
            var endSectionsContainer = (0, pickers_1.getFieldSectionsContainer)(1);
            var expectedEndValueStr = expectedValues[1]
                ? pickers_1.adapterToUse.format(expectedValues[1], hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h')
                : expectedPlaceholder;
            (0, pickers_1.expectFieldValueV7)(endSectionsContainer, expectedEndValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, _b = _a.setEndDate, setEndDate = _b === void 0 ? false : _b, selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue;
            if (applySameValue) {
                newValue = value;
            }
            else if (setEndDate) {
                newValue = [
                    value[0],
                    pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(pickers_1.adapterToUse.addDays(value[1], 1), 1), 5),
                ];
            }
            else {
                newValue = [
                    pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(pickers_1.adapterToUse.addDays(value[0], 1), 1), 5),
                    value[1],
                ];
            }
            if (isOpened) {
                var nextButton = internal_test_utils_1.screen.queryByRole('button', { name: 'Next' });
                // if we want to set the end date, we firstly need to switch to end date "range position"
                if (setEndDate && nextButton) {
                    internal_test_utils_1.fireEvent.click(nextButton);
                }
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', {
                    name: pickers_1.adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
                }));
                var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
                var hours = pickers_1.adapterToUse.format(newValue[setEndDate ? 1 : 0], hasMeridiem ? 'hours12h' : 'hours24h');
                var hoursNumber = pickers_1.adapterToUse.getHours(newValue[setEndDate ? 1 : 0]);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(parseInt(hours, 10), " hours") }));
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', {
                    name: "".concat(pickers_1.adapterToUse.getMinutes(newValue[setEndDate ? 1 : 0]), " minutes"),
                }));
                if (hasMeridiem) {
                    internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
                }
                if (setEndDate) {
                    // Switch back to start date "range position" in case we'd need to repeat selection
                    var previousViewButton = internal_test_utils_1.screen.queryByRole('button', { name: 'Open previous view' });
                    while (previousViewButton) {
                        internal_test_utils_1.fireEvent.click(previousViewButton);
                        previousViewButton = internal_test_utils_1.screen.queryByRole('button', { name: 'Open previous view' });
                    }
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
                    var previousHours = pickers_1.adapterToUse.getHours(value[setEndDate ? 1 : 0]);
                    var newHours = pickers_1.adapterToUse.getHours(newValue[setEndDate ? 1 : 0]);
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

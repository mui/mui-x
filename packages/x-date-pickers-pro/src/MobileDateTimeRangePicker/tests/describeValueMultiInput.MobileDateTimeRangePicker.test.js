"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileDateTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateTimeRangePicker");
var MultiInputDateTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateTimeRangeField");
describe('<MobileDateTimeRangePicker /> - Describe Value Multi Input', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileDateTimeRangePicker_1.MobileDateTimeRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-time-range',
        variant: 'mobile',
        initialFocus: 'start',
        fieldType: 'multi-input',
        defaultProps: {
            slots: { field: MultiInputDateTimeRangeField_1.MultiInputDateTimeRangeField },
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
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, _b = _a.setEndDate, setEndDate = _b === void 0 ? false : _b;
            if (!isOpened) {
                (0, pickers_1.openPicker)({
                    type: 'date-time-range',
                    initialFocus: setEndDate ? 'end' : 'start',
                    fieldType: 'multi-input',
                });
            }
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
            // Go to the start date or the end date
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', {
                name: pickers_1.adapterToUse.format(value[setEndDate ? 1 : 0], 'shortDate'),
            }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', {
                name: pickers_1.adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
            }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Next' }));
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
            // Close the picker
            if (!isOpened) {
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            }
            else {
                // return to the start date view in case we'd like to repeat the selection process
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: pickers_1.adapterToUse.format(newValue[0], 'shortDate') }));
            }
            return newValue;
        },
    }); });
});

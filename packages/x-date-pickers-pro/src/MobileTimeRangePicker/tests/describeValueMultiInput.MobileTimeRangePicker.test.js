"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileTimeRangePicker");
var MultiInputTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputTimeRangeField");
describe('<MobileTimeRangePicker /> - Describe Value Multi Input', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileTimeRangePicker_1.MobileTimeRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'time-range',
        variant: 'mobile',
        initialFocus: 'start',
        fieldType: 'multi-input',
        defaultProps: {
            slots: { field: MultiInputTimeRangeField_1.MultiInputTimeRangeField },
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
            var expectedPlaceholder = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
            var startSectionsContainer = (0, pickers_1.getFieldSectionsContainer)(0);
            var expectedStartValueStr = expectedValues[0]
                ? pickers_1.adapterToUse.format(expectedValues[0], hasMeridiem ? 'fullTime12h' : 'fullTime24h')
                : expectedPlaceholder;
            (0, pickers_1.expectFieldValueV7)(startSectionsContainer, expectedStartValueStr);
            var endSectionsContainer = (0, pickers_1.getFieldSectionsContainer)(1);
            var expectedEndValueStr = expectedValues[1]
                ? pickers_1.adapterToUse.format(expectedValues[1], hasMeridiem ? 'fullTime12h' : 'fullTime24h')
                : expectedPlaceholder;
            (0, pickers_1.expectFieldValueV7)(endSectionsContainer, expectedEndValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, _b = _a.setEndDate, setEndDate = _b === void 0 ? false : _b;
            if (!isOpened) {
                (0, pickers_1.openPicker)({
                    type: 'time-range',
                    initialFocus: setEndDate ? 'end' : 'start',
                    fieldType: 'multi-input',
                });
            }
            var newValue;
            if (applySameValue) {
                newValue = value;
            }
            else if (setEndDate) {
                newValue = [value[0], pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(value[1], 1), 5)];
            }
            else {
                newValue = [pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(value[0], 1), 5), value[1]];
            }
            // Go to the start date or the end date
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('tab', { name: setEndDate ? 'End' : 'Start' }));
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
                var toolbarHourButtons = internal_test_utils_1.screen.getAllByRole('button', {
                    name: pickers_1.adapterToUse.format(newValue[0], hasMeridiem ? 'hours12h' : 'hours24h'),
                });
                // return to the start time view in case we'd like to repeat the selection process
                internal_test_utils_1.fireEvent.click(toolbarHourButtons[0]);
            }
            return newValue;
        },
    }); });
});

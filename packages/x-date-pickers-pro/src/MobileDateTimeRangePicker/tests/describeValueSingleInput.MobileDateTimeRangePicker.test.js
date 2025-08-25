"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileDateTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateTimeRangePicker");
describe('<MobileDateTimeRangePicker /> - Describe Value Single Input', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MobileDateTimeRangePicker_1.MobileDateTimeRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        type: 'date-time-range',
        variant: 'mobile',
        initialFocus: 'start',
        fieldType: 'single-input',
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
            var fieldRoot = (0, pickers_1.getFieldInputRoot)(0);
            var expectedStartValueStr = expectedValues[0]
                ? pickers_1.adapterToUse.format(expectedValues[0], hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h')
                : expectedPlaceholder;
            var expectedEndValueStr = expectedValues[1]
                ? pickers_1.adapterToUse.format(expectedValues[1], hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h')
                : expectedPlaceholder;
            var expectedValueStr = "".concat(expectedStartValueStr, " \u2013 ").concat(expectedEndValueStr);
            (0, pickers_1.expectFieldValueV7)(fieldRoot, expectedValueStr);
        },
        setNewValue: function (value, _a) {
            var isOpened = _a.isOpened, applySameValue = _a.applySameValue, _b = _a.setEndDate, setEndDate = _b === void 0 ? false : _b, closeMobilePicker = _a.closeMobilePicker;
            if (!isOpened) {
                (0, pickers_1.openPicker)({
                    type: 'date-time-range',
                    initialFocus: setEndDate ? 'end' : 'start',
                    fieldType: 'single-input',
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
            if (closeMobilePicker) {
                if (setEndDate) {
                    internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /ok/i }));
                }
                else {
                    // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                    internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
                }
            }
            return newValue;
        },
    }); });
});

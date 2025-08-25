"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var pickers_1 = require("test/utils/pickers");
describe('<DateTimeField /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DateTimeField_1.DateTimeField, function () { return ({
        render: render,
        componentFamily: 'field',
        values: [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-02')],
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
            var selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue = pickers_1.adapterToUse.addDays(value, 1);
            selectSection('day');
            pressKey(undefined, 'ArrowUp');
            return newValue;
        },
    }); });
});

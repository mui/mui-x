"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var TimeField_1 = require("@mui/x-date-pickers/TimeField");
describe('<TimeField /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(TimeField_1.TimeField, function () { return ({
        render: render,
        componentFamily: 'field',
        values: [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-02')],
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
            var selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue = pickers_1.adapterToUse.addHours(value, 1);
            selectSection('hours');
            pressKey(undefined, 'ArrowUp');
            return newValue;
        },
    }); });
});

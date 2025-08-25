"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateField_1 = require("@mui/x-date-pickers/DateField");
var pickers_1 = require("test/utils/pickers");
describe('<DateField /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DateField_1.DateField, function () { return ({
        render: render,
        componentFamily: 'field',
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
            var selectSection = _a.selectSection, pressKey = _a.pressKey;
            var newValue = pickers_1.adapterToUse.addDays(value, 1);
            selectSection('day');
            pressKey(undefined, 'ArrowUp');
            return newValue;
        },
    }); });
});

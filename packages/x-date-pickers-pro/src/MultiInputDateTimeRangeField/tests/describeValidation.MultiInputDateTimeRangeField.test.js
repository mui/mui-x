"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiInputDateTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateTimeRangeField");
var pickers_1 = require("test/utils/pickers");
describe('<MultiInputDateTimeRangeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(MultiInputDateTimeRangeField_1.MultiInputDateTimeRangeField, function () { return ({
        render: render,
        componentFamily: 'field',
        fieldType: 'multi-input',
        views: ['year', 'month', 'day', 'hours', 'minutes'],
        setValue: function (value, _a) {
            var _b = _a === void 0 ? {} : _a, setEndDate = _b.setEndDate;
            (0, pickers_1.setValueOnFieldInput)(pickers_1.adapterToUse.format(value, 'keyboardDateTime12h'), setEndDate ? 1 : 0);
        },
    }); });
});

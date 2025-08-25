"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiInputDateRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateRangeField");
var pickers_1 = require("test/utils/pickers");
describe('<MultiInputDateRangeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(MultiInputDateRangeField_1.MultiInputDateRangeField, function () { return ({
        render: render,
        componentFamily: 'field',
        fieldType: 'multi-input',
        views: ['year', 'month', 'day'],
        setValue: function (value, _a) {
            var _b = _a === void 0 ? {} : _a, setEndDate = _b.setEndDate;
            (0, pickers_1.setValueOnFieldInput)(pickers_1.adapterToUse.format(value, 'keyboardDate'), setEndDate ? 1 : 0);
        },
    }); });
});

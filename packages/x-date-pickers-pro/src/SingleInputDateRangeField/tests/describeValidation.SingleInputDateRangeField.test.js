"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingleInputDateRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateRangeField");
var pickers_1 = require("test/utils/pickers");
describe('<SingleInputDateRangeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(SingleInputDateRangeField_1.SingleInputDateRangeField, function () { return ({
        render: render,
        componentFamily: 'field',
        views: ['year', 'month', 'day'],
        fieldType: 'single-input',
    }); });
});

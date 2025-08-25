"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingleInputDateTimeRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateTimeRangeField");
var pickers_1 = require("test/utils/pickers");
describe('<SingleInputDateTimeRangeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(SingleInputDateTimeRangeField_1.SingleInputDateTimeRangeField, function () { return ({
        render: render,
        componentFamily: 'field',
        views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
        fieldType: 'single-input',
    }); });
});

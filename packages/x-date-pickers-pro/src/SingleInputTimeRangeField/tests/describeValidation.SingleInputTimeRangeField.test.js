"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingleInputTimeRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputTimeRangeField");
var pickers_1 = require("test/utils/pickers");
describe('<SingleInputTimeRangeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(SingleInputTimeRangeField_1.SingleInputTimeRangeField, function () { return ({
        render: render,
        componentFamily: 'field',
        views: ['hours', 'minutes', 'seconds'],
        fieldType: 'single-input',
    }); });
});

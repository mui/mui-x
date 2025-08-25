"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var pickers_1 = require("test/utils/pickers");
describe('<DateTimeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(DateTimeField_1.DateTimeField, function () { return ({
        render: render,
        views: ['year', 'month', 'day', 'hours', 'minutes'],
        componentFamily: 'field',
    }); });
});

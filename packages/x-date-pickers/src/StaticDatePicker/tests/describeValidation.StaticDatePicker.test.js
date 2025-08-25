"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var StaticDatePicker_1 = require("@mui/x-date-pickers/StaticDatePicker");
describe('<StaticDatePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(StaticDatePicker_1.StaticDatePicker, function () { return ({
        render: render,
        views: ['year', 'month', 'day'],
        componentFamily: 'static-picker',
    }); });
});

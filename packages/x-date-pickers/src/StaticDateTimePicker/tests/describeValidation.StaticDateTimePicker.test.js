"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var StaticDateTimePicker_1 = require("@mui/x-date-pickers/StaticDateTimePicker");
describe('<StaticDateTimePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(StaticDateTimePicker_1.StaticDateTimePicker, function () { return ({
        render: render,
        views: ['year', 'month', 'day', 'hours', 'minutes'],
        componentFamily: 'static-picker',
    }); });
});

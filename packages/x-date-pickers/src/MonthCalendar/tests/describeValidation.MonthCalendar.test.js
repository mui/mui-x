"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MonthCalendar_1 = require("@mui/x-date-pickers/MonthCalendar");
describe('<MonthCalendar /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(MonthCalendar_1.MonthCalendar, function () { return ({
        render: render,
        views: ['month'],
        componentFamily: 'calendar',
    }); });
});

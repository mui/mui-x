"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var YearCalendar_1 = require("@mui/x-date-pickers/YearCalendar");
var pickers_1 = require("test/utils/pickers");
describe('<YearCalendar /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(YearCalendar_1.YearCalendar, function () { return ({
        render: render,
        views: ['year'],
        componentFamily: 'calendar',
    }); });
});
